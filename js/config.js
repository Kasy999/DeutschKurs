'use strict';
// Zugang zur Konto-Datenbank (Supabase) – gleiche Werte wie in der Android-App (CloudConfig.kt).
// Supabase-Dashboard → Project Settings → API: "Project URL" und "anon public" Key.
// Der anon-Key ist öffentlich und darf hier stehen. Niemals den "service_role"-Key eintragen!
// Bleiben die Werte leer, ist die Konto-Funktion ausgeblendet.
const CloudConfig = {
  SUPABASE_URL: 'https://sbvojlroazcjumrzjvpu.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_wMkqBIGA_6dTD4i7i29NTQ_AQWYE3q8',
  get configured() { return !!(this.SUPABASE_URL.trim() && this.SUPABASE_ANON_KEY.trim()); },
};
