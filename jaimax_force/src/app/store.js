import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import attendanceReducer from "../features/attendance/attendanceSlice";
import leavesReducer from "../features/leaves/leaveSlice";
import logger from "redux-logger";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import holidaysReducer from "../features/holidays/holidaySlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "profile", "attendance", "leaves", "holidays"], 
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  profile: profileReducer,
  attendance: attendanceReducer,
  leaves: leavesReducer,
  holidays: holidaysReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(apiSlice.middleware),
  devTools: true,
});

// setupListeners(store.dispatch);

export const persistor = persistStore(store);
