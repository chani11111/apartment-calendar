import { useState } from 'react';
import { MessageCircle, Pencil, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import { ghostBtn, primaryBtn } from '../ui/styles';
import { parse, showDate } from '../../lib/dates';
import { showHebrewDate } from '../../lib/hebrewDate';
import { whatsappLink } from '../../lib/whatsapp';
import { checkoutLink } from '../../lib/checkout';
import { useAsyncAction } from '../../hooks/useAsyncAction';

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-4 border-b border-line/60 py-2 text-sm">
    <span className="text-muted">{label}</span>
    <span className="font-medium">{children}</span>
  </div>
);

const DualDate = ({ ds }) => (
  <span className="block text-end">
    {showDate(ds)}
    <span className="block text-xs font-normal text-muted">{showHebrewDate(parse(ds))}</span>
  </span>
);

export default function BookingViewModal({ booking: b, onClose, onEdit, onDelete }) {
  const { busy, error, run } = useAsyncAction();
  // מחיקה דורשת לחיצה שנייה לאישור
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Modal title={b.guest_name} onClose={onClose}>
      <Row label="טלפון"><span dir="ltr">{b.guest_phone || '—'}</span></Row>
      <Row label="כניסה"><DualDate ds={b.check_in} /></Row>
      <Row label="יציאה"><DualDate ds={b.check_out} /></Row>
      <Row label="אימייל"><span dir="ltr">{b.guest_email || '—'}</span></Row>
      <Row label="אישור יציאה">
        {b.checkout_done_at
          ? <span className="text-sage">✓ אושר ב-{new Date(b.checkout_done_at).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}</span>
          : b.checkout_token ? <a className="text-sage underline" href={checkoutLink(b)} target="_blank" rel="noreferrer">טרם אושר · לדף היציאה</a> : 'טרם אושר'}
      </Row>
      <p className="whitespace-pre-line py-3 text-sm text-muted">{b.notes || 'אין הערות'}</p>
      {error && <p className="mb-3 text-sm text-clay">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <a className={`${primaryBtn} w-full`} href={whatsappLink(b)} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> שליחת פרטי הגעה בוואטסאפ
        </a>
        <button type="button" className={ghostBtn} onClick={onEdit}><Pencil size={16} /> עריכה</button>
        <button
          type="button" disabled={busy}
          className={`${ghostBtn} text-clay ${confirmDelete ? 'border-clay bg-clay-light hover:bg-clay-light' : ''}`}
          onClick={() => (confirmDelete ? run(onDelete) : setConfirmDelete(true))}
        >
          <Trash2 size={16} /> {confirmDelete ? 'לחצי שוב לאישור המחיקה' : 'מחיקת הזמנה'}
        </button>
      </div>
    </Modal>
  );
}
