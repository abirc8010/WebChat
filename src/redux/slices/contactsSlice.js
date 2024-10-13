import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/axiosConfig";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/v1/users/contacts`, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contactsSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    currentUsername: null,
    currentEmail: null,
    currentProfilePic: null,
    currentContactType: null,
    currentChatId: null,
    loading: false,
    error: null,
  },
  reducers: {
    addContactToState(state, action) {
      const { type, ...contact } = action.payload;

      if (type === "Private") {
        state.contacts.contacts.push(contact);
      } else {
        state.contacts.groups.push(contact);
      }
    },
    setCurrentEmail(state, action) {
      state.currentEmail = action.payload;
    },
    setCurrentUsername(state, action) {
      state.currentUsername = action.payload;
    },
    setCurrentProfilePic(state, action) {
      state.currentProfilePic = action.payload;
    },
    setCurrentContactType(state, action) {
      state.currentContactType = action.payload;
    },
    setCurrentChatId(state, action) {
      state.currentChatId = action.payload;
    },
    clearCurrentContact(state) {
      state.currentContact = null;
      state.currentProfilePic = null;
      state.currentEmail = null;
    },
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
        state.error = action.payload.message || "Failed to fetch contacts";
      });
  },
});

export const {
  setContacts,
  setCurrentEmail,
  setCurrentUsername,
  setCurrentProfilePic,
  clearCurrentContact,
  addContactToState,
  setCurrentContactType,
  setCurrentChatId,
} = contactsSlice.actions;

export default contactsSlice.reducer;
