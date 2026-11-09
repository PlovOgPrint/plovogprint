PLOV&PRINT – VERSION 0.2

1. Opret et Supabase-projekt.
2. Kør supabase.sql i Supabase SQL Editor.
3. Opret admin-bruger under Authentication > Users (med email og password).
4. Kør den sidste (udkommenterede) INSERT-linje i SQL-filen efter at have indsat admin-emailen.
5. Supabase Project URL og publishable key er allerede indsat i index.html.
6. Upload index.html til GitHub-repo og deploy med GitHub Pages eller Vercel.
7. Kunden ser formularen på forsiden. Admin åbner #admin.

BEMÆRK: Brug ALDRIG Supabase service_role/secret key i HTML.
VIGTIGT: Upload er i første version anonym. Beskyt mod spam og misbrug med CAPTCHA, rate limiting og server-side validering inden offentlig lancering. Uploadede billeder kan blive liggende, hvis en ordre fejler efter upload. Lav en oprydningsrutine. Indsaml kun nødvendige personoplysninger, fastsæt slettefrist og offentliggør privatlivstekst.
