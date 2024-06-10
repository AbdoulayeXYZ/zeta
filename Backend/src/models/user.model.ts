import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import { ROLE } from "../utils/role.util";

export interface IUser extends Document {
    id: { type: Number, default: 0, unique: true },
    fullName: string; 
    email: string;
    password: string;
    type: string;
}

const userSchema: Schema = new Schema({
    fullName: {type: String, required: true}, 
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    type: {type: String, enum: [ROLE.ADMIN, ROLE.OWNER, ROLE.SPECIALIST], required: true},
});

userSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>('users', userSchema);