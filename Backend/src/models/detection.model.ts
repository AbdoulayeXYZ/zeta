import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";
import { IPatient } from "./patient.model";

export interface IDetection extends Document {
    patient: IPatient['_id'];
    specialist: IUser['_id'];
    image: string;
    detectionDate: Date;
}

const detectionSchema: Schema = new Schema({
    patient: { type: Schema.Types.ObjectId, ref: 'patients', required: true },
    specialist: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    image: { type: String, required: true },
    detectionDate: { type: Date, default: Date.now },
});

export default mongoose.model<IDetection>('detections', detectionSchema);
