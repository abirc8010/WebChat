import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/axiosConfig';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/api/v1/users/login', { email, password });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


export const registerUser = createAsyncThunk('auth/registerUser', async ({ email, username, password }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/api/v1/users/register', { email, username, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
