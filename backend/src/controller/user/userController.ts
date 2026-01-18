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