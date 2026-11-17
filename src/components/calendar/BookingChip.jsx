import { addDays } from '../../lib/dates';
import { STATUS } from '../../lib/status';

// מקטע יומי של פס השהות. פינות מעוגלות והשם רק בתחילת מקטע
// (יום הכניסה או תחילת שבוע), כך שהמקטעים נראים כפס רציף.
export default function BookingChip({ booking: b, ds, weekday, onOpen }) {
  const start = ds === b.check_in || weekday === 0;
  const end = addDays(ds, 1) === b.check_out || weekday === 6;
  return (
    <div className={`${start ? 'ps-1' : ''} ${end ? 'pe-1' : ''}`}>
      <button
        type="button"
        aria-label={b.guest_name}
        title={b.guest_name}
        onClick={(e) => { e.stopPropagation(); onOpen(b); }}
        className={`flex h-6 w-full items-center px-1.5 text-[11px] font-medium ${STATUS[b.status].cls} ${start ? 'rounded-s-md' : ''} ${end ? 'rounded-e-md' : ''}`}
      >
        <span className="truncate">{start && b.guest_name}</span>
      </button>
    </div>
  );
}
