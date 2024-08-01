import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hospitals: number = 0;
  specialists: number = 0;
  detections: number = 0;
  activeButton: string = 'hopital';

  ngOnInit() {
    this.animateCount('hospitals', 15, 3000);
    this.animateCount('specialists', 150, 3000);
    this.animateCount('detections', 200, 3000);
  }

  animateCount(property: 'hospitals' | 'specialists' | 'detections', target: number, duration: number) {
    let start = 0;
    const increment = target / (duration / 100);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      this[property] = Math.round(start);
    }, 100);
  }

  onHopitalClick() {
    this.activeButton = 'hopital';
  }

  onCliniqueClick() {
    this.activeButton = 'clinique';
  }
}
