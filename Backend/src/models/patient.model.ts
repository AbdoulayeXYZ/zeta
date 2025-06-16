import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IPatient extends Document {
    fullName: string;
    age: number;
    sexe: string;
    createdAt: Date;
    specialist: IUser['_id'];
}

const patientSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    sexe: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    specialist: { type: Schema.Types.ObjectId, ref: 'users', required: true }
});

export default mongoose.model<IPatient>('patients', patientSchema);
