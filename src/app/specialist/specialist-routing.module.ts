import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialistComponent } from './specialist.component';
import { DashspecialistComponent } from './components/dashspecialist/dashspecialist.component';
import { ManagePatientsComponent } from './components/manage-patients/manage-patients.component';
import { DetectionComponent } from './components/detection/detection.component';

const routes: Routes = [
  {
    path:'',
    component: SpecialistComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashspecialist',
        pathMatch: 'full',
      },
      {
        path: 'dashspecialist',
        component: DashspecialistComponent, 
      },
      {
        path:'manage-patients',
        component: ManagePatientsComponent,
      },
      {
        path: 'detection',
        component: DetectionComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialistRoutingModule { }
