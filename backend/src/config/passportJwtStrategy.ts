import dotenv from 'dotenv';
import passport from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import User from '../model/userSchema';

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