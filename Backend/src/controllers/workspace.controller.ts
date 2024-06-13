import { Request, Response } from "express";
import WorkspaceService from "../services/workspace.service";

class WorkspaceController {
    async createWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const workspace = await WorkspaceService.createWorkspace(req.body);
            res.status(201).json(workspace);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async getAllWorkspaces(req: Request, res: Response): Promise<void> {
        try {
            const workspaces = await WorkspaceService.getAllWorkspaces();
            res.status(200).json(workspaces);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async getWorkspaceById(req: Request, res: Response): Promise<void> {
        try {
            const workspace = await WorkspaceService.getWorkspaceById(Number(req.params.id));
            if (workspace) {
                res.status(200).json(workspace);
            } else {
                res.status(404).json({ message: "Workspace not found" });
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async updateWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const workspace = await WorkspaceService.updateWorkspace(Number(req.params.id), req.body);
            if (workspace) {
                res.status(200).json(workspace);
            } else {
                res.status(404).json({ message: "Workspace not found" });
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }

    async deleteWorkspace(req: Request, res: Response): Promise<void> {
        try {
            const workspace = await WorkspaceService.deleteWorkspace(Number(req.params.id));
            if (workspace) {
                res.status(200).json({ message: "Workspace deleted successfully" });
            } else {
                res.status(404).json({ message: "Workspace not found" });
            }
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ error: err.message });
        }
    }
}

export default new WorkspaceController();
