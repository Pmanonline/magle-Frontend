import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../../../config";

const BASE = `${backendURL}/api/auth`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("access_token");

const authHeaders = (extra = {}) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
  ...extra,
});

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.accessToken);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, confirm_password }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirm_password }),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Registration failed");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ token }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/verify-email?token=${token}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Verification failed");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── RESEND VERIFICATION ──────────────────────────────────────────────────────
export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async ({ email }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(
          data.message || "Failed to resend email",
        );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Request failed");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirm_password }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/reset-password?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirm_password }),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Reset failed");
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE}/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(data.message || "Token refresh failed");

      localStorage.setItem("access_token", data.accessToken);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── UPDATE USER PROFILE ──────────────────────────────────────────────────────
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const token = getToken();
      const res = await fetch(`${BASE}/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok)
        return thunkAPI.rejectWithValue(
          data.message || "Failed to update profile",
        );

      // Update stored user data
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...data.user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await fetch(`${BASE}/logout`, {
        method: "POST",
        credentials: "include",
        headers: authHeaders(),
      });
    } catch (_) {
      // fail silently — always clear local state
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    }
    return null;
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("access_token") || null,
    loading: false,
    error: null,
    // granular loading states for specific actions
    registerLoading: false,
    forgotLoading: false,
    resetLoading: false,
    verifyLoading: false,
    resendLoading: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload;
      });

    // VERIFY EMAIL
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.verifyLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.verifyLoading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyLoading = false;
        state.error = action.payload;
      });

    // RESEND VERIFICATION
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.resendLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.resendLoading = false;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendLoading = false;
        state.error = action.payload;
      });

    // FORGOT PASSWORD
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotLoading = false;
        state.error = action.payload;
      });

    // RESET PASSWORD
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.error = action.payload;
      });

    // REFRESH TOKEN
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
      });
    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // LOGOUT
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
    });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
