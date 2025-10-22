import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {data: null},
    reducers: {
        setProfileData: (state, action) =>{
            state.data = action.payload;
        },
        clearProfile: (state) =>{
            state.data = null;
        },
    },
});

export const {setProfileData, clearProfile} = profileSlice.actions;
export default profileSlice.reducer;