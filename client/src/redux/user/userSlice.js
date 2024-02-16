import { createSlice } from "@reduxjs/toolkit";

// Create Initial state
const initialState = { currentUser: null, error: null, loading: false };

// Create User Slice
const userSlice = createSlice({
    name: 'user',   // set name as user
    initialState,   // pass initial state
    reducers: {     // create functions which we called reducers here => Will export as actions
        signInStart: (state) => { state.loading = true; },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => { state.loading = true; },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart: (state) => { state.loading = true; },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        singOutUserStart: (state) => { state.loading = true; },
        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        signOutUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

// export these functions as the actions
export const { 
    signInStart, signInSuccess, signInFailure,
    updateUserStart, updateUserSuccess, updateUserFailure,
    deleteUserStart, deleteUserSuccess, deleteUserFailure,
    singOutUserStart, signOutUserSuccess, signOutUserFailure,
} = userSlice.actions;
// export user reducer as default
export default userSlice.reducer; 