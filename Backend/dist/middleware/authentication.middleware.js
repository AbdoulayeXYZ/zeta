"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = __importDefault(require("../configs/jwt.config"));
const authenticateToken = (request, response, next) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return response.status(401).json({
                message: "No authentication token provided"
            });
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            return response.status(401).json({
                message: "Invalid authentication token"
            });
        }
        const jwtPayload = jsonwebtoken_1.default.verify(token, jwt_config_1.default.jwt.secret);
        request.token = jwtPayload;
        next();
    }
    catch (error) {
        response.status(403).json({
            message: error
        });
    }
};
exports.authenticateToken = authenticateToken;
