import { Request, RequestHandler } from "express";
import User from "../model/userSchema";
import { sendResponse } from "../utils/sendResponse";

interface RegisterReq extends Request{
    body: {
        email: string,
        password: string,      
    }
};

export const signUpUser: RequestHandler = async (req: RegisterReq, res) => {
    try {
        const {email, password}= req.body;
        const existingUser= await User.findOne({email});
        if(existingUser){
            return sendResponse(res, 409, false, 'User already exists');
        }
        const newUser= await User.create({
            email,
            password
        });
        return sendResponse(res, 201, true, 'User created successfully');
    } catch (error) {
        console.error(`Error in signing up user ${error}`);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};