import { DAYS, DAYS_SHORT, fmt, todayStr } from '../../lib/dates';
import { buildMonthGrid, dayBookings } from '../../lib/calendar';
import DayCell from './DayCell';

export default function CalendarGrid({ year, month, bookings, onAddDay, onOpen }) {
  const today = todayStr();
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="grid grid-cols-7 border-b border-line bg-cream">
        {DAYS.map((n, i) => (
          <div key={n} className="py-2 text-center text-xs text-muted">
            <span className="sm:hidden">{DAYS_SHORT[i]}</span>
            <span className="hidden sm:inline">{n}</span>
          </div>
        ))}
      </div>
      <div className="-mb-px grid grid-cols-7">
        {buildMonthGrid(year, month).map((date) => {
          const ds = fmt(date);
          return (
            <DayCell
              key={ds} date={date} ds={ds}
              inMonth={date.getMonth() === month} isToday={ds === today}
              {...dayBookings(bookings, ds)}
              onAddDay={onAddDay} onOpen={onOpen}
            />
          );
        })}
      </div>
    </div>
  );
}
