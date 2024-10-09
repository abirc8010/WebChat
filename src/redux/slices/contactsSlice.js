import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/axiosConfig';


export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async ({ email }, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`/api/v1/users/contacts`, {
            params: { email } 
        });  
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const contactsSlice = createSlice({
    name: 'contacts',
    initialState: {
        contacts: [],   
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || 'Failed to fetch contacts';
            });
    }
});

export default contactsSlice.reducer;
