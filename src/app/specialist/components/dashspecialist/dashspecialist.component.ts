import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';
import { IPatient } from '../../../models/patient.model';
import { IDetection } from '../../../models/detection.model';
import { User } from '../../../models/user.model';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ChartOptions, ChartType, ChartDataset, Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-dashspecialist',
    templateUrl: './dashspecialist.component.html',
    styleUrl: './dashspecialist.component.css',
    standalone: false
})
export class DashspecialistComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentDate: Date = new Date();
  
  // Statistics
  totalPatients: number = 0;
  totalDetections: number = 0;
  todaysDetections: number = 0;
  pendingReviews: number = 0;
  
  // Recent data
  recentPatients: IPatient[] = [];
  recentDetections: IDetection[] = [];
  
  // Advanced analytics
  detectionAccuracy: number = 0;
  weeklyGrowth: number = 0;
  monthlyGrowth: number = 0;
  criticalCases: number = 0;
  
  // Loading states
  isLoading: boolean = true;
  isRefreshing: boolean = false;
  
  // Real-time updates
  private refreshSubscription?: Subscription;
  private clockSubscription?: Subscription;
  
  // Dashboard preferences
  autoRefresh: boolean = true;
  refreshInterval: number = 30000; // 30 seconds
  
  modelMetrics = {
    mAP50: 95.7,
    precision: 93.1,
    recall: 93.4,
    updatedOn: new Date('2025-07-01T14:20:00'),
    classMetrics: [
      { class: 'glioma_tumor', value: 99.0 },
      { class: 'meningioma_tumor', value: 99.8 },
      { class: 'no_tumor', value: 87.0 },
      { class: 'pituitary_tumor', value: 99.8 }
    ]
  };
  
  public lineChartData: ChartDataset<'line'>[] = [
    { data: [95.7, 96.1, 95.2, 96.5, 95.9], label: 'mAP50' },
    { data: [93.1, 93.5, 92.8, 94.0, 93.7], label: 'Précision' },
    { data: [93.4, 93.8, 92.9, 94.2, 93.9], label: 'Rappel' }
  ];
  public lineChartLabels: string[] = ['v1', 'v2', 'v3', 'v4', 'v5'];
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true
  };
  public lineChartLegend = true;
  public lineChartType: 'line' = 'line';
  public lineChartPlugins = [];
  
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
    this.startRealTimeUpdates();
    this.startClock();
    this.fetchDynamicData();
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
  }
  
  loadDashboardData(showRefreshing: boolean = false): void {
    if (showRefreshing) {
      this.isRefreshing = true;
    } else {
      this.isLoading = true;
    }
    
    this.dashboardService.getDashboardStats().subscribe(
      (stats: DashboardStats) => {
        this.totalPatients = stats.totalPatients;
        this.totalDetections = stats.totalDetections;
        this.todaysDetections = stats.todaysDetections;
        this.pendingReviews = stats.pendingReviews;
        this.recentPatients = stats.recentPatients;
        this.recentDetections = stats.recentDetections;
        
        // Calculate advanced metrics
        this.calculateAdvancedMetrics(stats);
        
        this.isLoading = false;
        this.isRefreshing = false;
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
        this.isRefreshing = false;
      }
    );
  }
  
  getPatientName(patient: IPatient | string | null): string {
    if (patient && typeof patient === 'object' && 'fullName' in patient) {
      return patient.fullName;
    }
    return 'Unknown Patient';
  }
  
  private startRealTimeUpdates(): void {
    if (this.autoRefresh) {
      this.refreshSubscription = interval(this.refreshInterval).subscribe(() => {
        this.loadDashboardData(true);
        this.fetchDynamicData();
      });
    }
  }
  
  private fetchDynamicData(): void {
    // Try to get dynamic stats from database first
    this.dashboardService.getDynamicStats().subscribe(
      (dynamicStats: DashboardStats) => {
        this.totalPatients = dynamicStats.totalPatients;
        this.totalDetections = dynamicStats.totalDetections;
        this.todaysDetections = dynamicStats.todaysDetections;
        this.pendingReviews = dynamicStats.pendingReviews;
        this.recentPatients = dynamicStats.recentPatients;
        this.recentDetections = dynamicStats.recentDetections;
        
        // Calculate advanced metrics
        this.calculateAdvancedMetrics(dynamicStats);
        console.log('Dynamic data successfully fetched from database.');
      },
      error => {
        console.log('Dynamic endpoint not available, falling back to calculated stats:', error);
        // Fallback to calculated stats if dynamic endpoint fails
        this.loadDashboardData();
      }
    );
  }
  
  private startClock(): void {
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentDate = new Date();
    });
  }
  
  private calculateAdvancedMetrics(stats: DashboardStats): void {
    // Calculate detection accuracy based on recent detections
    if (this.recentDetections.length > 0) {
      const accurateDetections = this.recentDetections.filter(
        detection => detection.results?.confidence && detection.results.confidence > 80
      ).length;
      this.detectionAccuracy = (accurateDetections / this.recentDetections.length) * 100;
    }
    
    // Calculate growth metrics (mock calculation for demo)
    this.weeklyGrowth = Math.floor(Math.random() * 15) + 5; // 5-20% growth
    this.monthlyGrowth = Math.floor(Math.random() * 30) + 10; // 10-40% growth
    
    // Calculate critical cases
    this.criticalCases = this.recentDetections.filter(
      detection => detection.results?.confidence && detection.results.confidence > 90
    ).length;
  }
  
  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    
    if (this.autoRefresh) {
      this.startRealTimeUpdates();
    } else if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  refreshData(): void {
    this.loadDashboardData(true);
  }
  
  navigateToPatients(): void {
    this.router.navigate(['/specialist/manage-patients']);
  }
  
  navigateToDetection(): void {
    this.router.navigate(['/specialist/detection']);
  }
  
  navigateToChatbot(): void {
    this.router.navigate(['/specialist/chatbot']);
  }
  
  getGrowthColor(growth: number): string {
    if (growth > 20) return 'text-green-600';
    if (growth > 10) return 'text-blue-600';
    if (growth > 0) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  getAccuracyColor(accuracy: number): string {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-blue-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }
  
  getConfidenceClass(confidence: number | undefined): string {
    const safeConfidence = confidence || 0;
    if (safeConfidence > 80) return 'bg-green-100 text-green-800';
    if (safeConfidence > 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }
  
  getSafeConfidence(confidence: number | undefined): number {
    return confidence || 0;
  }
}
