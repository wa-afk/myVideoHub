import { Request, RequestHandler } from "express";
import User from "../../model/userSchema";
import { sendResponse } from "../../utils/sendResponse";
import crypto from 'crypto';
import { comparePassword, hashPassword } from '../../utils/passwordHelper';
import { generateJwtToken } from "../../utils/generateJwtToken";
import dotenv from 'dotenv';
import { resetPasswordEmail } from "../../mailer/resetPassword";
dotenv.config();

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
        const hashedPassword= await hashPassword(password);
        const newUser= await User.create({
            email,
            password: hashedPassword,
            token: crypto.randomBytes(16).toString("hex")
        });
        return sendResponse(res, 201, true, 'User created successfully');
    } catch (error) {
        console.error(`Error in signing up user\n${error}`);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};

export const signInUser: RequestHandler= async (req: RegisterReq, res) => {
    try {
        const {email, password}= req.body;
        const user= await User.findOne({email});
        const dummy = process.env.DUMMY_HASH as string;
        const matchPassword= await comparePassword(password, user?.password ?? dummy);     /*Dummy hash to equalize timing mismatch for timing attacks.*/
        if(!user || !matchPassword){
            return sendResponse(res, 401, false, 'Invalid credentials');    /*Prevent brute force attacks by vague error message.*/
        }
        const jwtToken= await generateJwtToken(user);
        return sendResponse(res, 200, true, 'Logged in successfully', {user: {token: jwtToken}});
        //jwt token sent to client browser but not stored in db
    } catch (error) {
        console.error(`Error in authentication ${error}`);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};

export const sendResetPasswordEmail: RequestHandler= async (req, res) => {
    try {
        const { email }= req.body;
        if(!email) {
            return sendResponse(res, 400, false, "Email address is required");
        }
        const user= await User.findOne({ email });
        if(!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        await resetPasswordEmail(user);
        return sendResponse(res, 204, true, "Check your registered email to reset password");
    } catch (error) {
        console.error(`Error in sending reset password email ${error}`);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};

export const updatePassword: RequestHandler= async (req, res) => {
    try {
        const { token }= req.params;
        const { password }= req.body;
        if(!token) {
            return sendResponse(res, 404, false, "User not found");
        }
        const user= await User.findOne({ token });
        if(!user) {
            return sendResponse(res, 404, false, "User not found");
        }
        const hashedPassword= await hashPassword(password);
        user.password= hashedPassword;
        user.token= crypto.randomBytes(16).toString("hex");     //To disallow user updating password multiple times through same link
        await user.save();
        return sendResponse(res, 200, true, "Updated your password");
    } catch (error) {
        console.error(`Error in updating password ${error}`);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};