-- שליחת מיילים אוטומטית לאורחים. בטוח להריץ שוב.
-- להריץ ב-SQL Editor אחרי schema.sql ואחרי שהפונקציה booking-emails פרוסה (הוראות ב-README).
-- הכתובת למטה היא של הפרויקט הנוכחי. בפרויקט אחר יש להחליף את המזהה.

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

-- כתובת הפונקציה וסוד משותף נשמרים ב-Vault, לא בקוד
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'booking_emails_url') then
    perform vault.create_secret('https://hhlrbxucxlvmpmhvdpah.supabase.co/functions/v1/booking-emails', 'booking_emails_url');
  end if;
  if not exists (select 1 from vault.secrets where name = 'booking_emails_secret') then
    perform vault.create_secret(replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''), 'booking_emails_secret');
  end if;
end $$;

-- קריאה לפונקציה (אסינכרונית, דרך pg_net)
create or replace function public.call_booking_emails(payload jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'booking_emails_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-function-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'booking_emails_secret')),
    body := payload
  );
end $$;
-- לא לחשוף לאתר (anon) דרך RPC
revoke execute on function public.call_booking_emails(jsonb) from public, anon, authenticated;

-- מייל אישור: בהזמנה חדשה עם אימייל, או כשמוסיפים אימייל להזמנה שעוד לא קיבלה אישור
create or replace function public.booking_confirmation_trigger() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.guest_email is not null and new.confirmation_sent_at is null then
    perform public.call_booking_emails(jsonb_build_object('type', 'confirmation', 'id', new.id));
  end if;
  return new;
end $$;

drop trigger if exists booking_confirmation on public.bookings;
create trigger booking_confirmation
  after insert or update of guest_email on public.bookings
  for each row execute function public.booking_confirmation_trigger();

-- תזכורת: pg_cron עובד ב-UTC, אז מריצים כל שעה והפונקציה שולחת רק בשעה REMINDER_HOUR בשעון ישראל.
-- כך שעון קיץ/חורף לא משנה.
select cron.schedule('booking-reminders', '0 * * * *', $$ select public.call_booking_emails('{"type":"reminders"}'::jsonb) $$);

-- להעתקת הסוד להגדרות הפונקציה (FUNCTION_SECRET):
-- select decrypted_secret from vault.decrypted_secrets where name = 'booking_emails_secret';
