import { Request, Response } from 'express';
import Detection from '../models/detection.model';

export const createDetection = async (req: Request, res: Response) => {
    try {
        const { patient, specialist, result } = req.body;
        const image = req.file?.path;

        // Log the received data
        console.log('Received data:', { patient, specialist, result, image });

        if (!patient || !specialist || !image ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const detection = new Detection({ patient, specialist, image, result });
        await detection.save();
        res.status(201).json(detection);
    } catch (error) {
        console.error('Error creating detection:', error as Error);
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getDetections = async (req: Request, res: Response) => {
    try {
        const detections = await Detection.find().populate('patient specialist');
        res.status(200).json(detections);
    } catch (error) {
        console.error('Error fetching detections:', error as Error);
        res.status(500).json({ error: (error as Error).message });
    }
};
