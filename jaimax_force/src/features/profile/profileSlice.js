import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    lastFetched: null,
  },
  reducers: {
    setProfileData: (state, action) => {
      state.data = action.payload;
      state.lastFetched = Date.now();
    },
    clearProfile: (state) => {
      state.data = null;
      state.lastFetched = null;
    },
  },
});

export const { setProfileData, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
