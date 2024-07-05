import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerComponent } from './owner.component';
import { SidebarownerComponent } from './sidebarowner/sidebarowner.component';
import { HeaderownerComponent } from './headerowner/headerowner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashownerComponent } from './components/dashowner/dashowner.component';
import { ManageuserComponent } from './components/manageuser/manageuser.component';


@NgModule({
  declarations: [
    OwnerComponent,
    SidebarownerComponent,
    HeaderownerComponent,
    DashownerComponent,
    ManageuserComponent,
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  exports: [
    SidebarownerComponent,
    HeaderownerComponent,
  ]
})
export class OwnerModule { }
