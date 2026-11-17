import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { MONTHS } from '../../lib/dates';
import { hebrewMonthRange } from '../../lib/hebrewDate';
import { ghostBtn, iconBtn, primaryBtn } from '../ui/styles';

// ב-RTL "הקודם" מצביע ימינה ו"הבא" שמאלה.
// כפתור ההוספה: בכותרת במסך רחב, וכפתור צף בתחתית בפלאפון.
export default function CalendarHeader({ year, month, onPrev, onNext, onToday, onAdd }) {
  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button type="button" className={iconBtn} aria-label="החודש הקודם" title="החודש הקודם" onClick={onPrev}><ChevronRight size={18} /></button>
        <div className="min-w-[120px] text-center sm:min-w-[132px]">
          <h1 className="text-lg font-semibold leading-tight sm:text-xl">{MONTHS[month]} {year}</h1>
          <p className="text-xs text-muted">{hebrewMonthRange(year, month)}</p>
        </div>
        <button type="button" className={iconBtn} aria-label="החודש הבא" title="החודש הבא" onClick={onNext}><ChevronLeft size={18} /></button>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className={ghostBtn} onClick={onToday}>היום</button>
        <button type="button" className={`${primaryBtn} hidden sm:inline-flex`} onClick={onAdd}><Plus size={18} /> הוספת שהות חדשה</button>
      </div>
      <button
        type="button" aria-label="הוספת שהות חדשה" onClick={onAdd}
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage text-white hover:bg-sage-dark sm:hidden"
      >
        <Plus size={26} />
      </button>
    </header>
  );
}
