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
const patient_model_1 = __importDefault(require("../models/patient.model"));
class PatientService {
    createPatient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield patient_model_1.default.create(data);
            }
            catch (error) {
                console.error('Error in createPatient service:', error); // Log the error
                throw error;
            }
        });
    }
    getPatients() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.find().populate('specialist workspace');
        });
    }
    getPatientById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findById(id).populate('specialist workspace');
        });
    }
    updatePatient(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findByIdAndUpdate(id, data, { new: true });
        });
    }
    deletePatient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield patient_model_1.default.findByIdAndDelete(id);
        });
    }
}
exports.default = new PatientService();
