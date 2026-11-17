// Supabase Edge Function: מיילים אוטומטיים לאורחים, נשלחים מ-Gmail.
// נקראת רק מתוך מסד הנתונים (supabase/emails.sql):
//   { type: 'confirmation', id }  טריגר בהזמנה חדשה
//   { type: 'reminders' }         pg_cron כל שעה; שולח מהשעה REMINDER_HOUR (10) בשעון ישראל,
//                                  כך שגם הזמנה שנסגרה מאוחר יותר לכניסה למחרת מקבלת תזכורת
//   { type: 'reminders', force: true }  לבדיקה ידנית בלי לחכות לשעה
import nodemailer from 'npm:nodemailer@6.9.16';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import { type Booking, type Config, confirmationEmail, reminderEmail } from './templates.ts';

const env = (k: string) => Deno.env.get(k) ?? '';
const config: Config = { address: env('APARTMENT_ADDRESS'), infoUrl: env('INFO_URL'), arrivalCode: env('ARRIVAL_CODE') };

// SUPABASE_URL ו-SUPABASE_SERVICE_ROLE_KEY מוגדרים אוטומטית בכל Edge Function
const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));
const mailer = nodemailer.createTransport({
  // פורט 465: Edge Functions חוסמות את 587
  host: 'smtp.gmail.com', port: 465, secure: true,
  auth: { user: env('GMAIL_USER'), pass: env('GMAIL_APP_PASSWORD') },
});

// תאריך ושעה בישראל, בלי קשר לאזור הזמן של השרת
function israelNow(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(Date.now() + offsetDays * 864e5));
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
}

async function send(b: Booking, mail: { subject: string; html: string; text: string }, sentColumn: string) {
  await mailer.sendMail({ from: `"${env('SENDER_NAME') || 'דירת הנופש'}" <${env('GMAIL_USER')}>`, to: b.guest_email, ...mail });
  const { error } = await db.from('bookings').update({ [sentColumn]: new Date().toISOString() }).eq('id', b.id);
  if (error) throw error;
}

async function sendConfirmation(id: string) {
  const { data, error } = await db.from('bookings').select('*')
    .eq('id', id).is('confirmation_sent_at', null).not('guest_email', 'is', null).maybeSingle();
  if (error) throw error;
  if (!data) return 0;
  await send(data, confirmationEmail(data, config), 'confirmation_sent_at');
  return 1;
}

async function sendReminders(force: boolean) {
  if (!force && israelNow().hour < Number(env('REMINDER_HOUR') || 10)) return 0;
  const { data, error } = await db.from('bookings').select('*')
    .eq('check_in', israelNow(1).date).eq('status', 'scheduled')
    .is('reminder_sent_at', null).not('guest_email', 'is', null);
  if (error) throw error;
  for (const b of data) await send(b, reminderEmail(b, config), 'reminder_sent_at');
  return data.length;
}

Deno.serve(async (req) => {
  const secret = env('FUNCTION_SECRET');
  if (!secret || req.headers.get('x-function-secret') !== secret) return new Response('forbidden', { status: 403 });
  try {
    const { type, id, force } = await req.json();
    const sent = type === 'confirmation' ? await sendConfirmation(id)
      : type === 'reminders' ? await sendReminders(Boolean(force)) : 0;
    return Response.json({ sent });
  } catch (e) {
    console.error(e);
    return Response.json({ error: String(e) }, { status: 500 });
  }
});
