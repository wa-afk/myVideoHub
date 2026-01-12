import express from 'express';
import { signUpUser } from '../controller/authController';

const router= express.Router();
router.post('/sign-up', signUpUser);

export default router;