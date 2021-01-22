import { Component, OnInit } from '@angular/core';
import { Appointment, AppointmentExtraInfo, AppointmentsService } from '../api/EngagementOrganizerApiClient';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AppointmentViewModel } from '../models/appointmentViewModel';
import * as moment from 'moment';
import { filter, retry } from 'rxjs/operators';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { CustomDialogService } from '../custom-dialog/custom-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentEditorComponent } from '../appointment-editor/appointment-editor.component';
import { WarningResumeComponent } from '../warning-resume/warning-resume.component';
import { Calendar } from '../api/EngagementOrganizerApiClient/model/calendar';
import { AppointmentSummaryComponent } from '../appointment-summary/appointment-summary.component';
import { CalendarView } from '../models/calendarView';
import { CalendarDisplay } from '../models/calendarDisplay';
import { CalendarEditorComponent } from '../calendar-editor/calendar-editor.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  originalAppointments: Array<AppointmentExtraInfo>;
  appointments: Array<AppointmentExtraInfo>;
  upstreamEventTokenEnabled: Boolean;
  calendars: Array<Calendar>;

  selectedYear: number;
  selectedDate: Date = DateTimeUtils.getNowWithoutTime();
  filterProject: string;
  upstreamEventToken: string;
  selectedCalendar: string;
  selectedView: CalendarView = CalendarView.Year;
  selectedDisplay: CalendarDisplay = CalendarDisplay.Event;
  selectedCustomers: string[];
  filterSelectedCustomer: string;

  currentAppointment: AppointmentViewModel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer,
    private customDialog: CustomDialogService,
    private apiAppointments: AppointmentsService,
    public dialog: MatDialog) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.originalAppointments = this.route.snapshot.data.appointments;
      this.appointments = this.originalAppointments;
      this.upstreamEventTokenEnabled = this.route.snapshot.data.upstreamEventTokenEnabled
      this.calendars = this.route.snapshot.data.calendars;
    });
  }

  ngOnInit() {
    if (this.route.snapshot.params["year?"] == "") {
      var yearToSet = new Date().getFullYear().toString();
      this.router.navigate(['calendar/', yearToSet]);
    } else {
      yearToSet = this.route.snapshot.params["year?"];
    }
    this.selectedYear = Number.parseInt(yearToSet);
    this.upstreamEventToken = localStorage.getItem('UpstreamEventToken');
    this.selectedCalendar = localStorage.getItem('SelectedCalendar');
  }

  changeCurrentIndex(value) {
    if (this.selectedView == CalendarView.Year) {
      this.selectedYear = Number.parseInt(this.selectedYear + value);
      this.persistUiFilterInLocalStorage();
      this.router.navigate(['calendar/', this.selectedYear]);
    } else if (this.selectedView == CalendarView.Month) {
      this.selectedDate = DateTimeUtils.addDays(this.selectedDate, 7 * value);
    }
  }

  changeDate(value) {
    this.selectedDate = value.toDate();
  }

  changeFilterProject(value) {
    this.filterProject = value;
  }

  changeUpstreamEventToken(value) {
    this.upstreamEventToken = value;
    this.persistUiFilterInLocalStorage();
    this.router.navigate(['calendar/', this.selectedYear]);
  }

  persistUiFilterInLocalStorage() {
    localStorage.setItem('UpstreamEventToken', this.upstreamEventToken);
    localStorage.setItem('SelectedCalendar', this.selectedCalendar);
    localStorage.setItem('SelectedDisplay', this.selectedDisplay.toString());
  }

  calendarSelected(value) {
    this.persistUiFilterInLocalStorage();
    this.router.navigate(['calendar/', this.selectedYear]);
  }

  displaySelected(value) {
    this.selectedCalendar = "";
    this.persistUiFilterInLocalStorage();
    this.router.navigate(['calendar/', this.selectedYear]);
  }

  calendarDaySelected(date: Date) {
    this.currentAppointment = {
      isEditing: false,
      startDate: date,
      endDate: date,
      calendarName: this.selectedCalendar
    }
    this.showAppointmentEditorDialog();
  }

  showAppointmentSummaryDialog(app: AppointmentExtraInfo) {
    const dialogRef = this.dialog.open(AppointmentSummaryComponent, {
      width: '700px',
      height: '300px',
      data: {
        route: this.route,
        currentAppointment: app,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  showCalendarEditorDialog(event, calendarToEdit) {
    if (event) {
      event.preventDefault(); //<--prevent default
      event.stopPropagation();  //stop propagation
    }
    const dialogRef = this.dialog.open(CalendarEditorComponent, {
      width: '700px',
      height: '255px',
      data: {
        route: this.route,
        currentCalendar: calendarToEdit,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selectedCalendar = result.calendarName;
      this.persistUiFilterInLocalStorage();
      this.router.navigate(['calendar/', this.selectedYear]);
    });
  }

  showAppointmentEditorDialog() {
    const dialogRef = this.dialog.open(AppointmentEditorComponent, {
      width: '1100px',
      height: '400px',
      data: {
        route: this.route,
        currentAppointment: this.currentAppointment,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.currentAppointment = result;
    });
  }

  showDialogWarning() {
    const dialogRef = this.dialog.open(WarningResumeComponent, {
      width: '700px',
      height: '400px',
      data: {
        warnings: this.getWarnings()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  calendarEventSelcted(app: AppointmentExtraInfo) {
    if (app.isFromUpstream) {
      this.showAppointmentSummaryDialog(app);
    } else {
      this.currentAppointment = {
        isEditing: true,
        startDate: new Date(app.startDate.toString()),
        endDate: new Date(app.endDate.toString()),
        confirmed: app.confirmed,
        customer: app.customerID,
        requireTravel: app.requireTravel,
        travelBooked: app.travelBooked,
        id: app.id,
        availabilityID: app.availabilityID,
        note: app.note,
        project: app.project,
        type: app.type.id,
        warning: app.warning,
        warningMessage: app.warningDescription,
        calendarName: this.selectedCalendar
      }
      this.showAppointmentEditorDialog();
    }
  }

  getWarnings(): Array<AppointmentExtraInfo> {
    if (this.appointments) {
      return this.appointments.filter(x => x.warning);
    } else {
      return [];
    }
  }

  availability() {
    var res = '';
    for (const month of DateTimeUtils.months) {
      var currentDaysInMonth = DateTimeUtils.getDaysInMonth(month.monthNumber, this.selectedYear);
      var datesInMonth = false;
      var monthDates = '';
      for (let i = 1; i <= currentDaysInMonth; i++) {
        var currentDate = new Date(this.selectedYear, month.monthNumber - 1, i);
        var dayOfTheWeek = currentDate.getDay();
        if (currentDate > new Date() && dayOfTheWeek != 6 && dayOfTheWeek != 0 && !(this.getEventsByDate(currentDate).length > 0)) {
          monthDates += moment(currentDate).format('DD/MM/YYYY') + ', ';
          datesInMonth = true;
        }
      }
      if (datesInMonth) {
        monthDates = monthDates.substring(0, monthDates.length - 2) + '<br>';
        res += '<b>' + month.monthDescription + '</b><br>' + monthDates + '<br>';
      }
    }
    this.customDialog.openAlertDialog({ dialogTitle: "Available days", dialogMsg: this.sanitized.bypassSecurityTrustHtml(res) });
  }

  getEventsByDate(date: Date): Array<Appointment> {
    var ris: Array<Appointment> = [];
    if (date != null) {
      ris = this.appointments.filter(x => new Date(x.startDate.toString()) <= date && new Date(x.endDate.toString()) >= date);
    }
    return ris;
  }

  deleteCalendar(event, calendarName: string) {
    event.preventDefault(); //<--prevent default
    event.stopPropagation();  //stop propagation
    if (confirm("Do you want to delete the calendar: " + calendarName + "?")) {
      this.apiAppointments.apiAppointmentsCalendarCalendarNameDelete(calendarName).subscribe(x => {
        if (localStorage.getItem('SelectedCalendar') == calendarName) localStorage.removeItem("SelectedCalendar");
        this.router.navigate(['calendar/', this.selectedYear]);
      });
    }
  }

  createCalendar() {
    this.showCalendarEditorDialog(null, null);
  }

  public get calendarView(): typeof CalendarView {
    return CalendarView;
  }

  public get calendarDisplay(): typeof CalendarDisplay {
    return CalendarDisplay;
  }

  getAppointmentCustomers(): string[] {
    if (this.originalAppointments && this.originalAppointments.length > 0) {
      return [...new Set(this.originalAppointments.filter(x => x.customer != null && (!this.filterSelectedCustomer || x.customer.shortDescription.toLowerCase().includes(this.filterSelectedCustomer.toLowerCase()))).map(x => x.customer.shortDescription))].sort();
    } else {
      return [];
    }
  }

  filterCustomerSelectedValueChange(event) {
    if (this.selectedCustomers && this.selectedCustomers.length > 0) {
      this.appointments = this.originalAppointments.filter(x => this.selectedCustomers.filter(y => y?.toLowerCase() == x.customer?.shortDescription?.toLowerCase()).length > 0);
    } else {
      this.appointments = this.originalAppointments;
    }
  }
}
