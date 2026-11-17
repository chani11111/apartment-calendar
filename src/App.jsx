import { useState } from 'react';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarGrid from './components/calendar/CalendarGrid';
import StatusLegend from './components/calendar/StatusLegend';
import MonthAgenda from './components/calendar/MonthAgenda';
import BookingFormModal from './components/booking/BookingFormModal';
import BookingViewModal from './components/booking/BookingViewModal';
import { useBookings } from './hooks/useBookings';
import { isMock } from './lib/bookingsApi';
import { supabase } from './supabaseClient';
import { newBooking } from './lib/booking';

const thisMonth = () => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; };

export default function App() {
  const [{ year, month }, setCursor] = useState(thisMonth);
  // null | { type: 'form', data } | { type: 'view', id }
  const [modal, setModal] = useState(null);
  const { bookings, loadError, save, remove } = useBookings();

  const shift = (n) => { const d = new Date(year, month + n, 1); setCursor({ year: d.getFullYear(), month: d.getMonth() }); };
  const close = () => setModal(null);
  const openForm = (data) => setModal({ type: 'form', data });
  const openView = (b) => setModal({ type: 'view', id: b.id });
  // ההזמנה המוצגת נקראת מהרשימה, כדי שעדכון סטטוס יתעדכן במודאל הפתוח
  const viewing = modal?.type === 'view' && bookings.find((b) => b.id === modal.id);

  return (
    // pb-24 בפלאפון: מקום לכפתור ההוספה הצף
    <div className="mx-auto max-w-5xl px-3 pb-24 pt-4 sm:p-6">
      <CalendarHeader
        year={year} month={month}
        onPrev={() => shift(-1)} onNext={() => shift(1)} onToday={() => setCursor(thisMonth())}
        onAdd={() => openForm(newBooking())}
      />
      {loadError && <p className="mb-3 rounded-lg bg-clay-light px-3 py-2 text-sm text-clay">{loadError}</p>}
      {isMock && <p className="mb-3 text-xs text-muted">מצב דמו: הנתונים נשמרים בזיכרון בלבד. לחיבור ל-Supabase יש להגדיר מפתחות בקובץ .env</p>}
      <CalendarGrid
        year={year} month={month} bookings={bookings}
        onAddDay={(ds) => openForm(newBooking(ds))}
        onOpen={openView}
      />
      <StatusLegend />
      <MonthAgenda year={year} month={month} bookings={bookings} onOpen={openView} />
      {!isMock && (
        <button type="button" onClick={() => supabase.auth.signOut()} className="mt-6 text-xs text-muted underline hover:text-ink">
          התנתקות
        </button>
      )}

      {modal?.type === 'form' && (
        <BookingFormModal
          initial={modal.data} bookings={bookings} onClose={close}
          onSave={async (b) => { await save(b); close(); }}
        />
      )}
      {viewing && (
        <BookingViewModal
          booking={viewing} onClose={close}
          onEdit={() => openForm(viewing)}
          onStatus={(status) => save({ ...viewing, status })}
          onDelete={async () => { await remove(viewing.id); close(); }}
        />
      )}
    </div>
  );
}
