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

1. **Disconnect Supabase / enable Lovable Cloud** on the project. This provisions a fresh backend and rewrites `.env` and `src/integrations/supabase/client.ts`.
2. **Recreate the schema** by running one consolidated migration that reproduces the current end state (enum, 6 tables, grants, RLS policies, functions, triggers) rather than replaying 21 historical migrations.
3. **Redeploy the edge functions** — the code is already in the repo, so they deploy automatically; `supabase/config.toml` gets the new project ref and keeps the four `verify_jwt = false` entries.
4. **Re-add all 16 secrets** in the new backend. Values are not transferable automatically — you need the PayFast, Zoho, Google service account, Resend and Facebook credentials on hand.
5. **Export and import data**: dump the 6 tables from the old project (Cloud/SQL editor export), then insert into the new one. Order matters because of foreign keys and the booking triggers — bookings should be imported with triggers temporarily disabled so availability counts are not double-counted.
6. **Auth users**: passwords cannot be exported. Options are (a) ask everyone to re-register or use password reset against the new project, or (b) recreate accounts server-side and force a reset email. Admin role rows in `user_roles` must be re-pointed at the new user IDs — `bootstrap-admin` can re-seed the first admin.
7. **Update external webhooks**: PayFast ITN/notify URLs, Zoho OAuth redirect URI, and Google Calendar settings all point at the old project's function URLs and must be repointed to the new ones.
8. **Verify**: sign-up/sign-in, booking creation (trigger sets `user_id`), availability updates, a PayFast sandbox payment round-trip, booking summary email, and admin dashboard access.

## Risks and things to decide before starting

- **Downtime / dual-write window**: bookings placed during the cutover on the old project would be lost unless you freeze bookings while migrating.
- **User re-authentication is almost certain.**
- **PayFast in production**: the webhook URL change must be coordinated so no live payment is confirmed against the dead backend.
- Keep the old Supabase project alive read-only for a while as a fallback.

## Alternative worth considering

If the motivation is billing, dashboard convenience, or not managing an external account, that is a real win. If the current setup works fine, the safer path is staying on Supabase — the two are the same technology, and the migration cost here is mostly the auth users and the live payment integrations, not the database.

## Questions before I start

- What's driving the switch (billing, convenience, something broken)?
- Do you have all 16 secret values available to re-enter?
- Is there live booking/payment traffic right now, or can we take a maintenance window?
- Is it acceptable for existing users to reset their passwords?
