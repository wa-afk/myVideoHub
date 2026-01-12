import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    name?: string,
    email: string,
    password: string,
    token?: string,
    uploadCount: Number,
    downloadCount: Number
};

const userSchema= new Schema ({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    token: {type: String},
    uploadCount: {type: Number, default: 0},
    downloadCount: {type: Number, default: 0}
}, {
    timestamps: true
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);  /* "User" creates mongoDB collection Users.*/

export default User;