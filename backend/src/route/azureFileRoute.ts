import express from 'express';
import upload from '../middleware/uploadMiddleware';
import { deleteGivenVideo, fetchSingleVideo, fetchVideos, updateVideo, uploadFile } from '../controller/azure/azureFileController';

const router = express.Router();
router.post('/upload-file', upload, uploadFile);
router.get('/fetch-videos', fetchVideos);
router.get('/fetch-single/video/:id', fetchSingleVideo);
router.delete('/delete-single/video/:id', deleteGivenVideo);
router.put("/update-video/:id", upload, updateVideo);

export default router;