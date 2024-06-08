import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import the DashboardComponent
import { UsersComponent } from './users/users.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ModelComponent } from './model/model.component';
import { DatasetComponent } from './dataset/dataset.component';

// Define the routing configuration for the Dashboard module
const routes: Routes = [
  {
    path: '', // The base path for the dashboard
    component: DashboardComponent, // The component to load when the path matches
    children: [
      // Additional child routes can be added here
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'workspace',
        component: WorkspaceComponent
      },
      {
        path: 'model',
        component: ModelComponent
      },
      {
        path: 'dataset',
        component: DatasetComponent
      }
    ]
  }
];

// Decorate the class with NgModule to define this as an Angular module
@NgModule({
  imports: [RouterModule.forChild(routes)], // Import the RouterModule and register the routes as child routes
  exports: [RouterModule] // Export RouterModule to make it available throughout the application
})
export class DashboardRoutingModule { } // Define and export the routing module class
