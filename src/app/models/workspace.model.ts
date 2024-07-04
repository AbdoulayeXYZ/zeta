export interface IWorkspace {
  _id?: string; // Add this line
  name: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  owner: string; // Assuming owner is referenced by ID as a string in the frontend
}
