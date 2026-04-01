function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto animate-rise border px-4 py-3 shadow-xl ${
            toast.type === 'error'
              ? 'border-red-500/40 bg-slate-950 text-red-300'
              : 'border-emerald-500/40 bg-slate-950 text-emerald-300'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              <p className="mt-1 text-sm opacity-90">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="border border-slate-700 bg-slate-900 px-2 py-1 text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
            >
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
