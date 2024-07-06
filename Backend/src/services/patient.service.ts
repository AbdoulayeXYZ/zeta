import Patient, { IPatient } from '../models/patient.model';

class PatientService {
    async createPatient(data: Partial<IPatient>) {
        try {
            return await Patient.create(data);
        } catch (error) {
            console.error('Error in createPatient service:', error); // Log the error
            throw error;
        }
    }

    async getPatients() {
        return await Patient.find().populate('specialist workspace');
    }

    async getPatientById(id: string) {
        return await Patient.findById(id).populate('specialist workspace');
    }

    async updatePatient(id: string, data: Partial<IPatient>) {
        return await Patient.findByIdAndUpdate(id, data, { new: true });
    }

    async deletePatient(id: string) {
        return await Patient.findByIdAndDelete(id);
    }
}

export default new PatientService();
