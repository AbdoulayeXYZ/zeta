"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const cors_1 = __importDefault(require("cors"));
const workspace_route_1 = __importDefault(require("./routes/workspace.route"));
const patient_route_1 = __importDefault(require("./routes/patient.route"));
const mongodb_config_1 = __importDefault(require("./configs/mongodb.config"));
const detection_route_1 = __importDefault(require("./routes/detection.route"));
dotenv.config();
(0, mongodb_config_1.default)();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Use CORS to allow cross-origin requests from localhost:4200
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200'
}));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
// Routes
app.use(`/${process.env.API_PREFIX}/users`, user_route_1.default);
app.use("/api", workspace_route_1.default);
app.use("/api", patient_route_1.default);
app.use("/api", detection_route_1.default);
// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
