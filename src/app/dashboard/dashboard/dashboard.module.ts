import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainContentComponent } from './main-content/main-content.component';
import { AppDashboardNavbar } from './navbar/navbar.component';
import { StatsheaderComponent } from './statsheader/statsheader.component';
import { InfomodelComponent } from './infomodel/infomodel.component';
import { UsersComponent } from './users/users.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ModelComponent } from './model/model.component';
import { DatasetComponent } from './dataset/dataset.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    AppDashboardNavbar,
    MainContentComponent,
    StatsheaderComponent,
    InfomodelComponent,
    UsersComponent,
    WorkspaceComponent,
    ModelComponent,
    DatasetComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
  ],
  exports: [
    AppDashboardNavbar,
  ]
})
export class DashboardModule { }

