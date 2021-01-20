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
    if (app.customerID != null || app.isFromUpstream) {
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


  getAvailabilityStyle(pp: AppointmentExtraInfo) {
    if (pp.availabilityID != null) {
      var currentColor = "";
      switch (pp.availabilityID) {
        case 0:
          currentColor = "#00FF00"
          break;
        case 1:
          currentColor = "#FF0000"
          break;
        case 2:
          currentColor = "#ebc934"
          break;
      }
      let styles = {
        'background-color': currentColor
      };
      return styles;
    } else {
      return null;
    }
  }


  getProjectBadgeStyle(pp: AppointmentExtraInfo) {
    if (pp.projectColor != null) {
      let styles = {
        'background-color': pp.projectColor
      };
      return styles;
    } else {
      return null;
    }
  }

  getEventDescription(app: AppointmentExtraInfo): string {
    if (app.customerID != null || app.isFromUpstream) {
      return app.customer.shortDescription;
    } else {
      return app.type.shortDescription;
    }
  }

  trackByEventItems(index: number, item: AppointmentExtraInfo): number {
    return item.id;
  }
}
