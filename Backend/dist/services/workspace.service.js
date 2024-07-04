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
const workspace_model_1 = __importDefault(require("../models/workspace.model"));
class WorkspaceService {
    createWorkspace(workspaceData) {
        return __awaiter(this, void 0, void 0, function* () {
            const workspace = new workspace_model_1.default(workspaceData);
            return yield workspace.save();
        });
    }
    getAllWorkspaces() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield workspace_model_1.default.find().populate('owner').exec();
        });
    }
    getWorkspaceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield workspace_model_1.default.findOne({ id }).populate('owner').exec();
        });
    }
    updateWorkspace(id, workspaceData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield workspace_model_1.default.findOneAndUpdate({ id }, workspaceData, { new: true }).populate('owner').exec();
        });
    }
    deleteWorkspace(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield workspace_model_1.default.findOneAndDelete({ id }).exec();
        });
    }
}
exports.default = new WorkspaceService();
