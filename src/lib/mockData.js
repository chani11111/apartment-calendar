import { fmt } from './dates';

// הזמנות דמו בחודש הנוכחי. ימים עד 28 כדי שיתאימו גם לפברואר.
export function mockBookings() {
  const t = new Date();
  const d = (n) => fmt(new Date(t.getFullYear(), t.getMonth(), n));
  return [
    { id: 'm1', guest_name: 'כהן',   guest_phone: '0501234567', guest_email: 'cohen@example.com', check_in: d(3),  check_out: d(6),  status: 'cleaned',     notes: '' },
    { id: 'm2', guest_name: 'לוי',   guest_phone: '0527654321', check_in: d(6),  check_out: d(9),  status: 'checked_out', notes: 'ביקשו צ׳ק-אין מאוחר', checkout_done_at: new Date().toISOString() },
    { id: 'm3', guest_name: 'ביטון', guest_phone: '0541112233', check_in: d(16), check_out: d(21), status: 'checked_in',  notes: 'משפחה עם שני ילדים' },
    { id: 'm4', guest_name: 'אברהם', guest_phone: '0589998877', guest_email: 'avraham@example.com', check_in: d(25), check_out: d(28), status: 'scheduled',   notes: '' },
  ];
}
