import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    user: null,
    status: 'idle',
    error: null,
};

export const restoreToken = createAsyncThunk('auth/restoreToken', async () => {
    const token = await SecureStore.getItemAsync('userToken');
    return token;
});

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { token: string; user: any }) => {
        // In a real app, this might accept username/password and make an API call.
        // However, if the API call is done via RTK Query, this thunk might just receive the result.
        // For this refactor, let's assume this receives the successful auth payload.
        await SecureStore.setItemAsync('userToken', credentials.token);
        return credentials;
    }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    await SecureStore.deleteItemAsync('userToken');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user: any }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Restore Token
            .addCase(restoreToken.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(restoreToken.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(restoreToken.rejected, (state) => {
                state.status = 'failed';
                state.token = null;
                state.isAuthenticated = false;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Login failed';
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.status = 'idle';
            });
    },
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
