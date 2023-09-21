import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { adminAccess } from '@/lib/AdminAccess';
import * as apiClient from '@/lib/FetchWrapper';

interface AdminAuthState {
    authError: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const initialState: AdminAuthState = {
    authError: null,
    isLoading: false,
    isLoggedIn: adminAccess.tokenValue != null,
}

const slice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        authLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        loginSuccess: (state) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.authError = null;
        },
        activationSuccess: (state) => {
            state.isLoading = false;
            state.authError = null;
        },
        resetLinkSent: (state) => {
            state.isLoading = false;
            state.authError = null;
        },
        resetPasswordSuccess: (state) => {
            state.isLoading = false;
            state.authError = null;
        },
        authFailed: (state, action) => {
            state.authError = action.payload;
            state.isLoading = false;
        },
        clearMsg: (state) => {
            state.authError = null;
        },
        logoutSuccess: (state) => {
            state.isLoggedIn = false;
        },
    },
});
export default slice.reducer

const { authLoading, loginSuccess, resetPasswordSuccess, resetLinkSent, logoutSuccess, activationSuccess } = slice.actions

const showError = (thunkAPI: any, error: string) => {
    thunkAPI.dispatch(authLoading(false));
}

export const login = createAsyncThunk(
    "adminAuth/login",
    async (payload: { username: string, password: string, token: any }, thunkAPI: any) => {
        thunkAPI.dispatch(authLoading(true))
        try {
            const result = await apiClient.post('/api/admin/auth/authenticate', payload);
            await adminAccess.authenticate(result);
            thunkAPI.dispatch(loginSuccess());
            return result;
        } catch (error: any) {
            showError(thunkAPI, error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const confirmEmail = createAsyncThunk(
    "adminAuth/confirmEmail",
    async (payload: { email: string, token: any }, thunkAPI: any) => {
        thunkAPI.dispatch(authLoading(true))
        try {
            const result = await apiClient.post('/api/admin/auth/confirmEmail', payload);
            thunkAPI.dispatch(authLoading(false))
            return result;
        } catch (error: any) {
            thunkAPI.dispatch(authLoading(false))
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const activate = createAsyncThunk(
    "adminAuth/activate",
    async (payload: { email: string, token: string, password: string }, thunkAPI: any) => {
        thunkAPI.dispatch(authLoading(true))
        try {
            const result = await apiClient.post('/api/admin/auth/activate', payload);
            thunkAPI.dispatch(activationSuccess());
            return result;
        } catch (error: any) {
            showError(thunkAPI, error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "adminAuth/forgotPassword",
    async (payload: { email: string, token: any }, thunkAPI: any) => {
        thunkAPI.dispatch(authLoading(true))

        try {
            const result = await apiClient.post('/api/admin/auth/forgotPassword', payload);
            thunkAPI.dispatch(resetLinkSent());
            return { msg: result, email: payload.email };
        } catch (error: any) {
            showError(thunkAPI, error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "adminAuth/resetPassword",
    async (payload: { email: string, token: any, password: string, }, thunkAPI: any) => {
        thunkAPI.dispatch(authLoading(true))

        try {
            const result = await apiClient.post('/api/admin/auth/resetPassword', payload);
            thunkAPI.dispatch(resetPasswordSuccess());
            return { msg: result, email: payload.email };
        } catch (error: any) {
            showError(thunkAPI, error);
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const logout = createAsyncThunk(
    "adminAuth/logout",
    async (_: any, thunkAPI: any) => {
        try {
            adminAccess.logout();
            return thunkAPI.dispatch(logoutSuccess())
        } catch (e: any) {
            return console.error(e.message);
        }
    }
);