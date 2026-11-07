-- =====================================================================
-- DeutschKurs – Konten (Benutzername + Passwort) und Lernfortschritt
-- Für Supabase (PostgreSQL). Einmal komplett im SQL-Editor ausführen.
-- Das Skript kann gefahrlos erneut ausgeführt werden.
--
-- Sicherheit:
--  * Die Tabellen sind für App/Webapp NICHT direkt lesbar (Row Level Security ohne Policies).
--  * Zugriff nur über die Funktionen dk_* unten (SECURITY DEFINER).
--  * Passwörter werden mit bcrypt gehasht, Sitzungs-Tokens nur als SHA-256-Hash gespeichert.
--  * Nach 5 falschen Passwörtern ist ein Konto 10 Minuten gesperrt.
-- =====================================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.dk_accounts (
  id            bigint generated always as identity primary key,
  username      text not null unique,          -- klein geschrieben, zum Vergleichen
  display_name  text not null,                 -- wie bei der Registrierung eingegeben
  password_hash text not null,
  failed_logins int not null default 0,
  locked_until  timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.dk_sessions (
  token_hash  text primary key,
  account_id  bigint not null references public.dk_accounts(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default now() + interval '180 days'
);
create index if not exists dk_sessions_account on public.dk_sessions(account_id);

create table if not exists public.dk_progress (
  account_id  bigint primary key references public.dk_accounts(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.dk_accounts enable row level security;
alter table public.dk_sessions enable row level security;
alter table public.dk_progress enable row level security;
revoke all on public.dk_accounts, public.dk_sessions, public.dk_progress from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on public.dk_accounts, public.dk_sessions, public.dk_progress from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on public.dk_accounts, public.dk_sessions, public.dk_progress from authenticated';
  end if;
end $$;

-- ---------------------------------------------------------------------
-- Hilfsfunktionen (nicht von außen aufrufbar)
-- ---------------------------------------------------------------------

-- Neue Sitzung anlegen; gibt das Klartext-Token zurück (nur der Client kennt es).
create or replace function public.dk_new_session(p_account bigint)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare
  v_token text := encode(gen_random_bytes(32), 'hex');
begin
  delete from dk_sessions where account_id = p_account and expires_at < now();
  insert into dk_sessions(token_hash, account_id) values (encode(digest(v_token, 'sha256'), 'hex'), p_account);
  return v_token;
end $$;

-- Konto zu einem gültigen Token, sonst null.
create or replace function public.dk_account_for(p_token text)
returns bigint language sql stable security definer set search_path = public, extensions as $$
  select account_id from dk_sessions
  where token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex') and expires_at > now();
$$;

-- ---------------------------------------------------------------------
-- Öffentliche Funktionen (Aufruf über /rest/v1/rpc/<name>)
-- Alle geben JSON zurück; bei Fehlern {"error": "<code>"}.
-- ---------------------------------------------------------------------

-- Registrieren. Benutzername: 3–20 Zeichen (Buchstaben, Ziffern, _ . -), Passwort: 6–72 Zeichen.
create or replace function public.dk_register(p_username text, p_password text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text := btrim(coalesce(p_username, ''));
  v_id bigint;
begin
  if v_name !~ '^[A-Za-z0-9_.-]{3,20}$' then return json_build_object('error', 'invalid_username'); end if;
  if length(coalesce(p_password, '')) < 6 or octet_length(p_password) > 72 then
    return json_build_object('error', 'invalid_password');
  end if;
  begin
    insert into dk_accounts(username, display_name, password_hash)
    values (lower(v_name), v_name, crypt(p_password, gen_salt('bf', 10)))
    returning id into v_id;
  exception when unique_violation then
    return json_build_object('error', 'username_taken');
  end;
  insert into dk_progress(account_id) values (v_id);
  return json_build_object('token', dk_new_session(v_id), 'username', v_name, 'data', '{}'::json, 'updated_at', now());
end $$;

-- Anmelden. Gibt Token und gespeicherten Fortschritt zurück.
create or replace function public.dk_login(p_username text, p_password text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  a dk_accounts%rowtype;
  p dk_progress%rowtype;
begin
  select * into a from dk_accounts where username = lower(btrim(coalesce(p_username, '')));
  if not found then
    perform crypt(coalesce(p_password, ''), gen_salt('bf', 10)); -- gleiche Rechenzeit wie bei echtem Konto
    return json_build_object('error', 'invalid_login');
  end if;
  if a.locked_until is not null and a.locked_until > now() then
    return json_build_object('error', 'locked', 'until', a.locked_until);
  end if;
  if a.password_hash <> crypt(coalesce(p_password, ''), a.password_hash) then
    update dk_accounts set
      failed_logins = case when failed_logins + 1 >= 5 then 0 else failed_logins + 1 end,
      locked_until  = case when failed_logins + 1 >= 5 then now() + interval '10 minutes' else null end
    where id = a.id;
    return json_build_object('error', 'invalid_login');
  end if;
  update dk_accounts set failed_logins = 0, locked_until = null where id = a.id;
  select * into p from dk_progress where account_id = a.id;
  return json_build_object(
    'token', dk_new_session(a.id), 'username', a.display_name,
    'data', coalesce(p.data, '{}'::jsonb), 'updated_at', p.updated_at);
end $$;

-- Fortschritt laden.
create or replace function public.dk_load(p_token text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_id bigint := dk_account_for(p_token);
  p dk_progress%rowtype;
begin
  if v_id is null then return json_build_object('error', 'session_expired'); end if;
  select * into p from dk_progress where account_id = v_id;
  return json_build_object(
    'username', (select display_name from dk_accounts where id = v_id),
    'data', coalesce(p.data, '{}'::jsonb), 'updated_at', p.updated_at);
end $$;

-- Fortschritt speichern (ersetzt den gespeicherten Stand; max. 256 KB).
create or replace function public.dk_save(p_token text, p_data jsonb)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_id bigint := dk_account_for(p_token);
  v_now timestamptz := now();
begin
  if v_id is null then return json_build_object('error', 'session_expired'); end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' then return json_build_object('error', 'invalid_data'); end if;
  if octet_length(p_data::text) > 262144 then return json_build_object('error', 'too_large'); end if;
  insert into dk_progress(account_id, data, updated_at) values (v_id, p_data, v_now)
  on conflict (account_id) do update set data = excluded.data, updated_at = excluded.updated_at;
  return json_build_object('ok', true, 'updated_at', v_now);
end $$;

-- Abmelden (Token ungültig machen).
create or replace function public.dk_logout(p_token text)
returns json language plpgsql security definer set search_path = public, extensions as $$
begin
  delete from dk_sessions where token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');
  return json_build_object('ok', true);
end $$;

-- Konto mit allen Daten löschen (Passwort zur Bestätigung).
create or replace function public.dk_delete_account(p_token text, p_password text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare
  v_id bigint := dk_account_for(p_token);
  v_hash text;
begin
  if v_id is null then return json_build_object('error', 'session_expired'); end if;
  select password_hash into v_hash from dk_accounts where id = v_id;
  if v_hash <> crypt(coalesce(p_password, ''), v_hash) then return json_build_object('error', 'invalid_login'); end if;
  delete from dk_accounts where id = v_id;
  return json_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------
-- Rechte: nur die öffentlichen Funktionen sind von außen aufrufbar.
-- ---------------------------------------------------------------------
revoke all on function public.dk_new_session(bigint) from public;
revoke all on function public.dk_account_for(text) from public;
revoke all on function public.dk_register(text, text) from public;
revoke all on function public.dk_login(text, text) from public;
revoke all on function public.dk_load(text) from public;
revoke all on function public.dk_save(text, jsonb) from public;
revoke all on function public.dk_logout(text) from public;
revoke all on function public.dk_delete_account(text, text) from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on function public.dk_new_session(bigint), public.dk_account_for(text) from %I', r);
      execute format('grant execute on function public.dk_register(text, text), public.dk_login(text, text), '
        'public.dk_load(text), public.dk_save(text, jsonb), public.dk_logout(text), '
        'public.dk_delete_account(text, text) to %I', r);
    end if;
  end loop;
end $$;
