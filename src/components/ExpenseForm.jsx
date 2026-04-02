import { useEffect, useRef, useState } from 'react';

const initialValues = {
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().split('T')[0],
};

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Work', 'Entertainment', 'Other'];

function ExpenseForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = 'Please enter an expense title.';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      nextErrors.amount = 'Amount must be greater than zero.';
    }

    if (!formData.date) {
      nextErrors.date = 'Pick a valid date.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await onSubmit({
      ...formData,
      title: formData.title.trim(),
      amount: Number(formData.amount),
    });

    if (result) {
      setFormData(initialValues);
      setErrors({});
      titleRef.current?.focus();
    }
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="panel animate-rise px-5 py-5 md:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-400">Quick add</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Track a new expense</h2>
          <p className="mt-1 text-sm text-slate-400">Add a record fast without opening extra screens.</p>
        </div>
        <div className="border border-slate-700 bg-slate-950 px-4 py-3 text-slate-200">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Today</p>
          <p className="mt-1 text-sm font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-300">Title</span>
          <input
            ref={titleRef}
            type="text"
            value={formData.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Team lunch"
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
            placeholder="2450"
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
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        data-cursor="Add"
        className="mt-6 inline-flex items-center justify-center bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Saving...' : 'Add expense'}
      </button>
    </form>
  );
}

export default ExpenseForm;
