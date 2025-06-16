import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IDetection } from '../models/detection.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private apiUrl = 'http://localhost:3000/api/detections';
  private baseUrl = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Helper method to get full image URL
  private getFullImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.baseUrl}/${imagePath.replace(/^\/+/, '')}`;
  }

  createDetection(detection: FormData): Observable<IDetection> {
    return this.http.post<IDetection>(this.apiUrl, detection).pipe(
      map(detection => ({
        ...detection,
        image: this.getFullImageUrl(detection.image)
      }))
    );
  }

  getDetections(): Observable<IDetection[]> {
    return this.http.get<IDetection[]>(this.apiUrl).pipe(
      map(detections => detections.map(detection => ({
        ...detection,
        image: this.getFullImageUrl(detection.image)
      })))
    );
  }

  getDetectionsByPatient(patientId: string): Observable<IDetection[]> {
    return this.http.get<IDetection[]>(`${this.apiUrl}/patient/${patientId}`).pipe(
      map(detections => detections.map(detection => ({
        ...detection,
        image: this.getFullImageUrl(detection.image)
      })))
    );
  }

  getDetectionById(id: string): Observable<IDetection> {
    return this.http.get<IDetection>(`${this.apiUrl}/${id}`).pipe(
      map(detection => ({
        ...detection,
        image: this.getFullImageUrl(detection.image)
      }))
    );
  }

  updateDetection(id: string, data: Partial<IDetection>): Observable<IDetection> {
    return this.http.put<IDetection>(`${this.apiUrl}/${id}`, data);
  }

  deleteDetection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
