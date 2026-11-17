// תבניות המיילים לאורחים (HTML מימין לשמאל + גרסת טקסט)

export type Booking = { id: string; guest_name: string; guest_email: string; check_in: string; check_out: string };
// פרטים קבועים לכל האורחים, מה-Secrets של הפונקציה
export type Config = { address: string; infoUrl: string; arrivalCode: string };
type Line = [label: string, value: string];

const showDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function render(subject: string, name: string, intro: string, lines: Line[], outro: string, link?: [string, string]) {
  const row = ([l, v]: Line) => `<p style="margin:6px 0"><span style="color:#6B706C">${l}:</span> <b>${esc(v)}</b></p>`;
  const button = link
    ? `<p style="margin:20px 0"><a href="${esc(link[1])}" style="background:#384B3E;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;display:inline-block">${link[0]}</a></p>`
    : '';
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;background:#FAF8F5;padding:24px;color:#2C302E">
<div style="max-width:480px;margin:auto;background:#fff;border:1px solid #E7E2DA;border-radius:16px;padding:24px">
<h2 style="margin-top:0">שלום ${esc(name)},</h2><p>${intro}</p>${lines.map(row).join('')}${button}<p>${outro}</p></div></div>`;
  const text = [`שלום ${name},`, intro, ...lines.map(([l, v]) => `${l}: ${v}`), ...(link ? [`${link[0]}: ${link[1]}`] : []), outro].join('\n');
  return { subject, html, text };
}

const infoLink = (infoUrl: string): [string, string] | undefined => (infoUrl ? ['לכל הפרטים', infoUrl] : undefined);

export const confirmationEmail = (b: Booking, c: Config) => render(
  `אישור הזמנה – ${showDate(b.check_in)}`,
  b.guest_name,
  'ההזמנה שלכם לדירת הנופש אושרה.',
  [['כניסה', showDate(b.check_in)], ['יציאה', showDate(b.check_out)]],
  'יום לפני ההגעה נשלח לכם את כל הפרטים.',
  infoLink(c.infoUrl),
);

export const reminderEmail = (b: Booking, c: Config) => render(
  'מחר נפגשים! פרטי ההגעה לדירה',
  b.guest_name,
  'מחכים לכם מחר. הנה כל מה שצריך:',
  [
    ['כניסה', showDate(b.check_in)],
    ['יציאה', showDate(b.check_out)],
    ...(c.address ? [['כתובת', c.address] as Line] : []),
    // הקוד לטאב "הגעה וכניסה" שבקישור (לא קוד הדלת)
    ...(c.arrivalCode ? [['קוד הגעה וכניסה', c.arrivalCode] as Line] : []),
  ],
  'נסיעה טובה!',
  infoLink(c.infoUrl),
);
