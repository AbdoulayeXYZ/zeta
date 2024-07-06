import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { IPatient } from '../../../models/patient.model';

@Component({
  selector: 'app-manage-patients',
  templateUrl: './manage-patients.component.html',
  styleUrls: ['./manage-patients.component.css']
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

  constructor(private patientService: PatientService) {}

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
    const newPatientData: Partial<IPatient> = {
        fullName: this.newPatient.fullName,
        age: this.newPatient.age,
        sexe: this.newPatient.sexe,
        specialist: this.newPatient.specialist,
        workspace: this.newPatient.workspace
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
}
