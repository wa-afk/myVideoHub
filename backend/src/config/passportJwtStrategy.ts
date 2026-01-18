import dotenv from 'dotenv';
import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import User from '../model/userSchema';
import { Request, RequestHandler } from 'express';
import { Types } from 'mongoose';

interface AuthenticatedUser extends Request{
    user: {
        _id: Types.ObjectId;
    }
};

export type AuthenticatedRequestHandler= RequestHandler<
    any,                   /*Type of dynamic parameter like user/:id*/
    any,                   /*Type of response body*/
    any,                   /*Type of request body*/
    any,                   /*Type of query parameter like user?search="abc*/
    AuthenticatedUser      /*Locals i.e. values appended in request*/
>;

dotenv.config();
const options: StrategyOptions= {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY as string,
};
passport.use(new Strategy(options, async (jwtPayload, done) => {               /*done middleware*/
    try {
        const user= await User.findById(jwtPayload._id).select("-password");   /*Dont send password*/
        if(!user){
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        console.error(`Error in jwt authentication ${error}`);
        return done(error);
    }
}));

export default passport;