import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Appointment, AppointmentExtraInfo } from '../api/EngagementOrganizerApiClient';

@Component({
  selector: 'app-event-viewer',
  templateUrl: './event-viewer.component.html',
  styleUrls: ['./event-viewer.component.scss']
})
export class EventViewerComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  @Input()
  appointments: Array<AppointmentExtraInfo>;

  @Output()
  eventSelected = new EventEmitter<AppointmentExtraInfo>();

  eventClick(app: AppointmentExtraInfo) {
    this.eventSelected.emit(app);
  }

  getEventStyle(app: AppointmentExtraInfo) {
    let col = '';
    let bkCol = '';
    if (app.customerID != null) {
      col = app.customer.textColor;
      bkCol = app.customer.color;
    } else {
      col = app.type.textColor;
      bkCol = app.type.color;
    }
    let styles = {
      'background-color': bkCol,
      'color': col
    };
    return styles;
  }


  getProjectBadgeStyle(pp: AppointmentExtraInfo) {
    if (pp.projectColor != null) {
      let styles = {
        'background-color': pp.projectColor
      };
      return styles;
    }else{
      return null;
    }
  }

  getEventDescription(app: AppointmentExtraInfo): string {
    if (app.customerID != null) {
      return app.customer.shortDescription;
    } else {
      return app.type.shortDescription;
    }
  }

  trackByEventItems(index: number, item: AppointmentExtraInfo): number {
    return item.id;
  }
}
