import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// undefined = עוד בודקים, null = לא מחוברת, אחרת אובייקט ה-session.
// Supabase שומר את ההתחברות בדפדפן, כך שצריך להתחבר פעם אחת בכל מכשיר.
export function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return session;
}
