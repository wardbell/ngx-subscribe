import { Component } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, delay } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  interval$ = interval(1000).pipe(map(m => `Interval-1: ${m}`));
  interval2$ = interval(500).pipe(delay(1000), map(m => `Interval-2: ${m}`));

  data = {
    interval: this.interval$,
    name: 'Bob',
    interval2: this.interval2$
  }
  show = false;
  toggleName() {
    
    // Won't matter because can't change
    this.data.name  = this.data.name === 'Bob' ? 'Sue' : 'Bob';
  }
}
