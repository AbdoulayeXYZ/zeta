import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { SignupComponent } from './core/components/signup/signup.component';
import { HomeComponent } from './core/components/home/home.component';
import { TeamComponent } from './core/components/team/team.component';
import { FeaturesComponent } from './core/components/features/features.component';
import { ContactComponent } from './core/components/contact/contact.component';
import { PricingComponent } from './core/components/pricing/pricing.component';

const routes: Routes = [
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
