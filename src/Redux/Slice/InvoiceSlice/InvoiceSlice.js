import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("access_token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = `${BASE_URL}/api/invoices`;

// ─── FETCH ALL INVOICES ───────────────────────────────────────────────────────
export const fetchInvoices = createAsyncThunk(
  "invoices/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(BASE, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch");
      return data.invoices || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── FETCH INVOICE STATS ──────────────────────────────────────────────────────
export const fetchInvoiceStats = createAsyncThunk(
  "invoices/fetchStats",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/stats`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(
          data.message || "Failed to fetch stats",
        );
      return data.stats || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── CREATE INVOICE ───────────────────────────────────────────────────────────
export const createInvoice = createAsyncThunk(
  "invoices/create",
  async (invoiceData, thunkAPI) => {
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(invoiceData),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to create");
      return data.invoice || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── UPDATE INVOICE ───────────────────────────────────────────────────────────
export const updateInvoice = createAsyncThunk(
  "invoices/update",
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
      return data.invoice || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── DELETE INVOICE ───────────────────────────────────────────────────────────
export const deleteInvoice = createAsyncThunk(
  "invoices/delete",
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

// ─── MARK AS PAID ─────────────────────────────────────────────────────────────
export const markAsPaid = createAsyncThunk(
  "invoices/markAsPaid",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/${id}/mark-paid`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to update");
      return data.invoice || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    items: [],
    stats: {
      totalInvoices: 0,
      totalPaid: 0,
      totalPending: 0,
      totalVAT: 0,
    },
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: null,
    error: null,
    filter: "all",
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // FETCH STATS
    builder.addCase(fetchInvoiceStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    // CREATE
    builder
      .addCase(createInvoice.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.createLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // UPDATE
    builder
      .addCase(updateInvoice.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deleteInvoice.pending, (state, action) => {
        state.deleteLoading = action.meta.arg;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.deleteLoading = null;
        state.items = state.items.filter((i) => i._id !== action.payload);
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.deleteLoading = null;
        state.error = action.payload;
      });

    // MARK AS PAID
    builder.addCase(markAsPaid.fulfilled, (state, action) => {
      const idx = state.items.findIndex((i) => i._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    });
  },
});

export const { clearError, setFilter } = invoiceSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllInvoices = (state) => state.invoices.items;

export const selectFilteredInvoices = (state) => {
  const { items, filter } = state.invoices;
  if (filter === "paid") return items.filter((i) => i.status === "paid");
  if (filter === "unpaid") return items.filter((i) => i.status === "unpaid");
  return items;
};

export const selectDashboardStats = (state) => state.invoices.stats;

export default invoiceSlice.reducer;
