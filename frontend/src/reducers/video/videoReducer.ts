import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ConfigWithJWT } from "../../types";
import backendApi from "../../api/backendApi";
import { toast } from "sonner";
import type { RootState } from "../store";

export interface IVideo {
    _id: string;
    path: string;
    title?: string;
    description?: string;
    uploadedBy: {
        email: string;
    };
    isPrivate: boolean;
    thumbnail: string;
};

export interface EditVideo {
    _id: string;
    path: File | string;
    title?: string;
    description?: string;
    uploadedBy: {
        email: string;
    };
    isPrivate: boolean | string;
    thumbnail: File | string;
};

export interface VideoState {
    videos: IVideo[] | null;
    publicVideos: IVideo[] | null;
    searchResults: IVideo[] | null;
    isLoading: boolean;
    editVideo: IVideo | null;
};

// Payload Types
interface FileFetchPayload {
    config: ConfigWithJWT;
};

// Backend Api Response Types
interface  SingleFileResponse {
    success: boolean;
    message: string;
    video?: IVideo;
};

interface  FileResponse {
    success: boolean;
    message: string;
    videos?: IVideo[];
};

const initialState: VideoState = {
    videos: [],
    publicVideos: [],
    searchResults: [],
    isLoading: false,
    editVideo: null
};

export const fetchVideosForPublic = createAsyncThunk<
  IVideo[],
  void, 
  { rejectValue: string }
>("/videos/fetch-public-videos", async (_, thunkApi) => {
    try {
        const { data } = await backendApi.get<FileResponse>("/api/v1/fetch-videos");
        if (data.success) {
            return data.videos || [];
        }
        toast.warning(data.message);
        return thunkApi.rejectWithValue(data.message);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
        return thunkApi.rejectWithValue(errorMessage);
    }
});

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchVideosForPublic.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchVideosForPublic.fulfilled, (state, action) => {
            state.publicVideos = action.payload;
            state.isLoading = false;
        })
        .addCase(fetchVideosForPublic.rejected, (state) => {
            state.isLoading = false;
        });
    }
});

export const videoReducer = videoSlice.reducer;
export const selectPublicVideos = (state: RootState) => state.video.publicVideos;
export const selectVideoLoading = (state: RootState) => state.video.isLoading;