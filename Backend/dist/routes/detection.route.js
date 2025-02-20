"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const detection_controller_1 = require("../controllers/detection.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/detections', upload.single('image'), detection_controller_1.createDetection);
router.get('/detections', detection_controller_1.getDetections);
// Add other necessary routes like getDetectionById, updateDetection, deleteDetection
exports.default = router;
