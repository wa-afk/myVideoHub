import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { deleteGivenVideo, fetchVideosForLoggedInUser, updateVideo, uploadFile } from '../controller/azure/azureFileController';

const router = express.Router();
router.get('/fetch-videos', fetchVideosForLoggedInUser);
router.post('/upload-file', upload, uploadFile);
router.delete('/delete-single/video/:id', deleteGivenVideo);
router.put("/update-video/:id", upload, updateVideo);

export default router;