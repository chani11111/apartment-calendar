import { CheckCircle2, LogOut } from 'lucide-react';

// סימון יציאה ביום שבו האורחים עוזבים (היום עצמו פנוי לכניסה חדשה).
// ירוק עם ✓ אחרי שהאורחים אישרו בדף היציאה. בפלאפון רק האייקון, כי התא צר מדי לטקסט.
export default function DepartureTag({ booking: b, onOpen }) {
  const done = !!b.checkout_done_at;
  const Icon = done ? CheckCircle2 : LogOut;
  return (
    <button
      type="button"
      aria-label={`יציאה · ${b.guest_name}${done ? ' · אושרה' : ''}`}
      onClick={(e) => { e.stopPropagation(); onOpen(b); }}
      className={`flex w-full items-center gap-1 px-1.5 text-[11px] ${done ? 'font-medium text-sage' : 'text-muted hover:text-ink'}`}
    >
      <Icon size={12} className="shrink-0" />
      <span className="hidden truncate sm:inline">יציאה · {b.guest_name}</span>
    </button>
  );
}
