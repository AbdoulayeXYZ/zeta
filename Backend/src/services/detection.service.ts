import Detection from '../models/detection.model';

export const createDetection = async (data: any) => {
    const detection = new Detection(data);
    return await detection.save();
};

export const getDetections = async () => {
    return await Detection.find().populate('patient specialist');
};

// Add other necessary methods like getDetectionById, updateDetection, deleteDetection
