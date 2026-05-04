import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("access_token");
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = `${BASE_URL}/api/wallets`;

// ─── FETCH ALL WALLETS ────────────────────────────────────────────────────────
export const fetchWallets = createAsyncThunk(
  "wallets/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(BASE, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch");
      return data.wallets || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── CREATE WALLET ────────────────────────────────────────────────────────────
export const createWallet = createAsyncThunk(
  "wallets/create",
  async (walletData, thunkAPI) => {
    try {
      const res = await fetch(BASE, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(walletData),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Failed to create");
      return data.wallet || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── UPDATE WALLET ────────────────────────────────────────────────────────────
export const updateWallet = createAsyncThunk(
  "wallets/update",
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
      return data.wallet || data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── DELETE WALLET ────────────────────────────────────────────────────────────
export const deleteWallet = createAsyncThunk(
  "wallets/delete",
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
const walletSlice = createSlice({
  name: "wallets",
  initialState: {
    items: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: null,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // CREATE
    builder
      .addCase(createWallet.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createWallet.fulfilled, (state, action) => {
        state.createLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createWallet.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      });

    // UPDATE
    builder
      .addCase(updateWallet.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateWallet.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.items.findIndex((w) => w._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateWallet.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });

    // DELETE
    builder
      .addCase(deleteWallet.pending, (state, action) => {
        state.deleteLoading = action.meta.arg;
      })
      .addCase(deleteWallet.fulfilled, (state, action) => {
        state.deleteLoading = null;
        state.items = state.items.filter((w) => w._id !== action.payload);
      })
      .addCase(deleteWallet.rejected, (state, action) => {
        state.deleteLoading = null;
        state.error = action.payload;
      });
  },
});

export const { clearError } = walletSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectAllWallets = (state) => state.wallets.items;
export const selectTotalBalance = (state) =>
  state.wallets.items.reduce((sum, w) => sum + (w.balance || 0), 0);

export default walletSlice.reducer;
