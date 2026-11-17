-- הרצה ב-Supabase: SQL Editor. בטוח להריץ שוב.
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  guest_name  text not null,
  guest_phone text,
  check_in    date not null,
  check_out   date not null,
  door_code   text not null default '1234',
  status      text not null default 'scheduled'
              check (status in ('scheduled','checked_in','checked_out','cleaned')),
  notes       text,
  created_at  timestamptz not null default now(),
  constraint bookings_dates_valid check (check_out > check_in)
);

-- מיילים לאורחים. ה-*_sent_at נכתבים רק על ידי הפונקציה booking-emails (ראו emails.sql)
alter table public.bookings add column if not exists guest_email text;
alter table public.bookings add column if not exists confirmation_sent_at timestamptz;
alter table public.bookings add column if not exists reminder_sent_at timestamptz;

-- סיום שהות: לכל הזמנה קישור אישי לדף "לפני שיוצאים" (?checkout=<checkout_token>)
alter table public.bookings add column if not exists checkout_token uuid not null default gen_random_uuid();
alter table public.bookings add column if not exists checkout_done_at timestamptz;
create unique index if not exists bookings_checkout_token on public.bookings (checkout_token);

-- הדף פתוח בלי התחברות, ולכן ניגש לנתונים רק דרך שתי הפונקציות האלה:
-- קריאה ואישור של ההזמנה האחת שהקוד שלה בקישור. אין דרכן גישה להזמנות אחרות.
create or replace function public.checkout_info(token uuid)
returns table (guest_name text, check_out date, done_at timestamptz)
language sql stable security definer set search_path = public as $$
  select guest_name, check_out, checkout_done_at from bookings where checkout_token = token;
$$;
create or replace function public.confirm_checkout(token uuid) returns timestamptz
language sql security definer set search_path = public as $$
  update bookings set checkout_done_at = coalesce(checkout_done_at, now())
  where checkout_token = token returning checkout_done_at;
$$;
revoke execute on function public.checkout_info(uuid), public.confirm_checkout(uuid) from public;
grant execute on function public.checkout_info(uuid), public.confirm_checkout(uuid) to anon, authenticated;
-- דירה אחת: אסור ששתי שהויות יחפפו. '[)' = יום היציאה פנוי לכניסה הבאה.
-- האילוץ יוצר גם אינדקס על טווח התאריכים.
do $$ begin
  alter table public.bookings add constraint bookings_no_overlap
    exclude using gist (daterange(check_in, check_out, '[)') with &&);
exception when duplicate_object or duplicate_table then null;
end $$;

-- גישה רק למשתמש מחובר (Supabase Auth). ההרשמה החופשית כבויה ב-Dashboard,
-- כך שהמשתמשת היחידה היא המנהלת. ה-anon key לבדו לא נותן גישה לנתונים.
-- פונקציית המיילים עובדת עם service role ולכן לא מושפעת.
alter table public.bookings enable row level security;
drop policy if exists "admin full access (anon)" on public.bookings;
drop policy if exists "admin full access" on public.bookings;
create policy "admin full access" on public.bookings
  for all to authenticated using (true) with check (true);
