import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { Appointment, AppointmentExtraInfo } from '../api/OrganizerApiClient';
import { Calendar } from '../api/OrganizerApiClient/model/calendar';
import { CalendarDisplay } from '../models/calendarDisplay';
import { CalendarView } from '../models/calendarView';

@Component({
    selector: 'app-event-viewer',
    templateUrl: './event-viewer.component.html',
    styleUrls: ['./event-viewer.component.scss'],
    standalone: false
})
export class EventViewerComponent implements OnInit {
  calendars: Array<Calendar>;
  
  private longPressTimer: any;
  private readonly longPressDuration = 500; // milliseconds

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.calendars = this.route.snapshot.data.calendars;
  }

  @Input()
  currentView: CalendarView = CalendarView.Year;

  @Input()
  selectedDisplay: CalendarDisplay = CalendarDisplay.Event;

  @Input()
  appointments: Array<AppointmentExtraInfo>;

  @Input()
  isSelectionMode: boolean = false;

  @Input()
  selectedAppointments: Set<number> = new Set<number>();

  @Output()
  eventSelected = new EventEmitter<{appointment: AppointmentExtraInfo, event: MouseEvent}>();

  eventClick(app: AppointmentExtraInfo, event: MouseEvent) {
    event.stopPropagation(); // Prevent day click event
    this.eventSelected.emit({appointment: app, event: event});
  }

  onTouchStart(app: AppointmentExtraInfo, event: TouchEvent) {
    event.stopPropagation();
    this.longPressTimer = setTimeout(() => {
      // Simulate CTRL+Click for long press
      const mouseEvent = new MouseEvent('click', {
        ctrlKey: true,
        bubbles: true
      });
      this.eventSelected.emit({appointment: app, event: mouseEvent});
    }, this.longPressDuration);
  }

  onTouchEnd(event: TouchEvent) {
    event.stopPropagation();
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }

  onTouchMove(event: TouchEvent) {
    event.stopPropagation();
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }

  isAppointmentSelected(appointmentId: number): boolean {
    return this.selectedAppointments && this.selectedAppointments.has(appointmentId);
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


  getCalendarStyle(app: AppointmentExtraInfo) {
    let col = '';
    let bkCol = '';
    if (this.calendars && app.calendarName) {
      var currentCalendar = this.calendars.find(x => x.calendarName == app.calendarName);
      if (currentCalendar) {
        col = currentCalendar.textColor;
        bkCol = currentCalendar.color;
      }
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

  public get calendarView(): typeof CalendarView {
    return CalendarView;
  }

  public get calendarDisplay(): typeof CalendarDisplay {
    return CalendarDisplay;
  }
}
