import { fmt } from './dates';

// תאריך עברי מהדפדפן עצמו (לוח עברי מובנה ב-Intl), בלי שירות חיצוני.
// nu-latn: ספרות רגילות, שאותן ממירים לאותיות בעצמנו.
const parts = new Intl.DateTimeFormat('he-IL-u-ca-hebrew-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });

const LETTERS = [[400, 'ת'], [300, 'ש'], [200, 'ר'], [100, 'ק'], [90, 'צ'], [80, 'פ'], [70, 'ע'], [60, 'ס'], [50, 'נ'],
  [40, 'מ'], [30, 'ל'], [20, 'כ'], [10, 'י'], [9, 'ט'], [8, 'ח'], [7, 'ז'], [6, 'ו'], [5, 'ה'], [4, 'ד'], [3, 'ג'], [2, 'ב'], [1, 'א']];

// מספר לאותיות: 22 → כ״ב, 15 → ט״ו, 787 → תשפ״ז
export function gematria(n) {
  let s = '';
  for (const [v, l] of LETTERS) {
    while (n >= v) {
      // 15 ו-16 נכתבים ט״ו וט״ז ולא י״ה וי״ו
      if (n === 15 || n === 16) { s += n === 15 ? 'טו' : 'טז'; n = 0; break; }
      s += l; n -= v;
    }
  }
  return s.length === 1 ? s + '׳' : s.slice(0, -1) + '״' + s.slice(-1);
}

export function hebrewDate(date) {
  const p = Object.fromEntries(parts.formatToParts(date).map((x) => [x.type, x.value]));
  const day = Number(p.day), year = Number(p.year);
  return { day, month: p.month, year, dayText: gematria(day), yearText: gematria(year % 1000) };
}

// חודשי שנה עברית וימיהם: [{ name, days: ['YYYY-MM-DD', ...] }].
// Intl ממיר רק מלועזי לעברי, אז סורקים את הימים סביב השנה. נשמר במטמון לכל שנה.
const years = new Map();
export function hebrewYear(year) {
  if (years.has(year)) return years.get(year);
  const months = [];
  // ראש השנה תמיד בספטמבר-אוקטובר של השנה הלועזית year-3761; מתחילים באוגוסט
  for (const d = new Date(year - 3761, 7, 1); months.length < 14; d.setDate(d.getDate() + 1)) {
    const h = hebrewDate(d);
    if (h.year < year) continue;
    if (h.year > year) break;
    if (months.at(-1)?.name !== h.month) months.push({ name: h.month, days: [] });
    months.at(-1).days.push(fmt(d));
  }
  years.set(year, months);
  return months;
}

// "כ״ב בחשוון תשפ״ז"
export const showHebrewDate = (date) => { const h = hebrewDate(date); return `${h.dayText} ב${h.month} ${h.yearText}`; };

// כותרת החודש: "חשוון–כסלו תשפ״ז" (או שתי שנים כשהחודש חוצה את ראש השנה)
export function hebrewMonthRange(year, month) {
  const a = hebrewDate(new Date(year, month, 1)), b = hebrewDate(new Date(year, month + 1, 0));
  if (a.month === b.month) return `${a.month} ${a.yearText}`;
  return a.year === b.year ? `${a.month}–${b.month} ${b.yearText}` : `${a.month} ${a.yearText} – ${b.month} ${b.yearText}`;
}
