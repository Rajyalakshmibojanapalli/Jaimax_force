import { createSlice } from "@reduxjs/toolkit";

const holidaysSlice = createSlice({
    name: "holidays",
    initialState: {
        data: null,
        lastFetched: null,
    },
    reducers: {
        setHolidaysData: (state, action) => {
            state.data = action.payload;
            state.lastFetched = Date.now();
        },
        clearHolidays: (state) => {
            state.data = null;
            state.lastFetched = null;
        },
    },
});

export const {setHolidaysData,clearHolidays} = holidaysSlice.actions;
export default holidaysSlice.reducer;