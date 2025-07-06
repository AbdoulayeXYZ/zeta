import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PatientService } from './patient.service';
import { DetectionService } from './detection.service';
import { IPatient } from '../models/patient.model';
import { IDetection } from '../models/detection.model';

export interface DashboardStats {
  totalPatients: number;
  totalDetections: number;
  todaysDetections: number;
  pendingReviews: number;
  recentPatients: IPatient[];
  recentDetections: IDetection[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private patientService: PatientService,
    private detectionService: DetectionService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return combineLatest([
      this.patientService.getPatients(),
      this.detectionService.getDetections()
    ]).pipe(
      map(([patients, detections]) => {
        // Calculate today's detections
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaysDetections = detections.filter(detection => {
          const detectionDate = new Date(detection.detectionDate);
          return detectionDate >= today && detectionDate < tomorrow;
        }).length;

        // Calculate pending reviews (detections with confidence < 80%)
        const pendingReviews = detections.filter(detection => {
          return detection.results && detection.results.confidence !== undefined && detection.results.confidence < 80;
        }).length;

        // Get recent patients (last 5)
        const recentPatients = patients
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        // Get recent detections (last 5)
        const recentDetections = detections
          .sort((a, b) => new Date(b.detectionDate).getTime() - new Date(a.detectionDate).getTime())
          .slice(0, 5);

        return {
          totalPatients: patients.length,
          totalDetections: detections.length,
          todaysDetections,
          pendingReviews,
          recentPatients,
          recentDetections
        };
      })
    );
  }

  getPatientGrowthData(): Observable<any[]> {
    return this.patientService.getPatients().pipe(
      map(patients => {
        // Group patients by month
        const monthlyData = new Map<string, number>();
        
        patients.forEach(patient => {
          const month = new Date(patient.createdAt).toISOString().slice(0, 7); // YYYY-MM
          monthlyData.set(month, (monthlyData.get(month) || 0) + 1);
        });

        // Convert to array and sort
        return Array.from(monthlyData.entries())
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month));
      })
    );
  }

  getDetectionTrends(): Observable<any[]> {
    return this.detectionService.getDetections().pipe(
      map(detections => {
        // Group detections by day for the last 30 days
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0]; // YYYY-MM-DD
        }).reverse();

        const dailyData = new Map<string, number>();
        
        // Initialize all days with 0
        last30Days.forEach(day => dailyData.set(day, 0));

        // Count detections per day
        detections.forEach(detection => {
          const day = new Date(detection.detectionDate).toISOString().split('T')[0];
          if (dailyData.has(day)) {
            dailyData.set(day, (dailyData.get(day) || 0) + 1);
          }
        });

        return Array.from(dailyData.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));
      })
    );
  }

  getTopDetectedClasses(): Observable<any[]> {
    return this.detectionService.getDetections().pipe(
      map(detections => {
        const classCount = new Map<string, number>();

        detections.forEach(detection => {
          if (detection.results && detection.results.classes) {
            detection.results.classes.forEach(className => {
              classCount.set(className, (classCount.get(className) || 0) + 1);
            });
          }
        });

        return Array.from(classCount.entries())
          .map(([className, count]) => ({ className, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Top 10 classes
      })
    );
  }

  // Real-time dynamic stats fetching
  getDynamicStats(): Observable<DashboardStats> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`)
      .pipe(
        map((response: any) => {
          if (response) {
            // Map the response to our DashboardStats interface
            return {
              totalPatients: response.totalPatients,
              totalDetections: response.totalDetections,
              todaysDetections: response.todaysDetections,
              pendingReviews: response.pendingReviews,
              recentPatients: response.recentPatients,
              recentDetections: response.recentDetections
            } as DashboardStats;
          }
          throw new Error('No dynamic stats data');
        })
      );
  }

  // Get latest stats with real-time updates
  getLatestStats(): Observable<DashboardStats> {
    // Try to get from dedicated endpoint first, fallback to calculated
    return this.getDynamicStats().pipe(
      catchError(() => this.getDashboardStats())
    );
  }
}
