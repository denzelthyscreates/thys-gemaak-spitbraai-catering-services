# Migrating from the external Supabase project to Lovable Cloud

Everything in this folder was prepared while the project was still connected to
Supabase project `pcvmdyhzufupgckszrdy`. Work through it in order.

## Step 0 — before disconnecting (do this now, while the old project is awake)

Copy the secret values out of the Supabase dashboard:
**Project Settings → Edge Functions → Secrets**, reveal each value and save it
somewhere safe. You need these 11:

```
PAYFAST_MERCHANT_ID
PAYFAST_MERCHANT_KEY
PAYFAST_PASSPHRASE
PAYFAST_RECEIVER_ID
ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET
ZOHO_ORGANIZATION_ID
GOOGLE_CALENDAR_ID
GOOGLE_SERVICE_ACCOUNT_KEY
RESEND_API_KEY
FACEBOOK_ACCESS_TOKEN
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`,
`SUPABASE_SERVICE_ROLE_KEY` and `LOVABLE_API_KEY` are provisioned automatically
on the new backend — do not copy those.

Also note the two admin accounts: `denzel@thysgemaak.com`, `wade@thysgemaak.com`.

## Step 1 — switch the backend

In Lovable: project settings → disconnect Supabase, then enable Lovable Cloud.
This provisions a fresh backend and rewrites `.env` and `supabase/config.toml`.
This is a user action; it cannot be done from chat.

## Step 2 — recreate the schema

Run `01_schema.sql` through the migration tool. It reproduces the final state of
the old database in one go: the `app_role` enum, all 6 tables with their grants,
RLS policies, the three functions, both triggers, and the GraphQL/`SECURITY
DEFINER` hardening that was applied to the old project.

## Step 3 — import the data

1. `02_data.sql` — 7 bookings and 1 calendar_sync row. Booking triggers are
   disabled around the insert so the original `user_id` values survive.
2. `03_event_availability.sql` — 90 availability rows.

`blocked_dates` was empty. `zoho_tokens` is deliberately not exported — the
three rows were short-lived OAuth tokens; re-authorise Zoho instead.

Raw JSON exports live outside the repo at
`/mnt/documents/backend-migration/data/`.

## Step 4 — secrets and edge functions

Add the 11 secrets from step 0 to the new backend. The 11 edge functions deploy
automatically from `supabase/functions/` once Cloud is enabled.

## Step 5 — accounts and admin

Sign up again with `denzel@thysgemaak.com` and `wade@thysgemaak.com` (passwords
do not transfer), then either call the `bootstrap-admin` function or run the
commented statement at the bottom of `02_data.sql` to grant the admin role.

## Step 6 — repoint external services

- PayFast: notify/ITN URL → new project's function URL.
- Zoho Books: OAuth redirect URI → new project.
- Google Calendar: service account still fine, but re-run a sync to confirm.

## Step 7 — verify

Sign up / sign in, create a booking (trigger sets `user_id`), confirm a booking
and check availability decrements, run a PayFast sandbox payment, send a booking
summary email, and open `/admin` as an admin.

## Already done in code

`src/lib/supabase.ts` now reads `VITE_SUPABASE_PUBLISHABLE_KEY` and falls back to
`VITE_SUPABASE_ANON_KEY`, so the client keeps working on both backends.
