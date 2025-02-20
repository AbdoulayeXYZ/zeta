"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patient_service_1 = __importDefault(require("../services/patient.service"));
class PatientController {
    createPatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield patient_service_1.default.createPatient(req.body);
                res.status(201).json(patient);
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    getPatients(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patients = yield patient_service_1.default.getPatients();
                res.status(200).json(patients);
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    getPatientById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield patient_service_1.default.getPatientById(req.params.id);
                if (!patient) {
                    return res.status(404).json({ message: 'Patient not found' });
                }
                res.status(200).json(patient);
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    updatePatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield patient_service_1.default.updatePatient(req.params.id, req.body);
                if (!patient) {
                    return res.status(404).json({ message: 'Patient not found' });
                }
                res.status(200).json(patient);
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    deletePatient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const patient = yield patient_service_1.default.deletePatient(req.params.id);
                if (!patient) {
                    return res.status(404).json({ message: 'Patient not found' });
                }
                res.status(200).json({ message: 'Patient deleted successfully' });
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.default = new PatientController();
