import { addDays, showDate, todayStr } from './dates';
import { findOverlap } from './calendar';

export const newBooking = (checkIn = todayStr()) => ({
  guest_name: '', guest_phone: '', guest_email: '', check_in: checkIn, check_out: addDays(checkIn, 1),
  status: 'scheduled', notes: '',
});

// מחזיר הודעת שגיאה, או מחרוזת ריקה אם ההזמנה תקינה
export function validateBooking(b, bookings) {
  if (!b.guest_name.trim()) return 'נא להזין שם';
  if (!b.guest_phone.trim()) return 'נא להזין מספר טלפון';
  // מספר ישראלי: 9-10 ספרות (או 12 עם קידומת 972)
  if (!/^\d{9,12}$/.test(b.guest_phone.replace(/[\s()+-]/g, ''))) return 'מספר הטלפון לא תקין';
  if (b.guest_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.guest_email)) return 'כתובת האימייל לא תקינה';
  if (!b.check_in || !b.check_out) return 'נא לבחור תאריכי כניסה ויציאה';
  if (b.check_out <= b.check_in) return 'תאריך היציאה חייב להיות אחרי תאריך הכניסה';
  const clash = findOverlap(bookings, b);
  if (clash) return `התאריכים חופפים לשהות של ${clash.guest_name} (${showDate(clash.check_in)} – ${showDate(clash.check_out)})`;
  return '';
}
