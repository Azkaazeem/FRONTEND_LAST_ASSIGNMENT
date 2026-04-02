import { useEffect, useRef } from 'react';

function DeleteConfirmModal({ expense, isOpen, isDeleting, onClose, onConfirm }) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    cancelButtonRef.current?.focus();

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !expense) {
    return null;
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="panel w-full max-w-md p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">Delete expense</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-100">Remove this entry?</h2>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          <span className="font-medium text-slate-200">{expense.title}</span> will be removed from your expense
          history.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="border border-slate-700 bg-slate-950 px-5 py-3 font-medium text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
