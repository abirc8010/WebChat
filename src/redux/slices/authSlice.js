import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/axiosConfig';

export const validateToken = createAsyncThunk('auth/validateToken', async ({ email, token }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/api/v1/users/validate-token', { email, token });
        return response.data; 
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


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
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,  
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('email');  
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
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('email', action.payload.user.email);
                localStorage.setItem('username', action.payload.user.username);
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
            })

            .addCase(validateToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateToken.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user; 
            })
            .addCase(validateToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.token = null;
                state.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('email');
            });
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
