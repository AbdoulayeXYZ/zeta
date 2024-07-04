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
exports.deleteUserById = exports.updateUserById = exports.findUserById = exports.findAllUsers = exports.createUser = exports.login = exports.AddUser = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const signup = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = new user_model_1.default(user);
    console.log(newUser);
    try {
        const savedUser = yield newUser.save();
        console.log(savedUser);
        return { success: true, message: savedUser };
    }
    catch (error) {
        const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
        return { success: false, message };
    }
});
exports.signup = signup;
const AddUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_model_1.default(userData);
    return user.save();
});
exports.AddUser = AddUser;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return { success: false, message: "User not found." };
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid password." };
        }
        return { success: true, message: "Login successful.", user };
    }
    catch (error) {
        const message = (error instanceof Error) ? error.message : 'An unknown error occurred';
        return { success: false, message };
    }
});
exports.login = login;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_model_1.default(userData);
    return user.save();
});
exports.createUser = createUser;
const findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.find();
});
exports.findAllUsers = findAllUsers;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findById(id);
});
exports.findUserById = findUserById;
const updateUserById = (id, UserData) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findByIdAndUpdate(id, UserData, { new: true });
});
exports.updateUserById = updateUserById;
const deleteUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.default.findByIdAndDelete(id);
});
exports.deleteUserById = deleteUserById;
