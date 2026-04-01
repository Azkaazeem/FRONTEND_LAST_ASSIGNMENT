const categoryStyles = {
  Food: 'bg-amber-500/12 text-amber-300 border border-amber-500/30',
  Transport: 'bg-sky-500/12 text-sky-300 border border-sky-500/30',
  Shopping: 'bg-fuchsia-500/12 text-fuchsia-300 border border-fuchsia-500/30',
  Bills: 'bg-rose-500/12 text-rose-300 border border-rose-500/30',
  Health: 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/30',
  Work: 'bg-indigo-500/12 text-indigo-300 border border-indigo-500/30',
  Entertainment: 'bg-violet-500/12 text-violet-300 border border-violet-500/30',
  Other: 'bg-slate-700/60 text-slate-300 border border-slate-600',
};

function ExpenseItem({ expense, onEdit, onDelete, busy }) {
  const categoryClass = categoryStyles[expense.category] ?? categoryStyles.Other;

  return (
    <article className="panel-muted animate-rise px-4 py-4 transition hover:border-slate-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-100">{expense.title}</h3>
            <span className={`px-3 py-1 text-xs font-semibold ${categoryClass}`}>{expense.category}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>{new Date(expense.date).toLocaleDateString()}</span>
            <span>Expense ID: {String(expense.id).slice(0, 8)}</span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 sm:items-end">
          <p className="text-2xl font-bold text-slate-100">
            PKR {Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(expense)}
              className="border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(expense)}
              disabled={busy}
              className="border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {busy ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ExpenseItem;
