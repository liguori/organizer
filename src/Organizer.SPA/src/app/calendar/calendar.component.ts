import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Day } from '../models/day';
import { CalendarDay } from '../models/calendarDay';
import { Appointment, AppointmentExtraInfo } from '../api/OrganizerApiClient';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { Month } from '../models/month';
import { CalendarView } from '../models/calendarView';
import { CalendarDisplay } from '../models/calendarDisplay';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CalendarComponent implements OnInit, OnDestroy {
  readonly MaxTileYearView: number = 37;
  readonly MaxTileMonthView: number = 7;
  
  private longPressTimer: ReturnType<typeof setTimeout> | undefined;
  private longPressActivated = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private readonly longPressDuration = 500; // milliseconds
  private readonly longPressMoveThreshold = 10; // pixels
  private resizeTimeout: ReturnType<typeof setTimeout> | undefined;

  @Input()
  currentView: CalendarView = CalendarView.Year;


  @Input()
  selectedDisplay: CalendarDisplay = CalendarDisplay.Event;

  @Input()
  currentYear: number = new Date().getFullYear();

  @Input()
  currentMonthStartDate = DateTimeUtils.getNowWithoutTime();

  @Input()
  filterProject: string;

  @Input()
  upstreamEventToken: string;

  @Input()
  appointments: Array<AppointmentExtraInfo>;

  @Input()
  selectedDates: Set<string> = new Set<string>();

  @Input()
  selectedAppointments: Set<number> = new Set<number>();

  constructor(private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Debounce resize events to avoid excessive re-renders
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      // Trigger change detection to re-calculate empty cells
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 200);
  }

  @Output() daySelected = new EventEmitter<{date: Date, event: MouseEvent}>();

  @Output() eventSelected = new EventEmitter<{appointment: Appointment, event: MouseEvent}>();

  eventViewerEventSelected(data: {appointment: Appointment, event: MouseEvent}) {
    this.eventSelected.emit(data);
  }

  dayClicked(currentDay: CalendarDay, event: MouseEvent) {
    if (currentDay.date != null) {
      this.daySelected.emit({date: currentDay.date, event: event});
    }
  }

  onTouchStart(currentDay: CalendarDay, event: TouchEvent) {
    this.longPressActivated = false;
    if (event.touches.length > 0) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    }
    this.longPressTimer = setTimeout(() => {
      if (currentDay.date != null) {
        this.longPressActivated = true;
        // Simulate CTRL+Click for long press
        const mouseEvent = new MouseEvent('click', {
          ctrlKey: true,
          bubbles: true
        });
        this.daySelected.emit({date: currentDay.date, event: mouseEvent});
      }
    }, this.longPressDuration);
  }

  onTouchEnd(event: TouchEvent) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = undefined;
    }
    if (this.longPressActivated) {
      event.preventDefault(); // Prevent click from firing after long press
      this.longPressActivated = false;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this.longPressTimer && event.touches.length > 0) {
      const deltaX = Math.abs(event.touches[0].clientX - this.touchStartX);
      const deltaY = Math.abs(event.touches[0].clientY - this.touchStartY);
      if (deltaX > this.longPressMoveThreshold || deltaY > this.longPressMoveThreshold) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = undefined;
        this.longPressActivated = false;
      }
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

  getXHeaders(): Array<Day> {
    var res = new Array<Day>();
    if (this.currentView == CalendarView.Year) {
      for (let index = 0; index < this.getMaxTile(); index++) {
        var currentDayIndex = index % DateTimeUtils.days.length;
        res.push(DateTimeUtils.days[currentDayIndex]);
      }
    } else if (this.currentView == CalendarView.Month) {
      for (let index = 0; index < DateTimeUtils.days.length; index++) {
        var currentDayIndex = index % DateTimeUtils.days.length;
        res.push(DateTimeUtils.days[currentDayIndex]);
      }
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
      if (this.isDateSelected(day.date)) {
        return 'selected-day';
      }
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

  isDateSelected(date: Date): boolean {
    if (!date || !this.selectedDates) return false;
    // Use local date components to avoid timezone conversion issues
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return this.selectedDates.has(dateKey);
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

  getCurrentDaysRangeInY(currentYvalue): { start: number, end: number } {
    if (this.currentView == CalendarView.Year) {
      return { start: 1, end: DateTimeUtils.getDaysInMonth(currentYvalue, this.currentYear) };
    } else if (this.currentView == CalendarView.Month) {
      return { start: 1, end: 7 };
    }
  }

  getCurrentDate(currentYvalue, currentDayNumber): Date {
    if (this.currentView == CalendarView.Year) {
      return new Date(this.currentYear, currentYvalue - 1, currentDayNumber);
    } else if (this.currentView == CalendarView.Month) {
      var referDate = DateTimeUtils.addDays(this.currentMonthStartDate, -DateTimeUtils.countDaysTo(this.currentMonthStartDate, 1, -1))
      return DateTimeUtils.addDays(referDate, (7 * (currentYvalue - 1) + (currentDayNumber - 1)))
    }
  }


  getMaxTile() {
    if (this.currentView == CalendarView.Year) {
      return this.MaxTileYearView;
    } else if (this.currentView == CalendarView.Month) {
      return this.MaxTileMonthView;
    }
  }

  private isMobileView(): boolean {
    return window.innerWidth < 768;
  }

  getXValues(currentYvalue): Array<CalendarDay> {
    var res = new Array<CalendarDay>();
    var currentDaysInY = this.getCurrentDaysRangeInY(currentYvalue);
    for (let i = currentDaysInY.start; i <= currentDaysInY.end; i++) {
      var currentDate = this.getCurrentDate(currentYvalue, i);
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
      if (i == currentDaysInY.end) {
        // Calculate ending empty cells differently for mobile vs desktop
        var tileLeft: number;
        if (this.currentView == CalendarView.Year && this.isMobileView()) {
          // Mobile: complete to next multiple of 7 for week alignment
          const nextMultipleOf7 = Math.ceil(res.length / 7) * 7;
          tileLeft = nextMultipleOf7 - res.length;
        } else {
          // Desktop: fill to MaxTile (37 for year view)
          tileLeft = this.getMaxTile() - res.length;
        }
        for (let k = 0; k < tileLeft; k++) {
          res.push({ index: res.length + 1 });
        }
      }
    }
    return res;
  }

  getYValues() {
    if (this.currentView == CalendarView.Year) {
      return DateTimeUtils.months.map(x => ({ value: x.monthNumber, description: x.monthDescription }));
    } else if (this.currentView == CalendarView.Month) {
      return [1, 2, 3, 4, 5].map(x => ({ value: x, description: x.toString() }));
    }
  }

  trackByDayItems(index: number, item: CalendarDay): Date {
    return item.date;
  }

  public isCurrentMonth(param): boolean {
    var today = new Date()
    return param.value == (today.getMonth() + 1) && this.currentYear == today.getFullYear();
  }

  public get calendarView(): typeof CalendarView {
    return CalendarView;
  }
}