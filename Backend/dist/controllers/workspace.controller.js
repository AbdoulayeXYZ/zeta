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
const workspace_service_1 = __importDefault(require("../services/workspace.service"));
class WorkspaceController {
    createWorkspace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workspace = yield workspace_service_1.default.createWorkspace(req.body);
                res.status(201).json(workspace);
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    getAllWorkspaces(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workspaces = yield workspace_service_1.default.getAllWorkspaces();
                res.status(200).json(workspaces);
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    getWorkspaceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workspace = yield workspace_service_1.default.getWorkspaceById(Number(req.params.id));
                if (workspace) {
                    res.status(200).json(workspace);
                }
                else {
                    res.status(404).json({ message: "Workspace not found" });
                }
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    updateWorkspace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workspace = yield workspace_service_1.default.updateWorkspace(Number(req.params.id), req.body);
                if (workspace) {
                    res.status(200).json(workspace);
                }
                else {
                    res.status(404).json({ message: "Workspace not found" });
                }
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
    deleteWorkspace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workspace = yield workspace_service_1.default.deleteWorkspace(Number(req.params.id));
                if (workspace) {
                    res.status(200).json({ message: "Workspace deleted successfully" });
                }
                else {
                    res.status(404).json({ message: "Workspace not found" });
                }
            }
            catch (error) {
                const err = error;
                res.status(500).json({ error: err.message });
            }
        });
    }
}
exports.default = new WorkspaceController();
