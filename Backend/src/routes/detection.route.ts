import { Router } from 'express';
import multer from 'multer';
import { 
    createDetection, 
    getDetections, 
    getDetectionsByPatient,
    getDetectionById 
} from '../controllers/detection.controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/detections', upload.single('image'), createDetection);
router.get('/detections', getDetections);
router.get('/detections/patient/:patientId', getDetectionsByPatient);
router.get('/detections/:id', getDetectionById);

// Add other necessary routes like getDetectionById, updateDetection, deleteDetection

export default router;
