import { ChevronLeft } from 'lucide-react';
import { monthBookings } from '../../lib/calendar';
import { showShortDate } from '../../lib/dates';
import StatusBadge from '../ui/StatusBadge';

// רשימת השהויות של החודש, מוצגת רק בפלאפון שבו השמות בלוח נחתכים
export default function MonthAgenda({ year, month, bookings, onOpen }) {
  const list = monthBookings(bookings, year, month);
  return (
    <section className="mt-4 sm:hidden">
      <h2 className="mb-2 text-sm font-semibold">שהויות החודש</h2>
      {list.length === 0 ? (
        <p className="text-sm text-muted">אין שהויות בחודש הזה</p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {list.map((b) => (
            <li key={b.id}>
              <button type="button" onClick={() => onOpen(b)} className="flex w-full items-center gap-3 px-4 py-3 text-start active:bg-cream">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{b.guest_name}</span>
                  <span className="text-xs text-muted">{showShortDate(b.check_in)} – {showShortDate(b.check_out)}</span>
                </span>
                <StatusBadge status={b.status} />
                <ChevronLeft size={16} className="shrink-0 text-faint" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
