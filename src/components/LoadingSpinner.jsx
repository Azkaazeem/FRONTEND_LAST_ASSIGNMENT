function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[var(--color-accent)]" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
