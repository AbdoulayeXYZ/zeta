import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { SignupComponent } from './core/components/signup/signup.component';
import { HomeComponent } from './core/components/home/home.component';
import { TeamComponent } from './core/components/team/team.component';
import { FeaturesComponent } from './core/components/features/features.component';
import { ContactComponent } from './core/components/contact/contact.component';
import { PricingComponent } from './core/components/pricing/pricing.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { isOwnerGuard } from './guards/is-owner.guard';
import { isSpecialistGuard } from './guards/is-specialist.guard';

const routes: Routes = [
  {
    path: 'owner',
    loadChildren: () => import('./owner/owner-routing.module').then(m => m.OwnerRoutingModule),
    // canActivate: [isOwnerGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
    // canActivate: [isAdminGuard]
  },
  {
    path: 'specialist',
    loadChildren: () => import('./specialist/specialist-routing.module').then(m => m.SpecialistRoutingModule),
    // canActivate: [isSpecialistGuard]
  },
  { path: 'portal',
    loadChildren: () =>
    import('./portal/portal.module').then(m => m.PortalModule),
    data: { preload: false },
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'team',
    component: TeamComponent
  },
  {
    path: 'feature',
    component: FeaturesComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
