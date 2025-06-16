import { Request, Response } from 'express';
import Detection from '../models/detection.model';

export const createDetection = async (req: Request, res: Response) => {
    try {
        const { patient, specialist, confidence, overlap, classes } = req.body;
        let image: string | undefined = undefined;
        if (req.file) {
            const localPath = req.file.path.replace(/\\/g, '/'); // Windows fix
            image = localPath.startsWith('uploads/') ? `/${localPath}` : localPath;
        } else {
            console.warn('Aucune image reçue dans req.file');
        }
        let jsonResult = req.body.result;
        if (typeof jsonResult === 'string') {
            try {
                jsonResult = JSON.parse(jsonResult);
            } catch (e) {
                // fallback: keep as string if not valid JSON
            }
        }

        if (!patient || !specialist || !image || !jsonResult) {
            return res.status(400).json({ error: 'All required fields are missing' });
        }

        const detection = new Detection({
            patient,
            specialist,
            image,
            results: {
                confidence: Number(confidence) || 50,
                overlap: Number(overlap) || 50,
                classes: classes ? (Array.isArray(classes) ? classes : classes.split(',').map((c: string) => c.trim())) : [],
                jsonResult,
                imageResult: req.body.imageResult
            }
        });

        await detection.save();
        res.status(201).json(detection);
    } catch (error) {
        console.error('Error creating detection:', error as Error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getDetections = async (req: Request, res: Response) => {
    try {
        const detections = await Detection.find()
            .populate('patient', 'fullName age sexe')
            .populate('specialist', 'fullName email')
            .sort({ detectionDate: -1 });
        res.status(200).json(detections);
    } catch (error) {
        console.error('Error fetching detections:', error as Error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getDetectionsByPatient = async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;
        const detections = await Detection.find({ patient: patientId })
            .populate('patient', 'fullName age sexe')
            .populate('specialist', 'fullName email')
            .sort({ detectionDate: -1 });
        res.status(200).json(detections);
    } catch (error) {
        console.error('Error fetching patient detections:', error as Error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getDetectionById = async (req: Request, res: Response) => {
    try {
        const detection = await Detection.findById(req.params.id)
            .populate('patient', 'fullName age sexe')
            .populate('specialist', 'fullName email');
        
        if (!detection) {
            return res.status(404).json({ error: 'Detection not found' });
        }
        
        res.status(200).json(detection);
    } catch (error) {
        console.error('Error fetching detection:', error as Error);
        res.status(500).json({ error: (error as Error).message });
    }
};
