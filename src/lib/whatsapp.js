import { showDate } from './dates';

const ADDRESS = import.meta.env.VITE_APARTMENT_ADDRESS || 'כתובת הדירה';

// מספר ישראלי מקומי (050...) לפורמט בינלאומי (97250...) כפי ש-wa.me דורש
const toIntl = (phone) => (phone || '').replace(/\D/g, '').replace(/^0/, '972');

export function whatsappLink(b) {
  const msg = [
    `שלום ${b.guest_name}! 🌿`,
    'שמחים לארח אתכם.',
    `כתובת: ${ADDRESS}`,
    `כניסה: ${showDate(b.check_in)}`,
    `יציאה: ${showDate(b.check_out)}`,
    'נסיעה טובה!',
  ].join('\n');
  return `https://wa.me/${toIntl(b.guest_phone)}?text=${encodeURIComponent(msg)}`;
}
