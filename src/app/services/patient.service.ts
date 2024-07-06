import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPatient } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/api/patients';

  constructor(private http: HttpClient) {}

  createPatient(data: Partial<IPatient>): Observable<IPatient> {
    return this.http.post<IPatient>(this.apiUrl, data);
  }

  getPatients(): Observable<IPatient[]> {
    return this.http.get<IPatient[]>(this.apiUrl);
  }

  getPatientById(id: string): Observable<IPatient> {
    return this.http.get<IPatient>(`${this.apiUrl}/${id}`);
  }

  updatePatient(id: string, data: Partial<IPatient>): Observable<IPatient> {
    return this.http.put<IPatient>(`${this.apiUrl}/${id}`, data);
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
