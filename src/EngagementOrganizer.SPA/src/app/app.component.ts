import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Engagement Organizer';

  getCalendarCurrentYearUrl() {
    return 'calendar/'+ new Date().getFullYear().toString();
  }

  getCustomerCurrentYearUrl() {
    return 'customer/'+ new Date().getFullYear().toString();
  }
}
