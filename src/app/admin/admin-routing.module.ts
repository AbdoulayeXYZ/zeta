import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ModelComponent } from './components/model/model.component';
import { DatasetComponent } from './components/dataset/dataset.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent, 
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent,
      },
      {
        path: 'workspace',
        component: WorkspaceComponent,
      },
      {
        path: 'model',
        component: ModelComponent,
      },
      {
        path: 'dataset',
        component: DatasetComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }