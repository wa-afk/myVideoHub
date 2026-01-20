import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";
import type { NavigateFunction } from "react-router-dom";

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

interface signUpPayload {
    email: string;
    password: string;
};

interface signInPayload {
    email: string;
    password: string;
    navigate: NavigateFunction
};

interface authResponse {
    success: boolean;
    message: string;
    user?: User;
}

// Signup request to backend (Redux doesn't provide async functions by default)
// First arg type is not URL or route but similar looking by convention to make it unique
// void type as signup request will not receive any data in response on success, reject value can be error message
export const signUpuser= createAsyncThunk<void, signUpPayload, {rejectValue: string}> ("auth/sign-up-user", async (payload) => {
    try {
        const { data }= await backendApi.post<authResponse>("/api/v1/auth/sign-up",  payload);
        if(data.success) {
            toast.success(data.message);
        } else {
            toast.warning(data.message);
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Something went wrong');
    }
});

//string to accept jwt token if successful, store it locally
export const signInUser= createAsyncThunk<string | null, signInPayload, {rejectValue: string}> ("auth/sign-in-user", async (payload, thunkApi) => {
    try {
        const {email, password, navigate}= payload;
        const { data }= await backendApi.post<authResponse>("/api/v1/auth/sign-in",  {email, password});
        if(data.success && data.user?.token) {
            if(data.user) {
                toast.success(data.message);
                localStorage.setItem('token', data.user.token);
                // navigate user to profile automatically
                navigate('/user/profile');
            }
            return data.user.token || null;
        } else {
            toast.warning(data.message);
        }
        return thunkApi.rejectWithValue(data.message);
    } catch (error: any) {
        const errorMessage= error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const fetchUserDetails= createAsyncThunk<User | null, void, {rejectValue: string}>("auth/fetch-user-details", async (_, thunkApi) => {
    try {
        const token= localStorage.getItem("token");
        if(!token){
            return thunkApi.rejectWithValue("No authorization token found");
        }
        const {data}= await backendApi.get("/api/v1/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if(data.success){
            return data.user;
        } else{
            return thunkApi.rejectWithValue(data.message);
        }
    } catch (error: any) {
        const errorMessage= error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
        return thunkApi.rejectWithValue(errorMessage);
    }
});

const authSlice= createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOutUser: (state, action) => {
            const navigate= action.payload;
            localStorage.removeItem("token");
            state.loggedInUser= null;
            toast.info("Logged out successfully");
            navigate("/sign-in");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signInUser.pending, (state) => {
            state.loading= true;
        })
        .addCase(signInUser.fulfilled, (state) => {
            state.loading= false;
        })
        .addCase(signInUser.rejected, (state) => {
            state.loading= false;
        })
        .addCase(fetchUserDetails.pending, (state) => {
            state.loading= true;
        })
        .addCase(fetchUserDetails.fulfilled, (state, action) => {
            state.loggedInUser= action.payload;
            state.loading= false;
        })
        .addCase(fetchUserDetails.rejected, (state) => {
            state.loading= false;
        });
    }
});

export const authReducer= authSlice.reducer;
export const { logOutUser }= authSlice.actions;
export const selectLoggedInUser= (state: RootState) => state.auth.loggedInUser;
export const selectLoading= (state: RootState) => state.auth.loading;