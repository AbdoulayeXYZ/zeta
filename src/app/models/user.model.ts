import { IUser } from '../../../Backend/src/models/user.model';
import { OwnerComponent } from './../owner/owner.component';
export class User {
    _id?: string;
    fullName: string = '';
    email: string = '';
    password: string = '';
    type: string = '';
    speciality: string = '';
    ownerID: IUser[] = [];
}