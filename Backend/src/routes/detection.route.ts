import { Router } from 'express';
import multer from 'multer';
import { createDetection, getDetections } from '../controllers/detection.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/detections', upload.single('image'), createDetection);
router.get('/detections', getDetections);

// Add other necessary routes like getDetectionById, updateDetection, deleteDetection

export default router;
