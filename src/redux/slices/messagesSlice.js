import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/axiosConfig";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ email, currentEmail, currentChatId, currentContactType }) => {
    const response = await apiClient.get("/api/v1/users/messages", {
      params: {
        senderEmail: email,
        receiverEmail: currentEmail,
        groupId: currentContactType === "Group" ? currentChatId : null,
      },
    });
    return response.data;
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    latestSender: null,
    latestMesages: null,
    reply: null,
    loading: false,
    error: null,
  },
  reducers: {
    setReply: (state, action) => {
      state.reply = action.payload;
    },
    setLatestSender: (state, action) => {
      state.latestSender = action.payload;
    },
    setLatestMessages: (state, action) => {
      state.latestMesages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  latestMesages,
  latestSender,
  addMessage,
  setReply,
  clearMessages,
} = messagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;
export const selectLoading = (state) => state.messages.loading;

export default messagesSlice.reducer;
