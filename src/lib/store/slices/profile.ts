import { Admin } from "@/lib/types/User";
import apiClient from '@/lib/FetchWrapper';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminAuth from "./adminAuth";
import adminAccess from "@/lib/AdminAccess";

interface ProfileState {
    user: Admin | null;
    isLoading: boolean;
}

const initialState: ProfileState = {
    user: adminAccess.adminValue,
    isLoading: false,
}

const slice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        loading: (state, action) => {
            state.isLoading = action.payload;
        },
        success: (state, action) => {
            state.user = action.payload;
            state.isLoading = false;
        },
    },
});
export default slice.reducer;

const actions = slice.actions;

export const loadProfile = createAsyncThunk(
    "profile/loadProfile",
    async (_: any, thunkAPI: any) => {
        thunkAPI.dispatch(actions.loading(true))
        try {
            const admin = await apiClient.get<Admin>('/api/admin/profile');
            adminAccess.setAdmin(admin);
            thunkAPI.dispatch(actions.success(admin));
        } catch (error: any) {
            thunkAPI.dispatch(actions.loading(false))
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (payload: { fullName?: string, email?: string, password?: string, newPassword?: string, }, thunkAPI: any) => {
        thunkAPI.dispatch(actions.loading(true))
        try {
            const admin = await apiClient.post<Admin>(`/api/admin/profile/update`, payload);
            adminAccess.setAdmin(admin);
            thunkAPI.dispatch(actions.success(admin))
            return admin;
        } catch (error: any) {
            thunkAPI.dispatch(actions.loading(false))
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const logout = createAsyncThunk(
    "profile/logout",
    async (_: {}, thunkAPI) => {
        try {
            adminAccess.logout();
            thunkAPI.dispatch(adminAuth.logout({}));
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);