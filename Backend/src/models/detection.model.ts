import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";
import { IPatient } from "./patient.model";

export interface IDetection extends Document {
    patient: IPatient['_id'];
    specialist: IUser['_id'];
    image: string;
    detectionDate: Date;
    results: {
        confidence: number;
        overlap: number;
        classes: string[];
        jsonResult: any;
        imageResult?: string;
    };
}

const detectionSchema: Schema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'patients', required: true },
    specialist: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    image: { type: String, required: true },
    detectionDate: { type: Date, default: Date.now },
    results: {
        confidence: { type: Number, required: true },
        overlap: { type: Number, required: true },
        classes: [{ type: String }],
        jsonResult: { type: Schema.Types.Mixed, required: true },
        imageResult: { type: String }
    }
});

export default mongoose.model<IDetection>('detections', detectionSchema);
