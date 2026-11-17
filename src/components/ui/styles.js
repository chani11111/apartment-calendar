// מחלקות משותפות לכפתורים ושדות, כדי שלא ישוכפלו בין קומפוננטות.
// בפלאפון הכפתורים והשדות גבוהים יותר כדי שיהיה נוח ללחוץ.
const btn = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 sm:py-2';
export const primaryBtn = `${btn} bg-sage text-white hover:bg-sage-dark`;
export const ghostBtn = `${btn} border border-line bg-white text-ink hover:bg-cream`;
export const iconBtn = 'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:bg-cream sm:h-9 sm:w-9';
// text-base בפלאפון מונע זום אוטומטי בלחיצה על שדה
export const inputCls = 'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base outline-none focus:border-sage sm:py-2 sm:text-sm';
