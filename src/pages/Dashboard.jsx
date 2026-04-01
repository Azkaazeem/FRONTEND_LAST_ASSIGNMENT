import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditModal from '../components/EditModal';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ToastContainer from '../components/ToastContainer';
import { addExpense, deleteExpense, fetchExpenses, updateExpense } from '../redux/expenseSlice';

function Dashboard({ session, onLogout }) {
  const dispatch = useDispatch();
  const { items, loading, saving, error } = useSelector((state) => state.expenses);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const user = session.user;
  const totalExpenses = items.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const monthExpenses = items.filter((expense) => {
    const currentDate = new Date();
    const expenseDate = new Date(expense.date);

    return (
      currentDate.getMonth() === expenseDate.getMonth() &&
      currentDate.getFullYear() === expenseDate.getFullYear()
    );
  });

  const categoryTotals = items.reduce((accumulator, expense) => {
    accumulator[expense.category] = (accumulator[expense.category] ?? 0) + Number(expense.amount);
    return accumulator;
  }, {});

  const topCategoryName =
    Object.entries(categoryTotals).sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'No category yet';

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    dispatch(fetchExpenses(user.id));
  }, [dispatch, user?.id]);

  const showToast = (type, title, message) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, type, title, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  };

  useEffect(() => {
    if (error) {
      showToast('error', 'Request failed', error);
    }
  }, [error]);

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const handleAddExpense = async (expense) => {
    const action = await dispatch(addExpense({ userId: user.id, expense }));

    if (addExpense.fulfilled.match(action)) {
      showToast('success', 'Expense added', `${expense.title} has been saved successfully.`);
      return true;
    }

    return false;
  };

  const handleSaveExpense = async (updates) => {
    if (!editingExpense) {
      return false;
    }

    const action = await dispatch(
      updateExpense({
        userId: user.id,
        expenseId: editingExpense.id,
        updates,
      }),
    );

    if (updateExpense.fulfilled.match(action)) {
      showToast('success', 'Expense updated', `${updates.title} has been updated.`);
      return true;
    }

    return false;
  };

  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(`Delete "${expense.title}" from your expenses?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(expense.id);
    const action = await dispatch(deleteExpense({ userId: user.id, expenseId: expense.id }));
    setDeletingId(null);

    if (deleteExpense.fulfilled.match(action)) {
      showToast('success', 'Expense deleted', `${expense.title} has been removed.`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-4 py-6 md:px-8">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <div className="mx-auto max-w-7xl">
        <header className="panel animate-rise border-l-2 border-sky-500 px-5 py-5 md:px-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Expense tracker</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-100 md:text-4xl">
                Welcome back, {user.email}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
                Manage your daily spending with a cleaner dashboard and simpler layout.
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-500"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-grid mt-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="dashboard-grid">
            <ExpenseForm onSubmit={handleAddExpense} isSubmitting={saving && !editingExpense} />
            <ExpenseList
              expenses={items}
              loading={loading}
              deletingId={deletingId}
              onEdit={setEditingExpense}
              onDelete={handleDeleteExpense}
            />
          </div>

          <aside className="dashboard-grid lg:sticky lg:top-6 lg:self-start">
            <div className="panel animate-rise border-l-2 border-emerald-500 px-5 py-5 md:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">Total expenses</p>
              <p className="mt-4 text-4xl font-semibold text-slate-100">
                PKR {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                Your complete spending total updates immediately after each change.
              </p>
            </div>

            <div className="panel animate-rise px-5 py-5 md:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Insights</p>
              <div className="mt-4 grid gap-3">
                <div className="panel-muted px-4 py-4">
                  <p className="text-sm text-slate-400">This month</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">
                    PKR{' '}
                    {monthExpenses
                      .reduce((sum, expense) => sum + Number(expense.amount), 0)
                      .toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="panel-muted px-4 py-4">
                  <p className="text-sm text-slate-400">Top category</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">{topCategoryName}</p>
                </div>
                <div className="panel-muted px-4 py-4">
                  <p className="text-sm text-slate-400">Entries tracked</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">{items.length}</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>

      <EditModal
        expense={editingExpense}
        isOpen={Boolean(editingExpense)}
        isSaving={saving && Boolean(editingExpense)}
        onClose={() => setEditingExpense(null)}
        onSave={handleSaveExpense}
      />
    </div>
  );
}

export default Dashboard;
