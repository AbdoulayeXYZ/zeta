import { NavbarComponent } from './../core/components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TableAdminzetaComponent } from './components/table-adminzeta/table-adminzeta.component';
import { TableOwnerComponent } from './components/table-owner/table-owner.component';
import { TableSpecialistComponent } from './components/table-specialist/table-specialist.component';
import { TableUserComponent } from './components/table-user/table-user.component';
import { ModelComponent } from './components/model/model.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { InfomodelComponent } from './components/infomodel/infomodel.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeadernavComponent } from './headernav/headernav.component';
import { StatsheaderComponent } from './components/statsheader/statsheader.component';
import { TabNavComponent } from './components/tab-nav/tab-nav.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    TableAdminzetaComponent,
    TableOwnerComponent,
    TableSpecialistComponent,
    TableUserComponent,
    ModelComponent,
    ManageUsersComponent,
    WorkspaceComponent,
    DatasetComponent,
    InfomodelComponent,
    DashboardComponent,
    HeadernavComponent,
    StatsheaderComponent,
    TabNavComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  exports: [
    SidebarComponent,
    HeadernavComponent
  ]
})
export class AdminModule { }
