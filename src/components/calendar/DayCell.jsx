import { Plus } from 'lucide-react';
import BookingChip from './BookingChip';
import DepartureTag from './DepartureTag';
import { hebrewDate } from '../../lib/hebrewDate';

export default function DayCell({ date, ds, inMonth, isToday, staying, departing, onAddDay, onOpen }) {
  const free = staying.length === 0;
  const num = isToday ? 'bg-[#EBF1EC] font-semibold text-sage' : inMonth ? 'text-ink' : 'text-faint';
  const heb = hebrewDate(date);
  return (
    <div
      onClick={free ? () => onAddDay(ds) : undefined}
      className={`group min-h-[68px] border-b border-s border-line py-1 sm:min-h-[96px] sm:py-1.5 [&:nth-child(7n+1)]:border-s-0 ${inMonth ? 'bg-white' : 'bg-[#FBFAF8]'} ${free ? 'cursor-pointer sm:hover:bg-cream' : ''}`}
    >
      <div className="mb-1 flex items-center justify-between px-1 sm:px-1.5">
        <span className="flex min-w-0 items-center gap-1">
          <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${num}`}>{date.getDate()}</span>
          {/* תאריך עברי; בראש חודש עברי גם שם החודש (במסך רחב) */}
          <span className={`truncate text-[10px] sm:text-[11px] ${inMonth ? 'text-muted' : 'text-faint'}`}>
            {heb.dayText}{heb.day === 1 && <span className="hidden sm:inline"> {heb.month}</span>}
          </span>
        </span>
        {free && (
          <button type="button" aria-label="הוספת שהות ביום זה" className="hidden text-muted opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 sm:block">
            <Plus size={14} />
          </button>
        )}
      </div>
      <div className="space-y-1">
        {staying.map((b) => <BookingChip key={b.id} booking={b} ds={ds} weekday={date.getDay()} onOpen={onOpen} />)}
        {departing.map((b) => <DepartureTag key={b.id} booking={b} onOpen={onOpen} />)}
      </div>
    </div>
  );
}
