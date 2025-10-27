import { createSlice } from "@reduxjs/toolkit";
import { setProfileData } from "../profile/profileSlice";

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: {
        data: null,
        lastFetched: null,
    },
    reducers: {
        setAttendanceData: (state, action) =>{
            state.data = action.payload;
            state.lastFetched = Date.now();
        },
        clearAttendance: (state) => {
            state.data = null;
            state.lastFetched = null;
        },
    },
});

export const {setAttendanceData, clearAttendance} = attendanceSlice.actions;
export default attendanceSlice.reducer;