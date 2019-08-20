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
    if (app.type.billable) {
      styles["font-weight"] = "bold";
    }
    if (app.confirmed) {
      styles["text-decoration"] = "underline";
    }
    if (app.warning) {
      styles["border"] = "2px solid red";
      styles["box-sizing'"] = "border-box";
      styles["width"] = "36px";
    }
    return styles;
  }

  getEventDescription(app: AppointmentExtraInfo): string {
    if (app.customerID != null) {
      return app.customer.shortDescription;
    } else {
      return app.type.shortDescription;
    }
  }

}
