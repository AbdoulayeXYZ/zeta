"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patient_controller_1 = __importDefault(require("../controllers/patient.controller"));
const router = (0, express_1.Router)();
router.post('/patients', patient_controller_1.default.createPatient);
router.get('/patients', patient_controller_1.default.getPatients);
router.get('/patients/:id', patient_controller_1.default.getPatientById);
router.put('/patients/:id', patient_controller_1.default.updatePatient);
router.delete('/patients/:id', patient_controller_1.default.deletePatient);
exports.default = router;
