import { AuthenticatedRequestHandler } from "../../config/passportJwtStrategy";
import User from "../../model/userSchema";
import { sendResponse } from "../../utils/sendResponse";

export const getUserDetails: AuthenticatedRequestHandler= async (req, res) => {
    try {
        if(req.user instanceof User) {
            const userId= req.user._id;
            if(!userId){
                return sendResponse(res, 401, false, "Please sign in to continue");
            }
            const user= await User.findById(userId).select("-password");
            if(!user) {
                return sendResponse(res, 404, false, "User not found");
            }
            return sendResponse(res, 200, true, "User details found", { user });
        }
    } catch (error) {
        console.error(`Error in sending user details ${error}`);
        sendResponse(res, 500, false, "Internal Server Error");
    }
};

export const updateUserDetails: AuthenticatedRequestHandler= async (req, res) => {
    try {
        const {name, email}= req.body;
        if(!name) {
            return sendResponse(res, 400, false, "Name is required");
        }
        if(!email) {
            return sendResponse(res, 400, false, "Email is required");
        }
        if(req.user instanceof User){
            const userId= req.user._id;                 // user returned from passport jwt auth (not provided in req)
            if(!userId) {
                return sendResponse(res, 400, false, "User id is required");
            }
            const user= await User.findByIdAndUpdate(userId, {name, email});
            if(!user) {
                return sendResponse(res, 404, false, "User not found");
            }
            return sendResponse(res, 200, true, "Successfully updated user details", {name, email});
        }
    } catch (error) {
        console.error(`Error in updating user details ${error}`);
        sendResponse(res, 500, false, "Internal Server Error");
    }
};