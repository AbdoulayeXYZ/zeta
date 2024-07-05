import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpecialistRoutingModule } from './specialist-routing.module';
import { HeaderspecialistComponent } from './headerspecialist/headerspecialist.component';
import { SidebarspecialistComponent } from './sidebarspecialist/sidebarspecialist.component';
import { ManagePatientsComponent } from './components/manage-patients/manage-patients.component';
import { DetectionComponent } from './components/detection/detection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpecialistComponent } from './specialist.component';


@NgModule({
  declarations: [
    SpecialistComponent,
    HeaderspecialistComponent,
    SidebarspecialistComponent,
    ManagePatientsComponent,
    DetectionComponent,
  ],
  imports: [
    CommonModule,
    SpecialistRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

  ],
  exports: [
    SidebarspecialistComponent,
    HeaderspecialistComponent
  ]
})
export class SpecialistModule { }
