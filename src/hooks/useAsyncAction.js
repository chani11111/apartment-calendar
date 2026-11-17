import { useState } from 'react';

// מצב "שומר..." והודעת שגיאה משותפים לפעולות במודאלים
export function useAsyncAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try { await fn(); }
    catch (e) { setError('הפעולה נכשלה: ' + (e.message || e)); }
    finally { setBusy(false); }
  };

  return { busy, error, setError, run };
}
