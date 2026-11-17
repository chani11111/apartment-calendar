import { isMock } from '../../lib/bookingsApi';
import { useSession } from '../../hooks/useSession';
import LoginScreen from './LoginScreen';

// מציג את האפליקציה רק אחרי התחברות. במצב דמו אין Supabase ולכן אין התחברות.
export default function AuthGate({ children }) {
  if (isMock) return children;
  return <SessionGate>{children}</SessionGate>;
}

function SessionGate({ children }) {
  const session = useSession();
  if (session === undefined) return null;
  return session ? children : <LoginScreen />;
}
