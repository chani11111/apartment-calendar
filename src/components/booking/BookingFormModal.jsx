import { useState } from 'react';
import Modal from '../ui/Modal';
import Field from '../ui/Field';
import HebrewDateInput from '../ui/HebrewDateInput';
import { ghostBtn, inputCls, primaryBtn } from '../ui/styles';
import { addDays } from '../../lib/dates';
import { validateBooking } from '../../lib/booking';
import { useAsyncAction } from '../../hooks/useAsyncAction';

export default function BookingFormModal({ initial, bookings, onSave, onClose }) {
  // Supabase מחזיר null בשדות ריקים, והשדות בטופס צריכים מחרוזת
  const [f, setF] = useState({ ...initial, guest_phone: initial.guest_phone ?? '', guest_email: initial.guest_email ?? '', notes: initial.notes ?? '' });
  const { busy, error, setError, run } = useAsyncAction();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // כשמזיזים את הכניסה אל או אחרי היציאה, היציאה זזה ללילה אחד אחריה
  const setCheckIn = (ci) => setF({ ...f, check_in: ci, check_out: f.check_out <= ci ? addDays(ci, 1) : f.check_out });

  const submit = (e) => {
    e.preventDefault();
    const b = { ...f, guest_name: f.guest_name.trim(), guest_email: f.guest_email.trim() };
    const invalid = validateBooking(b, bookings);
    if (invalid) return setError(invalid);
    run(() => onSave(b));
  };

  return (
    <Modal title={f.id ? 'עריכת שהות' : 'הוספת שהות חדשה'} onClose={onClose}>
      <form className="space-y-3" onSubmit={submit}>
        <Field label="שם"><input className={inputCls} value={f.guest_name} onChange={set('guest_name')} autoFocus /></Field>
        <Field label="תאריך כניסה"><HebrewDateInput value={f.check_in} onChange={setCheckIn} /></Field>
        <Field label="תאריך יציאה"><HebrewDateInput value={f.check_out} onChange={(v) => setF({ ...f, check_out: v })} /></Field>
        <Field label="מספר טלפון"><input className={`${inputCls} text-right`} type="tel" dir="ltr" value={f.guest_phone} onChange={set('guest_phone')} /></Field>
        <Field label="אימייל">
          <input className={`${inputCls} text-right`} type="email" dir="ltr" value={f.guest_email} onChange={set('guest_email')} />
        </Field>
        <Field label="הערות"><textarea className={inputCls} rows={3} value={f.notes} onChange={set('notes')} /></Field>
        {error && <p className="text-sm text-clay">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="submit" className={primaryBtn} disabled={busy}>{busy ? 'שומר...' : 'שמירה'}</button>
          <button type="button" className={ghostBtn} onClick={onClose}>ביטול</button>
        </div>
      </form>
    </Modal>
  );
}
