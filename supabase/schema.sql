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
