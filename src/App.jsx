import { useEffect, useState } from 'react';
import CustomCursor from './components/CustomCursor';
import { supabase } from './lib/supabaseClient';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [session, setSession] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (error) {
        console.error('Unable to restore session', error.message);
      }

      setSession(data.session ?? null);
      setAuthLoading(false);
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authLoading) {
    return (
      <>
        <CustomCursor />
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-surface)] px-6 py-12">
          <div className="panel relative flex w-full max-w-sm flex-col items-center gap-4 px-8 py-10 text-center">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-700 border-t-[var(--color-accent)]" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">Expense Tracker</p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-100">Restoring your workspace</h1>
              <p className="mt-2 text-sm text-slate-400">Checking your session and loading your dashboard.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <CustomCursor />
        {authView === 'login' ? (
          <Login onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthView('login')} />
        )}
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <Dashboard session={session} onLogout={() => supabase.auth.signOut()} />
    </>
  );
}

export default App;
