import express from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/upload.controller.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('file'), uploadController.uploadFile);
router.delete('/', uploadController.deleteFile);

export default router;
