import express from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import passport from 'passport';

const router= express.Router();
router.use('/auth', authRoute);
router.use('/user', passport.authenticate('jwt', {session: false}), userRoute);
/*First checks user authentication status using passport jwt strategy then redirects to user route*/

export default router;