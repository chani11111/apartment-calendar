import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Field from '../ui/Field';
import { inputCls, primaryBtn } from '../ui/styles';
import { useAsyncAction } from '../../hooks/useAsyncAction';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { busy, error, setError, run } = useAsyncAction();

  const submit = (e) => {
    e.preventDefault();
    run(async () => {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) setError(err.message === 'Invalid login credentials' ? 'אימייל או סיסמה שגויים' : 'ההתחברות נכשלה: ' + err.message);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-line bg-white p-6">
        <h1 className="text-xl font-semibold">ניהול דירת נופש</h1>
        <Field label="אימייל">
          <input className={`${inputCls} text-right`} type="email" dir="ltr" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </Field>
        <Field label="סיסמה">
          <input className={`${inputCls} text-right`} type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        {error && <p className="text-sm text-clay">{error}</p>}
        <button type="submit" className={`${primaryBtn} w-full`} disabled={busy}>{busy ? 'מתחברת...' : 'התחברות'}</button>
      </form>
    </div>
  );
}
