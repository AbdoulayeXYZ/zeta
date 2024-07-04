"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspace_controller_1 = __importDefault(require("../controllers/workspace.controller"));
const router = (0, express_1.Router)();
router.post("/workspaces", workspace_controller_1.default.createWorkspace);
router.get("/workspaces", workspace_controller_1.default.getAllWorkspaces);
router.get("/workspaces/:id", workspace_controller_1.default.getWorkspaceById);
router.put("/workspaces/:id", workspace_controller_1.default.updateWorkspace);
router.delete("/workspaces/:id", workspace_controller_1.default.deleteWorkspace);
exports.default = router;
