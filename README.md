# DeutschKurs – Web-App

Web-Version der Android-App **DeutschKurs** (Lernen · Üben · Aufsteigen) – mit allen Übungsmodi und Inhalten der App:

- 🎲 Mix · 📚 Vokabeln · ⚡ Verben · 🎯 Fälle · ⏳ Zeitformen · 💭 Konjunktiv II · 🧩 Grammatik · 🧱 Satzbau · ✍️ Rechtschreibung
- 🧭 Einstufungstest: findet heraus, welche Gruppe (A1, A2, B1, B2) am besten passt, und stellt auf Wunsch den Schwierigkeitsgrad ein
- 👤 Konto mit Benutzername + Passwort (ohne E-Mail): Fortschritt wird im Konto gespeichert und zwischen App und Webapp abgeglichen
- Stufen A1 bis B2, automatische oder feste Schwierigkeit, Punkte, Serien, Rundenbonus, 20 Auszeichnungen
- Fehler werden gespeichert und kommen öfter wieder, bis sie sitzen
- Übersetzungen und Erklärungen auf Russisch, Ukrainisch, Armenisch und Georgisch
- Vorlesen mit deutscher Stimme (Sprachausgabe des Geräts)
- Funktioniert offline und lässt sich auf dem Startbildschirm installieren (PWA)

Ohne Anmeldung wird der Fortschritt nur lokal im Browser gespeichert.

**Installieren:** Seite im Handy-Browser öffnen → Android/Chrome: Menü ⋮ → „App installieren“ / „Zum Startbildschirm hinzufügen“; iPhone/Safari: Teilen → „Zum Home-Bildschirm“.

## Konto-Datenbank einrichten (einmalig, ca. 5 Minuten)

Die Datenbank ist PostgreSQL (SQL) bei [Supabase](https://supabase.com) (kostenloser Tarif reicht). Das komplette Schema liegt hier im Repository: [`supabase/schema.sql`](supabase/schema.sql).

1. Auf supabase.com ein Konto anlegen → **New project** (Region z. B. Frankfurt, ein Datenbank-Passwort vergeben).
2. Im Projekt links **SQL Editor** → **New query** → den Inhalt von `supabase/schema.sql` einfügen → **Run**.
3. **Project Settings → API** öffnen und zwei Werte kopieren:
   - **Project URL** (z. B. `https://abcdefghijklm.supabase.co`)
   - **anon public** Key (bzw. „publishable key“)
4. Eintragen in
   - Webapp: `js/config.js` → `SUPABASE_URL` und `SUPABASE_ANON_KEY`
   - Android-App: `app/src/main/java/com/example/deutschkurs/game/CloudConfig.kt` → gleiche Werte, dann App neu bauen
5. Webapp neu hochladen. Auf der Startseite erscheint jetzt „Anmelden“.

⚠️ Nur den **anon/public**-Key verwenden, **niemals** den `service_role`-Key – der wäre öffentlich sichtbar.

**Sicherheit:** Die Tabellen sind von außen nicht lesbar; App und Webapp können nur die Funktionen `dk_register`, `dk_login`, `dk_load`, `dk_save`, `dk_logout` und `dk_delete_account` aufrufen. Passwörter werden mit bcrypt gehasht, nach 5 Fehlversuchen ist ein Konto 10 Minuten gesperrt. Da es keine E-Mail gibt, kann ein vergessenes Passwort nicht zurückgesetzt werden.

**Abgleich:** Beim Anmelden wird der Fortschritt des Geräts mit dem Konto zusammengeführt (die Seite mit mehr beantworteten Fragen zählt, Rekorde und Auszeichnungen bleiben erhalten). Danach wird nach jeder Runde und nach dem Einstufungstest automatisch gespeichert. Beim Abmelden wird der Fortschritt vom Gerät entfernt – er bleibt im Konto.

Hinweis: Kostenlose Supabase-Projekte werden nach etwa einer Woche ohne Nutzung pausiert und lassen sich im Dashboard mit einem Klick wieder starten.
