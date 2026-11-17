import { fmt } from './dates';

// כל תאי החודש, כולל השלמה לשבועות מלאים מהחודש הקודם והבא
export function buildMonthGrid(year, month) {
  const offset = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((offset + days) / 7) * 7;
  return Array.from({ length: total }, (_, i) => new Date(year, month, i - offset + 1));
}

// הזמנה תופסת את הלילות מיום הכניסה ועד יום היציאה (לא כולל).
// יום היציאה נשאר פנוי לכניסה חדשה.
export const occupies = (b, ds) => b.check_in <= ds && ds < b.check_out;

export const dayBookings = (bookings, ds) => ({
  staying: bookings.filter((b) => occupies(b, ds)),
  departing: bookings.filter((b) => b.check_out === ds),
});

// שהויות שיש להן לפחות לילה אחד בחודש, לפי סדר הכניסה
export function monthBookings(bookings, year, month) {
  const first = fmt(new Date(year, month, 1));
  const next = fmt(new Date(year, month + 1, 1));
  return bookings
    .filter((b) => b.check_in < next && b.check_out > first)
    .sort((a, b) => a.check_in.localeCompare(b.check_in));
}

export const findOverlap = (bookings, c) =>
  bookings.find((b) => b.id !== c.id && b.check_in < c.check_out && c.check_in < b.check_out);
