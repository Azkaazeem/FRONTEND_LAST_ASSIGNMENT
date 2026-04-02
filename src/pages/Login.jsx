import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { supabase } from '../lib/supabaseClient';

function Login({ onSwitchToSignup }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const emailRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-auth-left]',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
      );

      gsap.fromTo(
        '[data-auth-form]',
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.12 },
      );

      gsap.fromTo(
        '[data-auth-form] > *',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power2.out', delay: 0.2 },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.';
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

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('Welcome back. Redirecting to your dashboard...');
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[var(--color-surface)] px-4 py-8 md:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <section data-auth-left className="border-l border-sky-400/40 pl-5 md:pl-7">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Expense Tracker</p>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-slate-100 md:text-6xl">
            Track spending in one clean workspace.
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-slate-400 md:text-lg">
            Add expenses, review totals, and manage everything from a simple personal dashboard.
          </p>
        </section>

        <section data-auth-form className="panel p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Login</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-100">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to continue.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input
                ref={emailRef}
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
                className="w-full border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
              />
              {errors.email ? <span className="text-sm text-red-400">{errors.email}</span> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Password</span>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                className="w-full border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
              />
              {errors.password ? <span className="text-sm text-red-400">{errors.password}</span> : null}
            </label>

            {message ? (
              <div
                className={`border px-4 py-3 text-sm ${
                  message.includes('Welcome')
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
              data-cursor="Login"
              className="w-full bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{' '}
            <button type="button" onClick={onSwitchToSignup} data-cursor="Signup" className="font-semibold text-sky-400 transition hover:text-sky-300">
              Create one
            </button>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
