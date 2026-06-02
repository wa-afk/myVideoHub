import { RequestHandler } from "express";
import path from 'path';
import User from "../../model/userSchema";
import Video from "../../model/videoSchema";
import { sendResponse } from "../../utils/sendResponse";
import { container } from "../../config/azure";

export const uploadFile: RequestHandler = async (req, res) => {
    try {
        if (req.files && (req.files as any).video) {
            let { title, description, isPrivate } = req.body;
            let baseName;
            //To extend it for uploading multiple files, we can loop over the arrays:-
            const videoFile = (req.files as any).video[0];
            const thumbnailFile = (req.files as any).thumbnail[0] 
                ? (req.files as any).thumbnail[0] 
                : null;

            if (!title) {
                const extension = path.extname(videoFile.originalname);
                baseName = path.basename(videoFile.originalname, extension);
            }
            if (req.user instanceof User) {
                if ('location' in videoFile) {
                    if ('key' in videoFile) {
                        const newVideo = await Video.create({
                            title: title || baseName,
                            description: description? description : undefined,
                            uploadedBy: req.user._id,
                            path: videoFile.location,
                            key: videoFile.key,
                            isPrivate,
                            thumbnail: thumbnailFile? thumbnailFile.location : undefined,
                        });
                        const user = await User.findById(req.user._id);
                        if (user) {
                            user.uploadCount += 1;
                            await user.save();
                        }
                        return sendResponse(res, 200, true, "Video uploaded successfully", {
                            video: {
                                _id: newVideo._id,
                                path: newVideo.path,
                                title: newVideo.title,
                                description: newVideo.description,
                                thumbnail: newVideo.thumbnail,
                                uploadedBy: {
                                    email: user?.email
                                },
                                isPrivate: newVideo.isPrivate
                            }
                        });
                    }
                }
                return sendResponse(res, 400, false, "Upload failed");
            }
            return sendResponse(res, 404, false, "Not Authorized to upload the video");
        }
    } catch (error) {
        console.error(`Error in uploading videos ${error}`);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

export const fetchVideos: RequestHandler = async (req,res) => {
    try {
        const videos = await Video.find({ isPrivate: false }).sort({
            createdAt: -1,
        })
        .populate("uploadedBy", "email");
        sendResponse(res, 200, true, "Fetched videos successfully", { videos });
    } catch (error) {
        console.error(`Error in fetching videos ${error}`);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

export const fetchSingleVideo: RequestHandler = async (req,res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return sendResponse(res, 400, false, "No video selected");
        }
        const video = await Video.findById(id).populate("uploadedBy", "email");
        if (!video) {
            return sendResponse(res, 404, false, "Video not found");
        }
        sendResponse(res, 200, true, "Video retrieved successfully", { video });
    } catch (error) {
        console.error(`Error in fetching the video ${error}`);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

export const deleteGivenVideo: RequestHandler = async (req,res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return sendResponse(res, 400, false, "No video selected");
        }
        const video = await Video.findByIdAndDelete(id);
        if (!video) {
            return sendResponse(res, 404, false, "Video to be deleted doesn't exist");
        }
        sendResponse(res, 200, true, "Video deleted successfully", { video });
    } catch (error) {
        console.error(`Error in deleting the video ${error}`);
        return sendResponse(res, 500, false, "Internal server error");
    }
};

export const downloadVideo: RequestHandler = async (req,res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;
        if (!id) {
            return sendResponse(res, 400, false, "No video selected");
        }
        const video = await Video.findById(id);
        if (!video) {
            return sendResponse(res, 404, false, "Video not found");
        }
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                user.downloadCount += 1;
                await user.save();
            }
        }
        const blockBlob = container.getBlockBlobClient(video.key);
        const downloadBlockBlobResponse = await blockBlob.download();
        res.setHeader("Content-Disposition", `attachment;filename=${video.title}`);
        res.setHeader("Content-Type", downloadBlockBlobResponse.contentType || "video/mp4");

        const stream = downloadBlockBlobResponse.readableStreamBody;
        if (stream) {
            stream.pipe(res);
        } else {
            return sendResponse(res, 500, false, "Failed to stream video");
        }
    } catch (error) {
        console.error(`Error in downloading video ${error}`);
        return sendResponse(res, 500, false, "Internal server error");
    }
};