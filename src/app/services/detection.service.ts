import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDetection } from '../models/detection.model';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {
  private apiUrl = 'http://localhost:3000/api/detections';

  constructor(private http: HttpClient) {}

  createDetection(detection: FormData): Observable<IDetection> {
    return this.http.post<IDetection>(this.apiUrl, detection);
  }

  getDetections(): Observable<IDetection[]> {
    return this.http.get<IDetection[]>(this.apiUrl);
  }

  // Add other necessary methods like getDetectionById, updateDetection, deleteDetection
}
