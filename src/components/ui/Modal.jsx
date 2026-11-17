import { useEffect, useId } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    // בפלאפון: גיליון שעולה מתחתית המסך. במסך רחב: חלון במרכז.
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-line bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="סגירה" className="text-muted hover:text-ink"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
