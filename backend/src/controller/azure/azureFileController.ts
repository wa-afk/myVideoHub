import { RequestHandler } from "express";
import path from 'path';
import User from "../../model/userSchema";
import Video from "../../model/videoSchema";
import { sendResponse } from "../../utils/sendResponse";

export const uploadFile: RequestHandler = async(req, res) => {
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
        console.log(error);
        return sendResponse(res, 500, false, "Internal server error");
    }
};