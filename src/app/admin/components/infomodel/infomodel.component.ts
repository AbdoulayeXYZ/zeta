import { Component, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-infomodel',
    templateUrl: './infomodel.component.html',
    styleUrls: ['./infomodel.component.css'],
    standalone: false
})
export class InfomodelComponent implements AfterViewInit {

  ngAfterViewInit() {
    const counters = document.querySelectorAll('span[data-target]');
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +(counter.getAttribute('data-target') ?? 0);
        const count = +((counter as HTMLElement).innerText.replace('%', '') ?? 0);
        const increment = target / 300; // 300 increments for 3 seconds

        if (count < target) {
          (counter as HTMLElement).innerText = (count + increment).toFixed(2) + '%';
          setTimeout(updateCount, 10);
        } else {
          (counter as HTMLElement).innerText = target + '%';
        }
      };
      updateCount();
    });
  }

}

