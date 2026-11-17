import { supabase } from '../supabaseClient';
import { mockBookings } from './mockData';

// מצב דמו: אין מפתחות ב-.env, והנתונים חיים רק ב-state של React
export const isMock = !supabase;

const T = 'bookings';
// *_sent_at נכתבים רק על ידי פונקציית ההודעות ב-Supabase, ו-checkout_* רק על ידי מסד הנתונים
// ודף היציאה, ולכן נקראים אבל לא נכתבים
const COLUMNS = 'id, guest_name, guest_phone, guest_email, check_in, check_out, status, notes, confirmation_sent_at, reminder_sent_at, checkout_token, checkout_done_at';

// רק העמודות שמותר לכתוב (בלי id), ושדות ריקים כ-null
const toRow = ({ guest_name, guest_phone, guest_email, check_in, check_out, status, notes }) =>
  ({ guest_name, guest_phone: guest_phone || null, guest_email: guest_email || null, check_in, check_out, status, notes: notes || null });

async function query(request) {
  const { data, error } = await request;
  // 23P01: אילוץ החפיפה ב-schema.sql (גיבוי לבדיקה שבטופס)
  if (error) throw new Error(error.code === '23P01' ? 'התאריכים חופפים לשהות קיימת' : error.message);
  return data;
}

export async function listBookings() {
  if (isMock) return mockBookings();
  return query(supabase.from(T).select(COLUMNS).order('check_in'));
}

export async function createBooking(b) {
  if (isMock) return { ...b, id: 'local-' + Date.now() };
  return query(supabase.from(T).insert(toRow(b)).select(COLUMNS).single());
}

export async function updateBooking(b) {
  if (isMock) return b;
  return query(supabase.from(T).update(toRow(b)).eq('id', b.id).select(COLUMNS).single());
}

export async function deleteBooking(id) {
  if (isMock) return;
  await query(supabase.from(T).delete().eq('id', id));
}

// דף היציאה (בלי התחברות): ההזמנה של הקוד שבקישור, או null אם הקוד לא קיים
export async function getCheckout(token) {
  if (isMock) return { guest_name: 'כהן', check_out: '', done_at: null };
  const rows = await query(supabase.rpc('checkout_info', { token }));
  return rows[0] ?? null;
}

export async function confirmCheckout(token) {
  if (isMock) return new Date().toISOString();
  return query(supabase.rpc('confirm_checkout', { token }));
}
