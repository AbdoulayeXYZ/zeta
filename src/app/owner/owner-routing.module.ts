import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashownerComponent } from './components/dashowner/dashowner.component';
import { ManageuserComponent } from './components/manageuser/manageuser.component';
import { OwnerComponent } from './owner.component';

const routes: Routes = [
  {
    path:'',
    component: OwnerComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashowner',
        pathMatch: 'full',
      },
      {
        path: 'dashowner',
        component: DashownerComponent, 
      },
      {
        path:'manageuser',
        component: ManageuserComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }

