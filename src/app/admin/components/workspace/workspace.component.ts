import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkspaceService } from '../../../services/workspace.service';
import { IWorkspace } from '../../../models/workspace.model';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {
  workspaces: IWorkspace[] = [];
  addWorkspaceForm!: FormGroup;
  selectedWorkspace: IWorkspace | null = null;
  showForm: boolean = false;

  constructor(private fb: FormBuilder, private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.addWorkspaceForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      owner: ['', Validators.required],
      createdAt: [new Date(), Validators.required] // Added createdAt
    });
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.workspaceService.getAllWorkspaces().subscribe(
      (data: IWorkspace[]) => {
        this.workspaces = data;
      },
      (error: any) => {
        console.error('Error fetching workspaces', error);
        if (error.status === 0) {
          console.error('Network error - make sure the backend server is running.');
        } else {
          console.error(`Backend returned code ${error.status}, body was: ${error.message}`);
        }
      }
    );
  }

  saveWorkspace(): void {
    if (this.addWorkspaceForm.valid) {
      if (this.selectedWorkspace && this.selectedWorkspace._id !== undefined) {
        // Update existing workspace
        const updatedWorkspace = { ...this.addWorkspaceForm.value, _id: this.selectedWorkspace._id };
        const workspaceId = typeof this.selectedWorkspace._id === 'string' ? parseInt(this.selectedWorkspace._id, 10) : this.selectedWorkspace._id;
        this.workspaceService.updateWorkspace(workspaceId, updatedWorkspace).subscribe({
          next: () => {
            this.loadWorkspaces();
            this.resetForm();
          },
          error: (error) => console.error('Failed to update workspace', error)
        });
      } else {
        // Create new workspace
        this.workspaceService.createWorkspace(this.addWorkspaceForm.value).subscribe({
          next: () => {
            this.loadWorkspaces();
            this.resetForm();
          },
          error: (error) => console.error('Failed to create workspace', error)
        });
      }
    }
  }

  editWorkspace(workspace: IWorkspace): void {
    this.selectedWorkspace = workspace;
    this.addWorkspaceForm.patchValue({
      name: workspace.name,
      email: workspace.email,
      phoneNumber: workspace.phoneNumber,
      owner: workspace.owner,
      createdAt: new Date(workspace.createdAt) // Conversion de string en Date
    });
    this.showForm = true;
  }

  deleteWorkspace(id: string | number): void {
    const workspaceId = typeof id === 'string' ? parseInt(id, 10) : id;
    this.workspaceService.deleteWorkspace(workspaceId).subscribe({
      next: () => {
        this.loadWorkspaces();
      },
      error: (error) => console.error('Failed to delete workspace', error)
    });
  }

  resetForm(): void {
    this.addWorkspaceForm.reset();
    this.selectedWorkspace = null;
    this.showForm = false;
  }
}