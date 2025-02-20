import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { DetectionService } from '../../../services/detection.service';
import { IPatient } from '../../../models/patient.model';
import { IDetection } from '../../../models/detection.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-manage-patients',
    templateUrl: './manage-patients.component.html',
    styleUrls: ['./manage-patients.component.css'],
    standalone: false
})
export class ManagePatientsComponent implements OnInit {
  patients: IPatient[] = [];
  selectedPatient: IPatient | null = null;
  newPatient: IPatient = {
    _id: '',
    fullName: '',
    age: 0,
    sexe: '',
    createdAt: new Date(),
    specialist: '',
    workspace: ''
  };
  showUploadPopup: boolean = false;
  showDeleteConfirmation: boolean = false;
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
    const newPatientData: Partial<IPatient> = {
      fullName: this.newPatient.fullName,
      age: this.newPatient.age,
      sexe: this.newPatient.sexe,
      specialist: currentUser._id, // Use the ID of the logged-in specialist
      workspace: currentUser.workspace // Use the workspace of the logged-in specialist
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
          specialist: '',
          workspace: ''
        };
      },
      (error) => console.error('Error creating patient:', error)
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
}
