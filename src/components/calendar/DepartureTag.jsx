import { LogOut } from 'lucide-react';

// סימון יציאה ביום שבו האורחים עוזבים (היום עצמו פנוי לכניסה חדשה).
// בפלאפון רק האייקון, כי התא צר מדי לטקסט.
export default function DepartureTag({ booking: b, onOpen }) {
  return (
    <button
      type="button"
      aria-label={`יציאה · ${b.guest_name}`}
      onClick={(e) => { e.stopPropagation(); onOpen(b); }}
      className="flex w-full items-center gap-1 px-1.5 text-[11px] text-muted hover:text-ink"
    >
      <LogOut size={12} className="shrink-0" />
      <span className="hidden truncate sm:inline">יציאה · {b.guest_name}</span>
    </button>
  );
}
