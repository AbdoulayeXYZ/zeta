import { User } from './user.model';

export interface IDetection {
    _id: string;
    patient: string;
    specialist: User | string;  // Can be either the full user object or just the ID
    image: string | null;
    detectionDate: Date;
    results: {
        confidence: number;
        overlap: number;
        classes: string[];
        jsonResult: any;
        imageResult?: string;
    };
    showJson?: boolean;  // UI state property
}