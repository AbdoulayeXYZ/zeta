import { Component, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-statsheader',
    templateUrl: './statsheader.component.html',
    styleUrls: ['./statsheader.component.css'],
    standalone: false
})
export class StatsheaderComponent implements AfterViewInit {

  ngAfterViewInit() {
    const counters = document.querySelectorAll('h4[data-target]');
    counters.forEach(counter => {
      if (counter) { // Add null check
        const updateCount = () => {
          const target = +(<HTMLElement>counter).getAttribute('data-target')!;
          const count = +(<HTMLElement>counter).innerText;
          const increment = target / 300; // 300 increments for 3 seconds

          if (count < target) {
            (<HTMLElement>counter).innerText = Math.ceil(count + increment).toString(); // Convert number to string
            setTimeout(updateCount, 10);
          } else {
            (<HTMLElement>counter).innerText = target.toString(); // Convert number to string
          }
        };
        updateCount();
      }
    });
  }
}
