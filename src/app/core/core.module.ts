import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from "../shared/shared.module";
import { BrowserModule } from '@angular/platform-browser';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturesComponent } from './components/features/features.component';
import { UnlockPremiumComponent } from './components/unlock-premium/unlock-premium.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { TeamComponent } from './components/team/team.component';
import { ContactComponent } from './components/contact/contact.component';



@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        HomeComponent,
        HeroSectionComponent,
        FeaturesComponent,
        UnlockPremiumComponent,
        TestimonialComponent,
        PricingComponent,
        TeamComponent,
        ContactComponent
    ],
    exports: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BrowserModule
    ]
})
export class CoreModule { }
