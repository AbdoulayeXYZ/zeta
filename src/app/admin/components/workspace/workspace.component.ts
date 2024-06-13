import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from '../../../services/workspace.service';
import { IWorkspace } from '../../../models/workspace.model';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  workspaces: IWorkspace[] = [];

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.workspaceService.getAllWorkspaces().subscribe(
      (data: IWorkspace[]) => {
        this.workspaces = data;
      },
      (error: any) => {
        console.error('Error fetching workspaces', error);
      }
    );
  }
}