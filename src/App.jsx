import { useEffect, useState } from 'react';
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-surface)] px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.16),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_45%,_#f9fafb_100%)]" />
        <div className="glass-panel relative flex w-full max-w-sm flex-col items-center gap-4 rounded-[2rem] px-8 py-10 text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/70 border-t-[var(--color-accent)]" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--color-muted)]">
              Expense Tracker
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">
              Restoring your workspace
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Checking your session and loading your dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return authView === 'login' ? (
      <Login onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return <Dashboard session={session} onLogout={() => supabase.auth.signOut()} />;
}

export default App;
