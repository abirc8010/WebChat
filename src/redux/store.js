import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import contactsReducer from "./slices/contactsSlice";
import messagesReducer from "./slices/messagesSlice";
import groupReducer from "./slices/groupSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer,
    messages: messagesReducer,
    group: groupReducer,
  },
});

export default store;
