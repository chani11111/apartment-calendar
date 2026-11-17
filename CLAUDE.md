# CLAUDE.md

Admin-only, single-screen monthly calendar for a community vacation apartment. All UI in Hebrew, `dir="rtl"`. Full spec: `SPEC.md`.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # run after every change; must pass
```

No test runner is set up. Pure logic lives in `src/lib/` so it can be checked in isolation.

Stack: Vite 5 + React 18, Tailwind CSS v3, lucide-react, @supabase/supabase-js. Do not add other libraries without asking the user.

## Modes

- **Demo**: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` empty → `supabase` is `null`, `isMock` is true, 4 sample bookings in the current month (`lib/mockData.js`), changes live only in React state.
- **Supabase**: run `supabase/schema.sql` in the SQL Editor, fill `.env`. Template: `.env.example`.
- `VITE_APARTMENT_ADDRESS` is the address in the WhatsApp message.

## Structure

```
src/
  App.jsx                 composition: month cursor + which modal is open
  supabaseClient.js       client or null (demo mode)
  lib/                    pure logic, no React
    dates.js              YYYY-MM-DD string helpers, Hebrew month/day names
    calendar.js           buildMonthGrid, occupies, dayBookings, findOverlap
    booking.js            newBooking defaults, validateBooking
    whatsapp.js           wa.me link + message text
    mockData.js           demo bookings
    bookingsApi.js        CRUD; the only place that branches on demo vs Supabase
  hooks/
    useBookings.js        bookings state + save/remove (errors are thrown to the caller)
    useAsyncAction.js     busy/error state shared by the modals
  components/
    ui/                   Modal, Field, HebrewDateInput, styles.js (shared button/input classes)
    calendar/             CalendarHeader, CalendarGrid, DayCell, BookingChip, DepartureTag, MonthAgenda
    booking/              BookingFormModal, BookingViewModal
supabase/schema.sql       bookings table, overlap constraint, RLS policy
```

## Domain rules

- Dates are `YYYY-MM-DD` strings everywhere (matches the Postgres `date` column); string comparison is date comparison. Avoid `toISOString()` (UTC shift).
- A booking occupies nights `check_in <= day < check_out`. The check-out day is **free** for a new check-in and shows a `DepartureTag` instead of a chip.
- Bookings may not overlap. This is checked in the form (`validateBooking`) and enforced in the DB (`bookings_no_overlap` exclusion constraint; error code `23P01` is mapped to Hebrew in `bookingsApi.js`).
- Status is hidden from the UI (user asked, 2026-11-17): no badge, legend, form field or quick-update button; all chips use one color (`bg-sage/10 text-sage`). The `status` column stays; new bookings get `scheduled` (`newBooking`) and edits keep the existing value, because the reminder email filters on `scheduled`.
- Phone numbers are assumed Israeli: leading `0` → `972` for wa.me.
- Deviations from SPEC.md requested by the user: the name field is a general "שם" (not "שם משפחה"), shown without a "משפחת" prefix. The per-booking door code is removed from the UI, emails and WhatsApp; the `door_code` column stays in the DB with its default `1234`, unused. Do not confuse it with `ARRIVAL_CODE` (see Guest emails).

## Design decisions

- Warm Minimalist palette from SPEC.md is defined as Tailwind colors in `tailwind.config.js` (`cream`, `line`, `sage`, `ink`, `muted`, `faint`, `clay`). Use these names, not hex values.
- Borders instead of shadows. Rounded corners: `rounded-2xl` for cards and modals, `rounded-lg` for controls.
- Multi-day stays are drawn as a continuous bar: one `BookingChip` per day, rounded corners and the family name only at the start of a segment (check-in day or Sunday) and corners at the end (last night or Saturday).
- Use logical properties (`ps-`, `pe-`, `border-s`, `rounded-s-`, `text-start`) so RTL is handled automatically. In the header, "previous" is `ChevronRight`.
- The view modal reads the booking from the list by id, so changes show immediately in the open modal.
- Delete asks for a second click instead of `window.confirm`.
- Mobile-first: the app is headed for Android. Below Tailwind's `sm` (640px): short day names, departure tag as icon only, a floating "+" button instead of the header button, modals as bottom sheets, taller inputs with `text-base` (prevents focus zoom), and `MonthAgenda` (list of the month's stays) under the grid because names truncate in ~50px cells. Respect `env(safe-area-inset-bottom)` for anything fixed to the bottom.
- Font: Heebo from Google Fonts (`index.html`).
- Hebrew dates (`lib/hebrewDate.js`) come from the browser's built-in `Intl` Hebrew calendar (`he-IL-u-ca-hebrew-nu-latn`) plus a local `gematria()`; no Hebcal API call. Shown in each `DayCell` (day letters; month name on the 1st, `sm` and up), under the month title, and in the view modal. Hebcal is only worth adding if holidays or Shabbat times are wanted.
- The booking form picks dates by Hebrew day/month/year (`ui/HebrewDateInput.jsx`), showing the Gregorian date underneath; the stored value is still `YYYY-MM-DD`. Hebrew→Gregorian uses `hebrewYear()`, which scans a Hebrew year's days once and caches it (Intl only converts Gregorian→Hebrew). Adar ↔ Adar I/II is mapped when switching between regular and leap years.
- Pending (user asked, 2026-11-02): replace guest emails with paid WhatsApp (Meta WhatsApp Cloud API, plain `fetch` from the Edge Function, approved templates for confirmation/reminder) plus a reply bot via webhook. Waiting on: phone number, what the bot should do, whether emails stay as backup.
- Keep files short and logic single-sourced: shared classes in `ui/styles.js`, rules in `lib/`.

