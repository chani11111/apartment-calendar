// נוסח שלוש הודעות ה-SMS לאורחים (טקסט בלבד)

export type Booking = { guest_name: string; check_in: string; check_out: string; checkout_token: string };
// פרטים קבועים לכל האורחים, מה-Secrets של הפונקציה
export type Config = {
  address: string;
  infoUrl: string;     // הודעה 1: הקישור לכל הפרטים
  arrivalUrl: string;  // הודעה 2: דף ההגעה באתר המידע
  arrivalCode: string; // הודעה 2: "סיסמה" לדף ההגעה (לא קוד הדלת)
  siteUrl: string;     // כתובת האפליקציה, לקישור דף היציאה
};

const showDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
};

// שורות ריקות (פרט שלא הוגדר) לא נכנסות להודעה
const lines = (...xs: (string | false)[]) => xs.filter(Boolean).join('\n');

export const confirmationSms = (b: Booking, c: Config) => lines(
  `שלום ${b.guest_name},`,
  'ההזמנה שלכם לדירת הנופש אושרה.',
  `כניסה: ${showDate(b.check_in)}`,
  `יציאה: ${showDate(b.check_out)}`,
  !!c.infoUrl && `לכל הפרטים: ${c.infoUrl}`,
  'יום לפני ההגעה נשלח לכם את כל פרטי הכניסה.',
);

export const reminderSms = (b: Booking, c: Config) => lines(
  `שלום ${b.guest_name},`,
  'מחכים לכם מחר. הנה כל מה שצריך:',
  `כניסה: ${showDate(b.check_in)}`,
  `יציאה: ${showDate(b.check_out)}`,
  !!c.address && `כתובת: ${c.address}`,
  !!c.arrivalCode && `סיסמה: ${c.arrivalCode}`,
  !!c.arrivalUrl && `לכל הפרטים: ${c.arrivalUrl}`,
  'נסיעה טובה!',
);

export const checkoutSms = (b: Booking, c: Config) => lines(
  `שלום ${b.guest_name},`,
  'תודה שהתארחתם אצלנו!',
  'לפני שיוצאים, נשמח שתעברו על הרשימה הקצרה ותאשרו:',
  `${c.siteUrl.replace(/\/?$/, '/')}?checkout=${b.checkout_token}`,
  'נסיעה טובה!',
);
