import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import { ROLE } from "../utils/role.util";

export interface IUser extends Document {
    id: { type: Number, default: 0, unique: true },
    fullName: string; 
    email: string;
    password: string;
    type: string;
    speciality: string;
    ownerID: IUser[];
    workspace?: mongoose.Types.ObjectId; // Optional workspace reference
}

const userSchema: Schema = new Schema({
    fullName: {type: String, required: true}, 
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    type: {type: String, enum: [ROLE.ADMIN, ROLE.OWNER, ROLE.SPECIALIST], required: true},
    speciality: {type: String},
    ownerID: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    workspace: { type: Schema.Types.ObjectId, ref: 'workspaces' } // Reference to workspace
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>('users', userSchema);