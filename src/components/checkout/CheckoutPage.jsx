import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { primaryBtn } from '../ui/styles';
import { CHECKLIST } from '../../lib/checkout';
import { confirmCheckout, getCheckout } from '../../lib/bookingsApi';
import { useAsyncAction } from '../../hooks/useAsyncAction';

const Card = ({ children }) => (
  <div className="flex min-h-screen items-start justify-center px-4 py-8 sm:items-center">
    <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-6">{children}</div>
  </div>
);

// דף לאורחים (בלי התחברות): מסמנים את המשימות ומאשרים שיצאו. האישור מסמן את היציאה בלוח.
export default function CheckoutPage({ token }) {
  // undefined בטעינה, null כשהקישור לא תקין
  const [stay, setStay] = useState();
  const [checked, setChecked] = useState(() => CHECKLIST.map(() => false));
  const { busy, error, run } = useAsyncAction();

  useEffect(() => { getCheckout(token).then(setStay).catch(() => setStay(null)); }, [token]);

  if (stay === undefined) return <Card><p className="text-sm text-muted">טוען...</p></Card>;
  if (stay === null) return <Card><p className="text-sm">הקישור לא תקין. אפשר לפנות אלינו בטלפון.</p></Card>;

  if (stay.done_at) {
    return (
      <Card>
        <CheckCircle2 size={40} className="mb-3 text-sage" />
        <h1 className="text-2xl font-semibold">תודה רבה{stay.guest_name && `, ${stay.guest_name}`}!</h1>
        <p className="mt-2 text-muted">קיבלנו את האישור. נסיעה טובה, ונשמח לארח אתכם שוב.</p>
      </Card>
    );
  }

  const done = checked.filter(Boolean).length;
  const toggle = (i) => setChecked(checked.map((c, j) => (j === i ? !c : c)));
  const submit = () => run(async () => setStay({ ...stay, done_at: await confirmCheckout(token) }));

  return (
    <Card>
      <h1 className="text-3xl font-semibold text-sage">לפני שיוצאים</h1>
      <p className="mt-2 text-muted">תודה שאתם שומרים על ניקיון המקום.</p>
      <ul className="mt-5 divide-y divide-line">
        {CHECKLIST.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-3 py-3.5">
              <input type="checkbox" className="h-5 w-5 shrink-0 accent-sage" checked={checked[i]} onChange={() => toggle(i)} />
              <span className={checked[i] ? 'text-muted line-through' : ''}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">{done} מתוך {CHECKLIST.length} משימות הושלמו</p>
      {error && <p className="mt-3 text-sm text-clay">{error}</p>}
      <button type="button" className={`${primaryBtn} mt-5 w-full`} disabled={busy || done < CHECKLIST.length} onClick={submit}>
        {busy ? 'שולח...' : 'סיימנו, הכל תקין'}
      </button>
    </Card>
  );
}
