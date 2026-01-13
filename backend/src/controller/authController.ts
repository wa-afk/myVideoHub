import { Request, RequestHandler } from "express";
import User from "../model/userSchema";
import { sendResponse } from "../utils/sendResponse";
import crypto from 'crypto';
import { comparePassword, hashPassword } from '../utils/passwordHelper';
import { generateJwtToken } from "../utils/generateJwtToken";
import dotenv from 'dotenv';
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
        return sendResponse(res, 200, true, 'Logged in successfully', {user: jwtToken});
    } catch (error) {
        console.error(`Error in authentication ${error}`);
        return sendResponse(res, 500, false, 'Internal Server Error');
    }
};