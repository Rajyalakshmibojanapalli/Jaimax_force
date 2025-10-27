import { createSlice } from "@reduxjs/toolkit";

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    userId: null, // track whose data this belongs to
    allLeaves: null,
    summary: null,
    balance: null,
    lastFetched: {
      allLeaves: null,
      summary: null,
      balance: null,
    },
  },
  reducers: {
    setAllLeaves: (state, action) => {
      state.allLeaves = action.payload;
      state.lastFetched.allLeaves = Date.now();
    },
    setLeaveSummary: (state, action) => {
      state.summary = action.payload;
      state.lastFetched.summary = Date.now();
    },
    setLeaveBalance: (state, action) => {
      state.balance = action.payload;
      state.lastFetched.balance = Date.now();
    },
    setLeaveUser: (state, action) => {
      // reset if a different user logs in
      if (state.userId !== action.payload) {
        state.userId = action.payload;
        state.allLeaves = null;
        state.summary = null;
        state.balance = null;
        state.lastFetched = { allLeaves: null, summary: null, balance: null };
      }
    },
    clearLeaves: (state) => {
      state.allLeaves = null;
      state.summary = null;
      state.balance = null;
      state.lastFetched = { allLeaves: null, summary: null, balance: null };
      state.userId = null;
    },
  },
});

export const {
  setAllLeaves,
  setLeaveSummary,
  setLeaveBalance,
  setLeaveUser,
  clearLeaves,
} = leaveSlice.actions;

export default leaveSlice.reducer;
