import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('toggleOpen', { static: false }) toggleOpen: ElementRef | undefined;
  @ViewChild('toggleClose', { static: false }) toggleClose: ElementRef | undefined;
  @ViewChild('collapseMenu', { static: false }) collapseMenu: ElementRef | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();  // Ensure detection of all changes
    this.addEventListeners();
  }

  private addEventListeners(): void {
    if (this.toggleOpen?.nativeElement && this.toggleClose?.nativeElement) {
      this.toggleOpen.nativeElement.addEventListener('click', () => this.handleToggle());
      this.toggleClose.nativeElement.addEventListener('click', () => this.handleToggle());
    } else {
      console.error('Toggle elements are not available');
    }
  }

  private handleToggle(): void {
    if (this.collapseMenu?.nativeElement) {
      const displayStyle = this.collapseMenu.nativeElement.style.display;
      this.collapseMenu.nativeElement.style.display = displayStyle === 'block' ? 'none' : 'block';
    } else {
      console.error('Collapse menu element is not available');
    }
  }
}
