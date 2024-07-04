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
exports.getTrainerCount = exports.getUserCount = exports.getUsers = exports.deleteUser = exports.updateUserById = exports.getUserById = exports.login = exports.addTrainer = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const service = __importStar(require("../services/user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const role_util_1 = require("../utils/role.util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = __importDefault(require("../configs/jwt.config"));
const signup = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, type } = request.body;
        // Check if email already exists
        const existingUser = yield user_model_1.default.findOne({ email: email });
        if (existingUser) {
            return response.status(409).send('Email already in use');
        }
        const hash = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            fullName: fullName,
            email: email,
            password: hash,
            type: type,
        });
        // hehe boi
        const add = yield service.AddUser(newUser);
        response.status(201).json({
            message: `Successful registration ${add.fullName} OK.`
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Registration error"
        });
    }
});
exports.signup = signup;
const addTrainer = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = request.body;
        const hash = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            fullName: fullName,
            email: email,
            password: hash,
            type: role_util_1.ROLE.OWNER,
        });
        const user = yield service.signup(newUser);
        response.status(201).json({
            message: "Formateur ajouté avec succès"
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({
            message: "Trainer registration error"
        });
    }
});
exports.addTrainer = addTrainer;
const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email: loginEmail, password } = request.body;
        const authenticatedUser = yield service.login(loginEmail, password);
        if (!authenticatedUser) {
            return response.status(401).json({
                message: "Invalid email and/or password"
            });
        }
        const { _id, fullName, email, type } = authenticatedUser.user;
        return response.status(200).json({
            user: authenticatedUser.user,
            token: jsonwebtoken_1.default.sign({
                userId: _id,
                fullName,
                email,
                role: type
            }, jwt_config_1.default.jwt.secret, {
                expiresIn: '2h'
            })
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({
            message: error
        });
    }
});
exports.login = login;
// crud admin
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield service.findUserById(req.params['id']);
        res.json(user);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.getUserById = getUserById;
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield service.updateUserById(req.params['id'], req.body);
        res.json(updatedUser);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.updateUserById = updateUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield service.deleteUserById(req.params['id']);
        res.status(204).send();
        res.status(204).json({
            message: 'Utilisateur supprimer avec success'
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.deleteUser = deleteUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const User = yield service.findAllUsers();
        res.json(User);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getUsers = getUsers;
const getUserCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield user_model_1.default.countDocuments();
        res.json({ totalUsers: count });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getUserCount = getUserCount;
const getTrainerCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield user_model_1.default.countDocuments({ type: 'Formateur' });
        res.json({ totalTrainers: count });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getTrainerCount = getTrainerCount;
