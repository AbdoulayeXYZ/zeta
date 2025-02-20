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
exports.getDetections = exports.createDetection = void 0;
const detection_model_1 = __importDefault(require("../models/detection.model"));
const createDetection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { patient, specialist, result } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
        // Log the received data
        console.log('Received data:', { patient, specialist, result, image });
        if (!patient || !specialist || !image) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const detection = new detection_model_1.default({ patient, specialist, image, result });
        yield detection.save();
        res.status(201).json(detection);
    }
    catch (error) {
        console.error('Error creating detection:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.createDetection = createDetection;
const getDetections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detections = yield detection_model_1.default.find().populate('patient specialist');
        res.status(200).json(detections);
    }
    catch (error) {
        console.error('Error fetching detections:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.getDetections = getDetections;
