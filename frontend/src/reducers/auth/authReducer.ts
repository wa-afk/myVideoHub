import { createSlice } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../store";

interface User {
    _id: string;
    email: string;
    name?: string;
    token: string;
    uploadCount: string;
    downloadCount: string;
};

export interface AuthState {
    loggedInUser: User | null;
    loading: boolean;
};

const initialState: AuthState= {
    loggedInUser: null,
    loading: false,
};

const authSlice= createSlice({
    name: "auth",
    initialState,
    reducers: {},
});

export const authReducer= authSlice.reducer;
export const loggedInUser= (state: RootState) => state.auth.loggedInUser;
export const loadingUser= (state: RootState) => state.auth.loading;