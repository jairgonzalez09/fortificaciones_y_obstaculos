import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from '../utils/index.js';

const storage = multer.diskStorage({
    destination: 'uploads/images',
    filename: (_, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const uploadStepperFiles = multer({
    storage,
    limits: { fileSize: 70 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new AppError('Solo se permiten archivos de imagen', 400));
            return;
        }
        cb(null, true);
    }
}).fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'stepImages', maxCount: 15 }
]);

export { uploadStepperFiles };