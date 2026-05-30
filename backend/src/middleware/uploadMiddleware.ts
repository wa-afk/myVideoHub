import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';
import { ClientSecretCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';
import { StorageEngine } from 'multer';
dotenv.config();

const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID as string,
    process.env.AZURE_CLIENT_ID as string,
    process.env.AZURE_CLIENT_SECRET as string
);
const blobClient = new BlobServiceClient(process.env.AZURE_STORAGE_ACCOUNT_URL as string, credential);
const container = blobClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER as string);

// Custom storage engine for streaming to Azure
class AzureBlobStorage implements StorageEngine {
    _handleFile(req: any, file: Express.Multer.File, cb: (error: Error | null, info?: any) => void) {
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);
        const filename = `${baseName}-${Date.now()}-${file.fieldname}${extension}`;
        const blobName = `my-video-hub/${filename}`;
        
        const blockBlob = container.getBlockBlobClient(blobName);
        blockBlob.uploadStream(file.stream, 4 * 1024 * 1024, 5, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
            metadata: { fieldname: file.fieldname }
        }).then(() => {
            cb(null, { url: blockBlob.url, blobName, size: file.size });
        }).catch(cb);
    }
    
    _removeFile(req: any, file: any, cb: (error: Error | null) => void) {
        cb(null);
    }
}

const multerMiddleware = multer({
    storage: new AzureBlobStorage(),
    limits: { fileSize: 500 * 1024 * 1024 }
}).fields([
    { name: "video", maxCount: 1},
    { name: "thumbnail", maxCount: 1}
]); 

const upload: RequestHandler = (req, res, next) => {
    multerMiddleware(req, res, async (err) => {
        try {
            if (err) return next(err);

            const uploadedFiles: Record<string, any> = {};
            for (const fieldName of Object.keys(req.files || {})) {
                const file = (req.files as any)[fieldName][0];
                uploadedFiles[fieldName] = {
                    key: file.url,
                    location: file.blobName,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size
                };
            }

            (req as any).uploadedFiles = uploadedFiles;
            next();
        } catch (error) {
            next(error);
        }
    });
};

export default upload;