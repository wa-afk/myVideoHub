import { transporter } from "../config/nodemailer";
import { IUser } from "../model/userSchema";
import dotenv from 'dotenv';
import path from 'path';
import ejs from 'ejs';

dotenv.config();
export const resetPasswordEmail= async(user: IUser) => {
    try {
        // __dirname for current directory
        // token value passed to ejs file as url variable
        const emailHtml= await ejs.renderFile(path.join(__dirname, "../view/resetPassword.ejs"), { token: user.token });
        const options= {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Reset your password",
            html: emailHtml
        };
        await transporter.sendMail(options);
    } catch (error) {
        console.error(`Error in sending reset password email ${error}`);
    }
};