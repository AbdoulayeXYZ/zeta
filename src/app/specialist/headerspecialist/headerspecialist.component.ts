import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { DetectionService } from '../../services/detection.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
    selector: 'app-headerspecialist',
    templateUrl: './headerspecialist.component.html',
    styleUrl: './headerspecialist.component.css',
    standalone: false
})
export class HeaderspecialistComponent {
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  
  constructor(
    private router: Router,
    private patientService: PatientService,
    private detectionService: DetectionService
  ) {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.searchItems(query);
      }
    });
  }
  
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }
  
  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchItems(this.searchQuery);
    }
  }
  
  private searchItems(query: string): void {
    // Navigate to manage-patients with search query
    this.router.navigate(['/specialist/manage-patients'], {
      queryParams: { search: query }
    });
  }
}
