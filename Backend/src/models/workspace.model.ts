import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IWorkspace extends Document {
    name: string;
    phoneNumber: string;
    email: string;
    createdAt: Date;
    owner: IUser['_id'];
}

const workspaceSchema: Schema = new Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    owner: { type: Schema.Types.ObjectId, ref: 'users', required: true }
});

export default mongoose.model<IWorkspace>('workspaces', workspaceSchema);
