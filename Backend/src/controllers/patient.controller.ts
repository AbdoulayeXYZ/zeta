import { Request, Response } from 'express';
import PatientService from '../services/patient.service';

class PatientController {
    async createPatient(req: Request, res: Response) {
        try {
            const patient = await PatientService.createPatient(req.body);
            res.status(201).json(patient);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async getPatients(req: Request, res: Response) {
        try {
            const patients = await PatientService.getPatients();
            res.status(200).json(patients);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async getPatientById(req: Request, res: Response) {
        try {
            const patient = await PatientService.getPatientById(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.status(200).json(patient);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async updatePatient(req: Request, res: Response) {
        try {
            const patient = await PatientService.updatePatient(req.params.id, req.body);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.status(200).json(patient);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async deletePatient(req: Request, res: Response) {
        try {
            const patient = await PatientService.deletePatient(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.status(200).json({ message: 'Patient deleted successfully' });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }
}

export default new PatientController();

