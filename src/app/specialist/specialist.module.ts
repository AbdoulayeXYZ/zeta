import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';

import { SpecialistRoutingModule } from './specialist-routing.module';
import { HeaderspecialistComponent } from './headerspecialist/headerspecialist.component';
import { SidebarspecialistComponent } from './sidebarspecialist/sidebarspecialist.component';
import { ManagePatientsComponent } from './components/manage-patients/manage-patients.component';
import { DetectionComponent } from './components/detection/detection.component';
import { SpecialistComponent } from './specialist.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { DashspecialistComponent } from './components/dashspecialist/dashspecialist.component';
import { ChatHistoryService } from '../services/chat-history.service';
import { OllamaService } from '../services/ollama.service';

@NgModule({
  declarations: [
    SpecialistComponent,
    HeaderspecialistComponent,
    SidebarspecialistComponent,
    ManagePatientsComponent,
    DetectionComponent,
    ChatbotComponent,
    DashspecialistComponent,
  ],
  imports: [
    CommonModule,
    SpecialistRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BaseChartDirective,
  ],
  providers: [
    ChatHistoryService,
    OllamaService
  ],
  exports: [
    SidebarspecialistComponent,
    HeaderspecialistComponent
  ]
})
export class SpecialistModule { }
