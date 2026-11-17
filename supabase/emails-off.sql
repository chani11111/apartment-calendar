-- עצירת המיילים האוטומטיים לאורחים. בטוח להריץ שוב.
-- הפונקציה, הסודות והעמודות נשארים; להפעלה מחדש מריצים שוב את emails.sql.

drop trigger if exists booking_confirmation on public.bookings;
select cron.unschedule('booking-reminders') where exists (select 1 from cron.job where jobname = 'booking-reminders');
