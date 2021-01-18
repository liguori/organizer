import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Day } from '../models/day';
import { CalendarDay } from '../models/calendarDay';
import { Appointment, AppointmentExtraInfo } from '../api/EngagementOrganizerApiClient';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { Month } from '../models/month';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  readonly MaxTile: number = 37;
  @Input()
  currentYear: number = new Date().getFullYear();

  @Input()
  filterProject: string;

  @Input()
  upstreamEventToken: string;

  @Input()
  appointments: Array<AppointmentExtraInfo>;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

  }

  @Output() daySelected = new EventEmitter<Date>();

  @Output() eventSelected = new EventEmitter<Appointment>();

  eventViewerEventSelected(app: Appointment) {
    this.eventSelected.emit(app);
  }

  dayClicked(currentDay: CalendarDay) {
    if (currentDay.date != null) {
      this.daySelected.emit(currentDay.date);
    }
  }

  getEventsByDate(date: Date): Array<Appointment> {
    var ris: Array<Appointment> = [];
    if (date != null) {
      ris = this.appointments.filter(x => new Date(x.startDate.toString()) <= date && new Date(x.endDate.toString()) >= date);
    }
    if (this.filterProject != null && this.filterProject.trim() != "") {
      ris = ris.filter(x => x.project != null && x.project.toLowerCase() == this.filterProject.toLowerCase());
    }
    return ris.sort((a, b) => (a.typeID > b.typeID) ? -1 : 1);
  }

  getMonthDayHeaders(): Array<Day> {
    var res = new Array<Day>();
    for (let index = 0; index < this.MaxTile; index++) {
      var currentDayIndex = index % DateTimeUtils.days.length;
      res.push(DateTimeUtils.days[currentDayIndex]);
    }
    return res;
  }

  isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  getDayHighlightingClass(day: CalendarDay): String {
    if (day.date != null) {
      if (this.isToday(day.date)) {
        return 'today';
      }

      if (day.date.getDay() == 6)
        return 'highlight-saturday';
      else if (day.date.getDay() == 0)
        return 'highlight-sunday';
    } else {
      return 'no-day';
    }
  }

  getMonthUtilization(month, year) {
    var currentDaysInMonth = DateTimeUtils.getDaysInMonth(month, year);
    var workingDayCount = 0;
    var billableAppointmentCount = 0;
    for (let i = 1; i <= currentDaysInMonth; i++) {
      var currentDate = new Date(year, month - 1, i);
      var dayOfTheWeek = currentDate.getDay();
      if (dayOfTheWeek != 6 && dayOfTheWeek != 0) {
        workingDayCount++;
      }
      if (this.getEventsByDate(currentDate).filter(x => x.type.billable).length > 0) billableAppointmentCount++;
    }
    return (100 * billableAppointmentCount / workingDayCount).toFixed(0);
  }

  getMonthDays(month, year): Array<CalendarDay> {
    var res = new Array<CalendarDay>();
    var currentDaysInMonth = DateTimeUtils.getDaysInMonth(month, year);
    for (let i = 1; i <= currentDaysInMonth; i++) {
      var currentDate = new Date(year, month - 1, i);
      if (i == 1) {
        var startingDayOfTheWeek = currentDate.getDay();
        if (startingDayOfTheWeek != 1) {
          if (startingDayOfTheWeek < 1) startingDayOfTheWeek = 7 - startingDayOfTheWeek;
          for (let j = 0; j < startingDayOfTheWeek - 1; j++) {
            res.push({ index: res.length + 1 });
          }
        }
      }
      res.push({ date: currentDate, index: res.length + 1 });
      if (i == currentDaysInMonth) {
        var tileLeft = this.MaxTile - res.length;
        for (let k = 0; k < tileLeft; k++) {
          res.push({ index: res.length + 1 });
        }
      }
    }
    return res;
  }

  trackByDayItems(index: number, item: CalendarDay): Date {
    return item.date;
  }

  public isCurrentMonth(param: Month): boolean {
    var today = new Date()
    return param.monthNumber == (today.getMonth() + 1) && this.currentYear == today.getFullYear();
  }

  months = DateTimeUtils.months;
}
