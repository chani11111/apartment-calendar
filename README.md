# ניהול דירת נופש – Admin Calendar

React + Vite + Tailwind + Lucide + Supabase. עברית מלאה (RTL).

## הרצה
```
npm install
cp .env.example .env     # (ב-Windows: copy .env.example .env)
npm run dev
```
ללא מפתחות ב-.env האפליקציה עולה במצב דמו עם 4 הזמנות לדוגמה.

המפרט המלא: `SPEC.md`. מבנה הקוד והחלטות עיצוב: `CLAUDE.md`.

## חיבור ל-Supabase
1. צרי פרויקט ב-Supabase והריצי את `supabase/schema.sql` ב-SQL Editor.
2. מלאי ב-`.env` את `VITE_SUPABASE_URL` ו-`VITE_SUPABASE_ANON_KEY`.
3. עדכני `VITE_APARTMENT_ADDRESS` – הכתובת שתופיע בהודעת הוואטסאפ.

## מיילים אוטומטיים לאורחים (Gmail, חינם)
מייל אישור כשנשמרת הזמנה עם אימייל, ותזכורת עם כתובת וקישור יום לפני הכניסה (ברירת מחדל 10:00).
1. להריץ שוב את `supabase/schema.sql` (מוסיף את עמודות האימייל).
2. ליצור סיסמת אפליקציה ב-Gmail: https://myaccount.google.com/apppasswords (דורש אימות דו-שלבי).
3. Supabase › Edge Functions › Deploy a new function › Via Editor. שם: `booking-emails`.
   להדביק את `supabase/functions/booking-emails/index.ts`, להוסיף קובץ `templates.ts` ולהדביק בו את התוכן מהתיקייה. Deploy.
   בהגדרות הפונקציה לכבות את **Verify JWT** (הפונקציה מוגנת בסוד משלה).
4. להריץ את `supabase/emails.sql` ב-SQL Editor, ואז להריץ את השורה שבסוף הקובץ ולהעתיק את הסוד.
5. Edge Functions › Secrets, להוסיף:
   `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `FUNCTION_SECRET` (הסוד מסעיף 4), `APARTMENT_ADDRESS`, `INFO_URL` (הקישור לכל הפרטים),
   `ARRIVAL_CODE` (קוד הגעה וכניסה לטאב שבקישור, נשלח בתזכורת),
   ואופציונלי: `SENDER_NAME` (שם השולח), `REMINDER_HOUR` (ברירת מחדל 10).
6. בדיקה: ליצור הזמנה עם האימייל שלך. לבדיקת תזכורת: הזמנה שנכנסת מחר, ואז ב-SQL Editor:
   `select public.call_booking_emails('{"type":"reminders","force":true}');`
   תקלות: Edge Functions › booking-emails › Logs.

## אבטחה
התחברות עם אימייל וסיסמה (Supabase Auth). רק משתמש מחובר יכול לקרוא ולשנות הזמנות.
1. Supabase › Authentication › Sign In / Providers: לכבות **Allow new users to sign up**.
2. Authentication › Users › Add user › Create new user: אימייל וסיסמה, לסמן **Auto Confirm User**.
3. להריץ שוב את `supabase/schema.sql`.

## העלאה לאינטרנט והתקנה בטלפון
האתר עולה ל-GitHub Pages אוטומטית בכל `git push` ל-`main` (`.github/workflows/deploy.yml`).
1. ב-repo › Settings › Secrets and variables › Actions › New repository secret: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APARTMENT_ADDRESS` (הערכים מ-`.env`).
2. Settings › Pages › Source: **GitHub Actions**.
3. הכתובת: `https://<שם-משתמש>.github.io/apartment-calendar/`. לפתוח בכרום בטלפון › תפריט ⋮ › **הוספה למסך הבית**.
לעדכון האתר אחרי שינויים: `git add -A`, `git commit -m "..."`, `git push`.
