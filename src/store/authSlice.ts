import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import type {
  AuthState,
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  GoogleLoginRequest,
  AppleLoginRequest,
} from '../types/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isLoginLoading: false,
  isRegisterLoading: false,
  isOtpSending: false,
  otpSent: false,
  error: null,
};

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async () => {
    return await authService.restoreSession();
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (data: SendOtpRequest, { rejectWithValue }) => {
    try {
      return await authService.sendOtp(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      return await authService.verifyOtp(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid OTP');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (data: GoogleLoginRequest, { rejectWithValue }) => {
    try {
      return await authService.googleLogin(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Google login failed');
    }
  }
);

export const appleLogin = createAsyncThunk(
  'auth/appleLogin',
  async (data: AppleLoginRequest, { rejectWithValue }) => {
    try {
      return await authService.appleLogin(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Apple login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetOtp: (state) => {
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    // restoreSession
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
      });

    // sendOtp
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isOtpSending = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isOtpSending = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isOtpSending = false;
        state.error = action.payload as string;
      });

    // verifyOtp
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.otpSent = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload as string;
      });

    // registerUser
    builder
      .addCase(registerUser.pending, (state) => {
        state.isRegisterLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isRegisterLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isRegisterLoading = false;
        state.error = action.payload as string;
      });

    // googleLogin
    builder
      .addCase(googleLogin.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload as string;
      });

    // appleLogin
    builder
      .addCase(appleLogin.pending, (state) => {
        state.isLoginLoading = true;
        state.error = null;
      })
      .addCase(appleLogin.fulfilled, (state, action) => {
        state.isLoginLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(appleLogin.rejected, (state, action) => {
        state.isLoginLoading = false;
        state.error = action.payload as string;
      });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.error = null;
    });
  },
});

export const { clearError, resetOtp } = authSlice.actions;
export default authSlice.reducer;
