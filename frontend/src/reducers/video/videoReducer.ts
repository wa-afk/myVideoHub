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
    configWithJwt: ConfigWithJWT;
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

// Fetch videos for logged in user
export const fetchVideosForUser = createAsyncThunk<
  IVideo[],
  FileFetchPayload, 
  { rejectValue: string }
>("/video/fetch-user-videos", async (payload, thunkApi) => {
    try {
        const { configWithJwt } = payload;
        const { data } = await backendApi.get<FileResponse>("/api/v1/azure/fetch-videos", configWithJwt);
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

export const fetchVideosForPublic = createAsyncThunk<
  IVideo[],
  void, 
  { rejectValue: string }
>("/video/fetch-public-videos", async (_, thunkApi) => {
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

export const downloadVideo = createAsyncThunk<
  void,
  {id: string},
  {rejectValue: string}
>("/video/download", async (payload, thunkApi) => {
    try {
        const { id } = payload;
        const state = thunkApi.getState() as RootState;
        const queryParams = state.auth.loggedInUser ? `?userId=${encodeURIComponent(state.auth.loggedInUser._id)}`: '';
        const response = await backendApi.get(
            `/api/v1/download/file/${id}${queryParams}`,
            {
                responseType: "blob"
            }
        );
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition? contentDisposition.split("filename=")[1].replace(/[' "]/g, ""): "video.mp4";
        const blob = new Blob([response.data], {
            type: response.headers['content-type'] as string
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.removeChild(link);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Something went wrong";
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const deleteVideo = createAsyncThunk<
  {id: string},
  {id: string; configWithJwt: ConfigWithJWT},
  {rejectValue: string}
>("/video/delete", async ({ id, configWithJwt }, thunkApi) => {
    try {
        const { data } = await backendApi.delete<SingleFileResponse>(`/api/v1/azure/delete-single/video/${id}`, configWithJwt);
        if (data.success) {
            toast.success(data.message);
            return { id };
        }
        toast.warning(data.message);
        return thunkApi.rejectWithValue(data.message);
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
        return thunkApi.rejectWithValue(errorMessage);
    }
});

export const updateVideo = createAsyncThunk<
  null,
  {id: string; updateData: Partial<EditVideo>; configWithJwt: ConfigWithJWT},
  {rejectValue: string}
>("/video/update", async ({ id, updateData, configWithJwt }, thunkApi) => {
    try {
        const formData = new FormData();
        if (updateData.path instanceof File) {
            formData.append("video", updateData.path);
        }
        if (updateData.thumbnail instanceof File) {
            formData.append("thumbnail", updateData.thumbnail);
        }    
        if (updateData.title) formData.append("title", updateData.title);
        if (updateData.description) formData.append("description", updateData.description);
        formData.append("isPrivate", String(updateData.isPrivate));
        const { data } = await backendApi.put<SingleFileResponse>(
            `/api/v1/azure/update-video/${id}`, 
            formData, 
            { ...configWithJwt, headers: {
                ...configWithJwt.headers,
                "Content-Type": "multipart/form-data",
            }}
        );
        if (data.success && data.video) {
            toast.success(data.message);
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
    reducers: {
        setEditVideo: (state, action) => {
            state.editVideo = action.payload;
        }
    },
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
        })
        .addCase(fetchVideosForUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchVideosForUser.rejected, (state) => {
            state.isLoading = false;
        })
        .addCase(fetchVideosForUser.fulfilled, (state, action) => {
            state.videos = action.payload;
            state.isLoading = false;
        })
        .addCase(deleteVideo.fulfilled, (state, action) => {
            state.videos = state.videos?.filter((video) => video._id !== action.payload.id) || null;
            state.isLoading = false;
        });
    }
});

export const videoReducer = videoSlice.reducer;
export const { setEditVideo } = videoSlice.actions;
export const selectUserVideos = (state: RootState) => state.video.videos;
export const selectPublicVideos = (state: RootState) => state.video.publicVideos;
export const selectVideoLoading = (state: RootState) => state.video.isLoading;
export const selectEditingVideo = (state: RootState) => state.video.editVideo;