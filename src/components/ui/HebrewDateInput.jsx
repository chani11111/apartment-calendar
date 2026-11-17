import { gematria, hebrewDate, hebrewYear } from '../../lib/hebrewDate';
import { parse, showDate, todayStr } from '../../lib/dates';
import { inputCls } from './styles';

const select = `${inputCls} px-2`;

// אדר בשנה רגילה ↔ אדר א׳/ב׳ בשנה מעוברת
const findMonth = (months, name) =>
  months.find((m) => m.name === name) ?? (name.startsWith('אדר') ? months.find((m) => m.name.startsWith('אדר')) : months[0]);

// בחירת תאריך לפי יום, חודש ושנה עבריים. הערך נשאר מחרוזת לועזית YYYY-MM-DD.
export default function HebrewDateInput({ value, onChange }) {
  const h = hebrewDate(parse(value));
  const months = hebrewYear(h.year);
  const month = findMonth(months, h.month);
  const thisYear = hebrewDate(parse(todayStr())).year;
  const yearOptions = [...new Set([thisYear, thisYear + 1, thisYear + 2, h.year])].sort();

  // יום שלא קיים בחודש החדש (ל׳ בחודש של 29 יום) הופך ליום האחרון בו
  const pick = (m, day) => onChange(m.days[Math.min(day, m.days.length) - 1]);

  return (
    <div>
      <div className="grid grid-cols-[1fr_1.6fr_1.3fr] gap-2">
        <select className={select} aria-label="יום" value={h.day} onChange={(e) => pick(month, Number(e.target.value))}>
          {month.days.map((_, i) => <option key={i} value={i + 1}>{gematria(i + 1)}</option>)}
        </select>
        <select className={select} aria-label="חודש" value={month.name} onChange={(e) => pick(findMonth(months, e.target.value), h.day)}>
          {months.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
        </select>
        <select className={select} aria-label="שנה" value={h.year} onChange={(e) => { const y = Number(e.target.value); pick(findMonth(hebrewYear(y), month.name), h.day); }}>
          {yearOptions.map((y) => <option key={y} value={y}>{gematria(y % 1000)}</option>)}
        </select>
      </div>
      <p className="mt-1 text-xs text-muted">{showDate(value)}</p>
    </div>
  );
}
