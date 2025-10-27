// // src/features/auth/authSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: JSON.parse(localStorage.getItem("user")) || null,
//   accessToken: localStorage.getItem("accessToken") || null,
//   refreshToken: localStorage.getItem("refreshToken") || null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action) => {
//       const { user, accessToken, refreshToken } = action.payload; 
//       state.user = user;
//       state.accessToken = accessToken;
//       state.refreshToken = refreshToken;

//       localStorage.setItem("user", JSON.stringify(user));
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);
//     },

//     logout: (state) => {
//       state.user = null;
//       state.accessToken = null;
//       state.refreshToken = null;
//       localStorage.removeItem("user");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  currentMode: localStorage.getItem("currentMode") || null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // === When logging in ===
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      // Default mode is their true role
      state.currentMode = user?.role || "employee";

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("currentMode", user?.role || "employee");
    },

    // === Logout ===
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.currentMode = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("currentMode");
    },

    // === Toggle Role Mode (Admin ↔ Employee) ===
    toggleUserMode: (state) => {
      if (!state.user) return;
      const nextMode =
        state.currentMode === "employee" ? state.user.role : "employee";
      state.currentMode = nextMode;
      localStorage.setItem("currentMode", nextMode);
    },

    // === Restore Mode on App Reload ===
    setModeFromStorage: (state, action) => {
      state.currentMode = action.payload;
      localStorage.setItem("currentMode", action.payload);
    },
  },
});

export const {
  setCredentials,
  logout,
  toggleUserMode,
  setModeFromStorage,
} = authSlice.actions;
export default authSlice.reducer;
