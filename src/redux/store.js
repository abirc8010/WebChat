import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contactsReducer from './slices/contactsSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        contacts: contactsReducer
    }
});

export default store;
