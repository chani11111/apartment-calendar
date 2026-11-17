// תאריכים נשמרים כמחרוזות YYYY-MM-DD (כמו עמודת date ב-Supabase), בלי אזורי זמן.
export const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
export const DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
export const DAYS_SHORT = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

const p2 = (n) => String(n).padStart(2, '0');
export const fmt = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return fmt(d); };
export const todayStr = () => fmt(new Date());
export const showDate = (s) => parse(s).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
export const showShortDate = (s) => { const d = parse(s); return `${d.getDate()}.${d.getMonth() + 1}`; };
