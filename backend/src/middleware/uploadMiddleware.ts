import multer from 'multer';
import path from 'path';
import { StorageEngine } from 'multer';
import { container } from '../config/azure';

// Custom storage engine for streaming to Azure
class AzureBlobStorage implements StorageEngine {
    _handleFile(req: any, file: Express.Multer.File, cb: (error: Error | null, info?: any) => void) {
        if (!req.files) req.files = {};
        if (!req.files.video) req.files.video = [];
        if (!req.files.thumbnail) req.files.thumbnail = [];

        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);
        const filename = `${baseName}-${Date.now()}-${file.fieldname}${extension}`;
        const blobName = `my-video-hub/${filename}`;
        
        const blockBlob = container.getBlockBlobClient(blobName);
        blockBlob.uploadStream(file.stream, 4 * 1024 * 1024, 5, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
            metadata: { fieldname: file.fieldname }
        }).then(() => {
            cb(null, { key: blobName, location: blockBlob.url, size: file.size });
        }).catch(cb);
    }
    
    _removeFile(req: any, file: any, cb: (error: Error | null) => void) {
        cb(null);
    }
}

const upload = multer({
    storage: new AzureBlobStorage(),
    limits: { fileSize: 500 * 1024 * 1024 }
}).fields([
    { name: "video", maxCount: 1},
    { name: "thumbnail", maxCount: 1}
]); 

export default upload;