import Workspace from "../models/workspace.model";
import { IWorkspace } from "../models/workspace.model";

class WorkspaceService {
    async createWorkspace(workspaceData: IWorkspace): Promise<IWorkspace> {
        const workspace = new Workspace(workspaceData);
        return await workspace.save();
    }

    async getAllWorkspaces(): Promise<IWorkspace[]> {
        return await Workspace.find().populate('owner').exec();
    }

    async getWorkspaceById(id: number): Promise<IWorkspace | null> {
        return await Workspace.findOne({ id }).populate('owner').exec();
    }

    async updateWorkspace(id: number, workspaceData: Partial<IWorkspace>): Promise<IWorkspace | null> {
        return await Workspace.findOneAndUpdate({ id }, workspaceData, { new: true }).populate('owner').exec();
    }

    async deleteWorkspace(id: number): Promise<IWorkspace | null> {
        return await Workspace.findOneAndDelete({ id }).exec();
    }
}

export default new WorkspaceService();
