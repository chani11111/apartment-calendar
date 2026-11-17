import { useEffect, useState } from 'react';
import { isMock, listBookings, createBooking, updateBooking, deleteBooking } from '../lib/bookingsApi';

// רשימת ההזמנות והפעולות עליה. שגיאות שמירה ומחיקה נזרקות למודאל שקרא לפעולה.
export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const load = () => listBookings().then(setBookings).catch((e) => setLoadError('שגיאה בטעינת נתונים: ' + e.message));
    load();
    // טעינה מחדש כשחוזרים לאפליקציה, כדי לראות אישורי יציאה שהגיעו בינתיים
    const onVisible = () => document.visibilityState === 'visible' && !isMock && load();
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const save = async (b) => {
    if (b.id) {
      const r = await updateBooking(b);
      setBookings((bs) => bs.map((x) => (x.id === r.id ? r : x)));
    } else {
      const r = await createBooking(b);
      setBookings((bs) => [...bs, r]);
    }
  };

  const remove = async (id) => {
    await deleteBooking(id);
    setBookings((bs) => bs.filter((x) => x.id !== id));
  };

  return { bookings, loadError, save, remove };
}
