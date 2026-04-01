import { useEffect, useRef, useState } from 'react';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Work', 'Entertainment', 'Other'];

function EditModal({ expense, isOpen, isSaving, onClose, onSave }) {
  const [formData, setFormData] = useState(expense);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    if (!expense) {
      return;
    }

    setFormData({
      ...expense,
      amount: Number(expense.amount),
      date: expense.date,
    });
    setErrors({});
  }, [expense]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    titleRef.current?.focus();

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !formData) {
    return null;
  }

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required.';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      nextErrors.amount = 'Enter a valid amount.';
    }

    if (!formData.date) {
      nextErrors.date = 'Choose a valid date.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const didSave = await onSave({
      title: formData.title.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
    });

    if (didSave) {
      onClose();
    }
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  return (
    <div className="animate-fade-in fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="panel w-full max-w-2xl p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Edit expense</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">Update expense details</h2>
            <p className="mt-1 text-sm text-slate-400">Refine the amount, category, title, or date and save the changes.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-700 bg-slate-950 px-3 py-1 text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">Title</span>
            <input
              ref={titleRef}
              type="text"
              value={formData.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
            />
            {errors.title ? <span className="text-sm text-red-400">{errors.title}</span> : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(event) => updateField('amount', event.target.value)}
              className="border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
            />
            {errors.amount ? <span className="text-sm text-red-400">{errors.amount}</span> : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">Category</span>
            <select
              value={formData.category}
              onChange={(event) => updateField('category', event.target.value)}
              className="border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-300">Date</span>
            <input
              type="date"
              value={formData.date}
              onChange={(event) => updateField('date', event.target.value)}
              className="border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
            />
            {errors.date ? <span className="text-sm text-red-400">{errors.date}</span> : null}
          </label>

          <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-700 bg-slate-950 px-5 py-3 font-medium text-slate-300 transition hover:border-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving changes...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
