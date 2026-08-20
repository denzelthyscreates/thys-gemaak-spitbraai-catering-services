# Switching from your own Supabase project to Lovable Cloud

## What this actually means

Lovable Cloud runs on Supabase under the hood, but as a project Lovable provisions and manages for you. So this is not a "flip a switch" change — it is a **migration to a brand new backend project**, then repointing the app at it.

There is no automated migration path. Everything below is a manual rebuild plus a data copy.

## What has to move

Your current backend contains:

- **Database**: 6 tables (bookings, blocked_dates, calendar_sync, event_availability, user_roles, zoho_tokens), the `app_role` enum, 3 functions (`has_role`, `enforce_booking_user_id`, `update_event_availability_on_booking`), 2 triggers, plus all RLS policies and grants (including the recent security hardening).
- **21 migration files** in `supabase/migrations/`.
- **11 edge functions**: bootstrap-admin, generate-booking-pdf, get-user-emails, google-calendar-sync, payfast-payment/paynow/webhook, send-booking-summary, send-contact-inquiry, zoho-books-integration, plus `_shared`.
- **16 secrets**: PayFast (4), Zoho (3), Google Calendar (2), Resend, Facebook token, and the auto-managed Supabase ones.
- **Auth users** — every existing signed-up account, including whoever holds the admin role.
- **Live data** — real bookings, availability, Zoho tokens.

## Migration steps

1. **Copy the 11 external secret values** from the old Supabase dashboard (Project Settings → Edge Functions → Secrets, reveal each value). Keep them somewhere safe locally — **do not paste them into chat**.
2. **Disconnect Supabase / enable Lovable Cloud**: In the Lovable editor go to **More > Cloud**, click **Disconnect** next to the connected Supabase project, then click **Enable Cloud**. This provisions a fresh backend and rewrites `.env` and `supabase/config.toml`.
3. **Recreate the schema** by running one consolidated migration that reproduces the current end state (enum, 6 tables, grants, RLS policies, functions, triggers) rather than replaying 21 historical migrations.
4. **Redeploy the edge functions** — the code is already in the repo, so they deploy automatically; `supabase/config.toml` gets the new project ref and keeps the four `verify_jwt = false` entries.
5. **Re-add the 11 external secrets** via Lovable's secure secret form. I will request them after Cloud is enabled; the values go straight into the encrypted store and never pass through the chat.
6. **Export and import data**: dump the 6 tables from the old project (Cloud/SQL editor export), then insert into the new one. Order matters because of foreign keys and the booking triggers — bookings should be imported with triggers temporarily disabled so availability counts are not double-counted.
7. **Auth users**: passwords cannot be exported. Options are (a) ask everyone to re-register or use password reset against the new project, or (b) recreate accounts server-side and force a reset email. Admin role rows in `user_roles` must be re-pointed at the new user IDs — `bootstrap-admin` can re-seed the first admin.
8. **Update external webhooks**: PayFast ITN/notify URLs, Zoho OAuth redirect URI, and Google Calendar settings all point at the old project's function URLs and must be repointed to the new ones.
9. **Verify**: sign-up/sign-in, booking creation (trigger sets `user_id`), availability updates, a PayFast sandbox payment round-trip, booking summary email, and admin dashboard access.

## Your answers, folded in

- **Driver**: free-tier auto-pausing. Lovable Cloud does not pause projects, so this genuinely solves your problem — worth the migration.
- **Traffic**: none live, so we can do a straight cutover with no freeze window and no dual-write.
- **Passwords**: users will re-register or reset — that removes the hardest part of the migration.
- **Secrets**: you can read the values back. In the Supabase dashboard go to **Project Settings → Edge Functions → Secrets**; each secret has a reveal/eye toggle that shows the plaintext value. Copy them out before disconnecting. (The CLI only shows hashes, so use the dashboard.) You only need to re-enter the 11 real ones — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_DB_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `LOVABLE_API_KEY` are auto-provisioned in the new backend.

Secrets to copy: PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE, PAYFAST_RECEIVER_ID, ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_ORGANIZATION_ID, GOOGLE_CALENDAR_ID, GOOGLE_SERVICE_ACCOUNT_KEY, RESEND_API_KEY, FACEBOOK_ACCESS_TOKEN.

## How to handle the secrets you copied

- **Do not paste them here.** Chat is not a secure place for credentials.
- Store them temporarily in a password manager or an offline note while you complete step 2 (enable Lovable Cloud).
- Once Cloud is enabled and you re-open this project in Lovable, I will use the secure `add_secret` form to request each secret. You type the value into the form; it is saved directly to Lovable's encrypted secret store and is never visible to me.
- We will add them after the schema and edge functions are in place, because the functions need the secrets to be present before they can authenticate with PayFast, Zoho, Google, Resend, etc.

## Remaining risks

- Zoho tokens in `zoho_tokens` may need re-authorising if the redirect URI changes.
- PayFast and Google Calendar settings point at the old function URLs and must be repointed.
- Keep the old Supabase project around (unpaused once) until the new one is verified, then let it go.

## Also worth cleaning up during the move

`src/lib/supabase.ts` reads `VITE_SUPABASE_ANON_KEY`, while Lovable Cloud writes `VITE_SUPABASE_PUBLISHABLE_KEY`. I'll point the client at the publishable key so the app doesn't break on the new backend.
