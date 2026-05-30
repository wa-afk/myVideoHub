import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { uploadFile } from '../controller/azure/azureFileController';

const router = express.Router();
router.post('/upload-file', upload, uploadFile);

export default router;