## Guest emails

**Paused (user asked, 2026-11-12):** `supabase/emails-off.sql` drops the confirmation trigger and unschedules the cron; the function, secrets and columns stay. The app no longer shows sent status and the email field is just "אימייל". To resume: re-run `emails.sql` (it creates the URL secret only if missing, so the `quick-service` URL survives) and restore the sent rows in `BookingViewModal`.

Free, via the user's Gmail (app password) from a Supabase Edge Function; setup steps in README. The user approved `nodemailer` for the function only (not in the frontend bundle).
- Deployed name in the user's project is **`quick-service`** (dashboard auto-name; Supabase can't rename). The Vault secret `booking_emails_url` points to `/functions/v1/quick-service`. The repo folder keeps the name `booking-emails`.
- `supabase/functions/booking-emails/`: `index.ts` (handler, DB queries, Gmail SMTP on port 465 because Edge Functions block 587), `templates.ts` (RTL HTML + text emails).
- `supabase/emails.sql`: pg_net + pg_cron, Vault secrets (function URL and a shared secret sent as `x-function-secret`; the function runs with Verify JWT off), `call_booking_emails()` (execute revoked from anon), confirmation trigger on insert / `update of guest_email`, hourly cron. The function sends reminders only when the Israel-time hour equals `REMINDER_HOUR` (default 10), so DST needs no cron changes.
- Confirmation: name, dates, `INFO_URL` link. Reminder (check-in tomorrow, status `scheduled`): name, dates, address, "קוד הגעה וכניסה" line, `INFO_URL` link.
- `ARRIVAL_CODE` (function secret) is one fixed code for all guests: it unlocks the "הגעה וכניסה" tab on the `INFO_URL` page. It is not the apartment door code and is not stored per booking.
- Reminder timing (Israel time): hourly from `REMINDER_HOUR` (10) until midnight, so it goes out at 10:00 or as soon as a later booking for tomorrow is created. `force: true` sends immediately.
- `confirmation_sent_at` / `reminder_sent_at` make sending idempotent; they are read by the app (shown in the view modal) but never written by it (`toRow` excludes them).
- A booking created after 10:00 for the next day still gets a reminder (hourly window until midnight); one created for the same day does not.
- Open question to the user: `INFO_URL` is one fixed link for now; a per-booking guest page was offered as an alternative.

## Android (PWA)

Personal use only, not for an app store, so it ships as an installable PWA (no Capacitor, no extra libraries):
`public/manifest.webmanifest` + `public/icon-192.png`, `icon-512.png` (also `maskable`), `apple-touch-icon.png`, linked from `index.html`.
Hosting: GitHub Pages, public repo (user's choice; data is protected by auth + RLS, `.env` is gitignored). `.github/workflows/deploy.yml` builds on push to `main` with the three `VITE_*` values from repo Actions secrets. The site lives under `/apartment-calendar/`, so `vite.config.js` uses `base: './'` and the manifest uses relative paths; keep new asset paths relative.
Install: open the Pages URL in Chrome on Android → "Add to Home screen" / "Install app".
No service worker: the data lives in Supabase, so offline mode would not be useful; Chrome no longer requires one to install.
Icons were generated by a throwaway Node script (sage background, cream calendar, content inside the 80% maskable safe zone); to change them, redraw at the same sizes.

## Security

Email + password login via Supabase Auth (part of supabase-js, no extra library). Single user: the manager, created by hand in the Dashboard with public sign-ups turned off.
- `main.jsx` wraps `App` in `AuthGate` (`components/auth/`): demo mode skips auth; otherwise `useSession` → `LoginScreen` until signed in. `App` mounts only after login, so `useBookings` loads with a session.
- RLS in `schema.sql`: `for all to authenticated`. The anon key alone reads nothing. The email function uses the service role and is unaffected.
- Sign-out: small "התנתקות" link at the bottom of `App`. No password reset UI; reset from the Dashboard.
