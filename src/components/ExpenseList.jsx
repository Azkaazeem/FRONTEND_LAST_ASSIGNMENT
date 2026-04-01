import ExpenseItem from './ExpenseItem';
import LoadingSpinner from './LoadingSpinner';

function ExpenseList({ expenses, loading, deletingId, onEdit, onDelete }) {
  return (
    <section className="panel px-5 py-5 md:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">History</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Latest expenses</h2>
          <p className="mt-1 text-sm text-slate-400">Newest entries stay on top for quicker review.</p>
        </div>
        {loading ? <LoadingSpinner label="Syncing expenses" /> : null}
      </div>

      {loading && expenses.length === 0 ? (
        <div className="mt-8 border border-dashed border-slate-700 bg-slate-950/70 px-6 py-14 text-center">
          <p className="text-lg font-semibold text-slate-100">Loading your expenses</p>
          <p className="mt-2 text-sm text-slate-500">Please wait while we fetch your latest records.</p>
        </div>
      ) : null}

      {!loading && expenses.length === 0 ? (
        <div className="mt-8 border border-dashed border-slate-700 bg-slate-950/70 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-sky-500/40 bg-sky-500/10 text-2xl text-sky-400">
            +
          </div>
          <p className="mt-5 text-xl font-semibold text-slate-100">No expenses yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Add your first expense to start building a cleaner spending history.
          </p>
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
            busy={deletingId === expense.id}
          />
        ))}
      </div>
    </section>
  );
}

export default ExpenseList;
