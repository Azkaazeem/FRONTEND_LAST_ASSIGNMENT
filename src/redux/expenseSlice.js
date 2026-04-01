import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabaseClient';

const initialState = {
  items: [],
  loading: false,
  saving: false,
  error: null,
};

const normalizeExpense = (expense) => ({
  ...expense,
  amount: Number(expense.amount),
});

const parseSupabaseError = (error, fallback) => error?.message ?? fallback;

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (userId, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return rejectWithValue(parseSupabaseError(error, 'Unable to fetch expenses.'));
    }

    return data.map(normalizeExpense);
  },
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async ({ userId, expense }, { rejectWithValue }) => {
    const payload = {
      ...expense,
      amount: Number(expense.amount),
      user_id: userId,
    };

    const { data, error } = await supabase.from('expenses').insert(payload).select().single();

    if (error) {
      return rejectWithValue(parseSupabaseError(error, 'Unable to add expense.'));
    }

    return normalizeExpense(data);
  },
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ userId, expenseId, updates }, { rejectWithValue }) => {
    const payload = {
      ...updates,
      amount: Number(updates.amount),
    };

    const { data, error } = await supabase
      .from('expenses')
      .update(payload)
      .eq('id', expenseId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return rejectWithValue(parseSupabaseError(error, 'Unable to update expense.'));
    }

    return normalizeExpense(data);
  },
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async ({ userId, expenseId }, { rejectWithValue }) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId);

    if (error) {
      return rejectWithValue(parseSupabaseError(error, 'Unable to delete expense.'));
    }

    return expenseId;
  },
);

const sortLatestFirst = (items) =>
  [...items].sort((left, right) => {
    const rightDate = new Date(right.date).getTime();
    const leftDate = new Date(left.date).getTime();

    if (rightDate !== leftDate) {
      return rightDate - leftDate;
    }

    return new Date(right.created_at ?? 0).getTime() - new Date(left.created_at ?? 0).getTime();
  });

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.saving = false;
        state.items = sortLatestFirst([action.payload, ...state.items]);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.saving = false;
        state.items = sortLatestFirst(
          state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
        );
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  },
});

export default expenseSlice.reducer;
