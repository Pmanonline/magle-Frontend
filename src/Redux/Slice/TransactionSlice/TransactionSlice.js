import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("access_token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = `${BASE_URL}/api/transactions`;

// ─── FETCH ALL TRANSACTIONS ───────────────────────────────────────────────────
// src/Redux/Slice/TransactionSlice/TransactionSlice.js

// ─── FETCH ALL TRANSACTIONS ───────────────────────────────────────────────────
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async ({ type, status, limit } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (status) params.append("status", status);
      if (limit) params.append("limit", limit);

      const url = params.toString() ? `${BASE}?${params}` : BASE;
      console.log("Fetching transactions from:", url);

      const res = await fetch(url, { headers: authHeaders() });
      const data = await res.json();

      console.log("Transactions API response:", data);

      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch");

      // Check the response structure - your API might return { status, transactions }
      return data.transactions || data;
    } catch (err) {
      console.error("Fetch transactions error:", err);
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── CREATE TRANSACTION ───────────────────────────────────────────────────────
export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transactionData, thunkAPI) => {
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(transactionData),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to create");
      return data.transaction || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── UPDATE TRANSACTION ───────────────────────────────────────────────────────
export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, ...updates }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/${id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to update");
      return data.transaction || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── DELETE TRANSACTION ───────────────────────────────────────────────────────
export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        return thunkAPI.rejectWithValue(data.message || "Failed to delete");
      }
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    items: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: null,
    error: null,
    filters: {
      type: null,
      status: null,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTransactionFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { type: null, status: null };
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE
    builder
      .addCase(createTransaction.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.createLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // UPDATE
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deleteTransaction.pending, (state, action) => {
        state.deleteLoading = action.meta.arg;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deleteLoading = null;
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deleteLoading = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, setTransactionFilter, clearFilters } =
  transactionSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllTransactions = (state) => state.transactions.items;
export const selectTransactionsByType = (state, type) =>
  state.transactions.items.filter((t) => t.type === type);
export const selectTotalIncome = (state) =>
  state.transactions.items
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
export const selectTotalExpenses = (state) =>
  state.transactions.items
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

export default transactionSlice.reducer;
