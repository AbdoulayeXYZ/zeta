export interface IPatient {
    _id: string;
    fullName: string;
    age: number;
    sexe: string;
    createdAt: Date;
    specialist: string; // IUser['_id']
}