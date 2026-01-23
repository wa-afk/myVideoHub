import express from 'express';
import { signUpUser, signInUser, sendResetPasswordEmail, updatePassword } from '../controller/auth/authController';

const router= express.Router();
router.post('/sign-up', signUpUser);
router.post('/sign-in', signInUser);
router.post('/reset-password', sendResetPasswordEmail);
router.patch('/update-password/:token', updatePassword);        //token is dynamic parameter (dynamic route)

export default router;