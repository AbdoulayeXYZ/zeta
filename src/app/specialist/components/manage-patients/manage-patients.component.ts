import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { DetectionService } from '../../../services/detection.service';
import { IPatient } from '../../../models/patient.model';
import { IDetection } from '../../../models/detection.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-manage-patients',
    templateUrl: './manage-patients.component.html',
    styleUrls: ['./manage-patients.component.css'],
    standalone: false
})
export class ManagePatientsComponent implements OnInit {
  patients: IPatient[] = [];
  selectedPatient: IPatient | null = null;
  selectedPatientForDelete: IPatient | null = null;
  selectedPatientForHistory: IPatient | null = null;
  showCreateForm: boolean = false;
  showDeleteConfirmation: boolean = false;
  showDetectionHistory: boolean = false;
  patientDetections: IDetection[] = [];
  selectedDetection: IDetection | null = null;
  newPatient: IPatient = {
    _id: '',
    fullName: '',
    age: 0,
    sexe: '',
    createdAt: new Date(),
    specialist: ''
  };
  showUploadPopup: boolean = false;
  detectionResult: string = '';
  selectedFile: File | null = null;
  showDetectionConfirmation: boolean = false; // AJOUTE POUR GERER ÇA

  constructor(private patientService: PatientService, private detectionService: DetectionService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getPatients();
  }

  getPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => this.patients = data,
      (error) => console.error(error)
    );
  }

  getPatientById(id: string): void {
    this.patientService.getPatientById(id).subscribe(
      (data) => this.selectedPatient = data,
      (error) => console.error(error)
    );
  }

  createPatient(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser._id) {
      console.error('Current user information is missing');
      return;
    }

    const newPatientData: Partial<IPatient> = {
      fullName: this.newPatient.fullName,
      age: this.newPatient.age,
      sexe: this.newPatient.sexe,
      specialist: currentUser._id
    };

    this.patientService.createPatient(newPatientData).subscribe(
      (data) => {
        this.patients.push(data);
        this.newPatient = {
          _id: '',
          fullName: '',
          age: 0,
          sexe: '',
          createdAt: new Date(),
          specialist: ''
        };
      },
      (error) => {
        console.error('Error creating patient:', error);
        console.log('Attempted to create patient with data:', newPatientData);
      }
    );
  }

  updatePatient(): void {
    if (this.selectedPatient) {
      this.patientService.updatePatient(this.selectedPatient._id, this.selectedPatient).subscribe(
        (data) => {
          const index = this.patients.findIndex(p => p._id === data._id);
          if (index !== -1) {
            this.patients[index] = data;
          }
          this.selectedPatient = null;
        },
        (error) => console.error(error)
      );
    }
  }

  deletePatient(id: string): void {
    this.patientService.deletePatient(id).subscribe(
      () => this.patients = this.patients.filter(p => p._id !== id),
      (error) => console.error(error)
    );
  }

  selectPatient(patient: IPatient): void {
    this.selectedPatient = { ...patient };
  }

  clearSelection(): void {
    this.selectedPatient = null;
  }

  openDetectionPopup(patient: IPatient): void {
    this.selectedPatient = patient;
    this.showUploadPopup = true;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createDetection(patientId: string, specialistId: string, image: File | null): void {
    if (!image) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('patient', patientId);
    formData.append('specialist', specialistId);
    formData.append('image', image);
    formData.append('result', this.detectionResult);

    this.detectionService.createDetection(formData).subscribe(
      (data) => {
        console.log('Detection created:', data);
        this.showUploadPopup = false;
      },
      (error) => console.error('Error creating detection:', error)
    );
  }

  viewPatientDetections(patient: IPatient): void {
    this.selectedPatientForHistory = patient;
    this.showDetectionHistory = true;
    this.loadPatientDetections(patient._id);
  }

  closeDetectionHistory(): void {
    this.showDetectionHistory = false;
    this.selectedPatientForHistory = null;
    this.patientDetections = [];
    this.selectedDetection = null;
  }

  loadPatientDetections(patientId: string): void {
    this.detectionService.getDetectionsByPatient(patientId).subscribe(
      (detections) => {
        this.patientDetections = detections;
        // Sort detections by date, most recent first
        this.patientDetections.sort((a, b) => 
          new Date(b.detectionDate).getTime() - new Date(a.detectionDate).getTime()
        );
      },
      (error) => {
        console.error('Error loading patient detections:', error);
        // You might want to show an error message to the user here
      }
    );
  }

  viewDetectionDetails(detection: IDetection): void {
    this.selectedDetection = detection;
  }

  getSpecialistName(specialist: User | string | null): string {
    if (specialist && typeof specialist === 'object' && 'fullName' in specialist) {
      return specialist.fullName;
    }
    return 'Unknown';
  }
}
