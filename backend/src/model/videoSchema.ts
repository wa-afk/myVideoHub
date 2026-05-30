import mongoose, { Document, Model, Schema } from "mongoose"

export interface IVideo extends Document {
    title: string;
    description?: string;
    key: string;
    path: string;
    uploadedBy: mongoose.Types.ObjectId;
    isPrivate?: boolean;
    thumbnail?: string;
    createdAt: Date;
    uploadedAt: Date;
};

const videoSchema: Schema = new Schema({
    title: {type: String, required: true},
    description: {type: String, default: "Default description"},
    key: {type: String, required: true},
    path: {type: String, required: true},
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPrivate: {type: Boolean, default: true},
    thumbnail : {
        type: String,
        default: "https://cdn.pixabay.com/photo/2023/02/03/05/06/swirls-7764159_1280.jpg"
    }
}, { timestamps: true });

const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);

export default Video;