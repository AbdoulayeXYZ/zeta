import { Router } from "express";
import WorkspaceController from "../controllers/workspace.controller";

const router = Router();

router.post("/workspaces", WorkspaceController.createWorkspace);
router.get("/workspaces", WorkspaceController.getAllWorkspaces);
router.get("/workspaces/:id", WorkspaceController.getWorkspaceById);
router.put("/workspaces/:id", WorkspaceController.updateWorkspace);
router.delete("/workspaces/:id", WorkspaceController.deleteWorkspace);

export default router;
