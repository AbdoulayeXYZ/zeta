import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Modules import */
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AppDashboardNavbar } from './dashboard/dashboard/navbar/navbar.component';
import { DashboardModule } from './dashboard/dashboard/dashboard.module';
import { StatsheaderComponent } from './dashboard/dashboard/statsheader/statsheader.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    DashboardModule,
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
