import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function Signup({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    }

    if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Account created. Check your email if confirmation is enabled, then sign in.');
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-4 py-8 md:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="panel animate-rise order-2 p-6 md:p-8 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">Signup</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-100">Create your account</h2>
          <p className="mt-2 text-sm text-slate-400">Start tracking your expenses.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input
                ref={emailRef}
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
                className="w-full border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
              />
              {errors.email ? <span className="text-sm text-red-400">{errors.email}</span> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                placeholder="Minimum 6 characters"
                className="w-full border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
              />
              {errors.password ? <span className="text-sm text-red-400">{errors.password}</span> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Confirm password</span>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                placeholder="Repeat your password"
                className="w-full border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-500"
              />
              {errors.confirmPassword ? <span className="text-sm text-red-400">{errors.confirmPassword}</span> : null}
            </label>

            {message ? (
              <div
                className={`border px-4 py-3 text-sm ${
                  message.includes('Account created')
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/40 bg-red-500/10 text-red-300'
                }`}
              >
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-semibold text-emerald-400 transition hover:text-emerald-300">
              Login instead
            </button>
          </p>
        </section>

        <section className="animate-rise order-1 border-l border-emerald-400/40 pl-5 md:pl-7 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">Expense Tracker</p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-slate-100 md:text-6xl">
            A simple dashboard for daily expense tracking.
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-slate-400 md:text-lg">
            Keep your expenses organized, view totals, and manage entries from one place.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Signup;
