import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/axiosConfig";

export const fetchGroupMembers = createAsyncThunk(
  "group/fetchGroupMembers",
  async (groupId) => {
    const response = await apiClient.get(
      `api/v1/users/group-members/${groupId}`
    );
    return response.data;
  }
);

const groupSlice = createSlice({
  name: "group",
  initialState: {
    members: [],
    admin: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearGroupMembers: (state) => {
      state.members = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.members = action.payload.members;
        state.admin = action.payload.admin;
      })
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGroupMembers } = groupSlice.actions;

export default groupSlice.reducer;
