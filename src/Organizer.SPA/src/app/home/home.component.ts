import { Component, OnInit } from '@angular/core';
import { Appointment, AppointmentExtraInfo, AppointmentsService } from '../api/OrganizerApiClient';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AppointmentViewModel } from '../models/appointmentViewModel';
import moment from 'moment';
import { filter, retry } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { CustomDialogService } from '../custom-dialog/custom-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AppointmentEditorComponent } from '../appointment-editor/appointment-editor.component';
import { WarningResumeComponent } from '../warning-resume/warning-resume.component';
import { Calendar } from '../api/OrganizerApiClient/model/calendar';
import { AppointmentSummaryComponent } from '../appointment-summary/appointment-summary.component';
import { CalendarView } from '../models/calendarView';
import { CalendarDisplay } from '../models/calendarDisplay';
import { CalendarEditorComponent } from '../calendar-editor/calendar-editor.component';
import { InputDialogComponent, InputDialogData } from '../input-dialog/input-dialog.component';
import { MobileFiltersComponent } from '../mobile-filters/mobile-filters.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
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
  selectedCalendar: string = "";
  selectedView: CalendarView = CalendarView.Year;
  selectedDisplay: CalendarDisplay = CalendarDisplay.Event;
  selectedCustomers: string[];
  filterSelectedCustomer: string;

  currentAppointment: AppointmentViewModel;

  // Multiselection mode
  selectedDates: Set<string> = new Set<string>();
  selectedAppointments: Set<number> = new Set<number>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer,
    private customDialog: CustomDialogService,
    private apiAppointments: AppointmentsService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.originalAppointments = this.route.snapshot.data.appointments;
      this.appointments = this.originalAppointments;
      this.applyInMemoryFilters()
      this.upstreamEventTokenEnabled = this.route.snapshot.data.upstreamEventTokenEnabled
      this.calendars = this.route.snapshot.data.calendars;
    });
  }

  openMobileFilters(): void {
    this.bottomSheet.open(MobileFiltersComponent, {
      data: {
        selectedCalendar: this.selectedCalendar,
        calendars: this.calendars,
        selectedCustomers: this.selectedCustomers,
        customers: this.getAppointmentCustomers(),
        filterSelectedCustomer: this.filterSelectedCustomer,
        upstreamEventTokenEnabled: this.upstreamEventTokenEnabled,
        upstreamEventToken: this.upstreamEventToken,
        warningsCount: this.getWarnings().length,
        selectedDatesCount: this.selectedDates.size,
        selectedAppointmentsCount: this.selectedAppointments.size,
        
        onCalendarChange: (value) => this.calendarSelected(value),
        onCreateCalendar: () => this.createCalendar(),
        onCustomerChange: (event) => this.filterCustomerSelectedValueChange(event),
        onClearCustomers: () => { this.selectedCustomers = []; this.applyInMemoryFilters(); },
        onUpstreamTokenClick: () => this.showUpstreamEventTokenDialog(),
        onWarningsClick: () => this.showDialogWarning(),
        onAvailabilityClick: () => this.availability(),
        onTravelClick: () => this.withTravelOrOther(),
        onBulkCreateClick: () => this.bulkCreateAppointment(),
        onBulkDeleteClick: () => this.bulkDeleteAppointments(),
        onClearSelectionClick: () => this.clearSelection(),
        onShowCalendarEditor: (event, name) => this.showCalendarEditorDialog(event, name),
        onDeleteCalendar: (event, name) => this.deleteCalendar(event, name)
      }
    });
  }

  isMobileView(): boolean {
    return window.innerWidth < 768;
  }

  ngOnInit() {
    if (this.route.snapshot.params["year?"] == "") {
      var yearToSet = new Date().getFullYear().toString();
      this.router.navigate(['calendar/', yearToSet]);
    } else {
      yearToSet = this.route.snapshot.params["year?"];
    }
    this.selectedYear = Number.parseInt(yearToSet);
    this.initializeUiFilterFromLocalStorage();
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
    this.upstreamEventToken = value ?? '';
    this.persistUiFilterInLocalStorage();
    this.router.navigate(['calendar/', this.selectedYear]);
  }

  showUpstreamEventTokenDialog() {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '500px',
      data: {
        title: 'Upstream Event Token',
        label: 'Token',
        value: this.upstreamEventToken,
        placeholder: 'Paste your upstream event token here...'
      } as InputDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.changeUpstreamEventToken(result);
      }
    });
  }

  initializeUiFilterFromLocalStorage() {
    this.upstreamEventToken = localStorage.getItem('UpstreamEventToken') ?? '';
    if (localStorage.getItem('SelectedCalendar')) {
      this.selectedCalendar = localStorage.getItem('SelectedCalendar');
    }
    if (localStorage.getItem('SelectedDisplay')) {
      this.selectedDisplay = parseInt(localStorage.getItem('SelectedDisplay'));
    } else {
      this.selectedDisplay = CalendarDisplay.Event;
    }
  }

  persistUiFilterInLocalStorage() {
    localStorage.setItem('UpstreamEventToken', this.upstreamEventToken);
    if (this.selectedCalendar != null) {
      localStorage.setItem('SelectedCalendar', this.selectedCalendar);
    }
    localStorage.setItem('SelectedDisplay', this.selectedDisplay.toString());
  }

  calendarSelected(value) {
    this.persistUiFilterInLocalStorage();
    this.router.navigate(['calendar/', this.selectedYear]);
  }

  displaySelected(value) {
    this.persistUiFilterInLocalStorage();
    this.router.navigate(['calendar/', this.selectedYear]);
  }

  calendarDaySelected(date: Date, event?: MouseEvent) {
    const isCtrlClick = event && (event.ctrlKey || event.metaKey);
    if (isCtrlClick) {
      this.toggleDateSelection(date);
    } else {
      this.currentAppointment = {
        isEditing: false,
        startDate: date,
        endDate: date,
        calendarName: this.selectedCalendar
      }
      this.showAppointmentEditorDialog();
    }
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
      width: '50vw',
      height: '50vh',
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
      width: '65vw',
      height: '55vh',
      data: {
        route: this.route,
        currentAppointment: this.currentAppointment,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.currentAppointment = result;
      // Clear selection after bulk operations
      if (this.selectedDates.size > 0 || this.selectedAppointments.size > 0) {
        this.clearSelection();
      }
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

  calendarEventSelected(app: AppointmentExtraInfo, event?: MouseEvent) {
    const isCtrlClick = event && (event.ctrlKey || event.metaKey);
    if (isCtrlClick) {
      this.toggleAppointmentSelection(app.id);
    } else {
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

  applyInMemoryFilters() {
    if (this.selectedCustomers && this.selectedCustomers.length > 0) {
      this.appointments = this.originalAppointments.filter(x => this.selectedCustomers.filter(y => y?.toLowerCase() == x.customer?.shortDescription?.toLowerCase()).length > 0);
    } else {
      this.appointments = this.originalAppointments;
    }
  }

  filterCustomerSelectedValueChange(event) {
    this.applyInMemoryFilters()
  }

  unselectAllCustomer(filterCustomer: MatSelect) {
    filterCustomer.options.forEach((item: MatOption) => { item.deselect() })
  }

  withTravelOrOther(){
    var res = '';
    this.appointments.filter(a=>a.requireTravel)
    .sort((a,b)=>a.startDate <= b.startDate ? -1 : 1)
    .forEach(appointment => {
      res+='<b>'+moment(appointment.startDate).format('DD/MM/YYYY')+'</b><br/>'
      res+=appointment.note+'<br/>'
    });

    this.customDialog.openAlertDialog({ dialogTitle: "Warnings", dialogMsg: this.sanitized.bypassSecurityTrustHtml(res) });
  }

  toggleDateSelection(date: Date) {
    // Use local date components to avoid timezone conversion issues
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (this.selectedDates.has(dateKey)) {
      this.selectedDates.delete(dateKey);
    } else {
      this.selectedDates.add(dateKey);
    }
  }

  toggleAppointmentSelection(appointmentId: number) {
    if (this.selectedAppointments.has(appointmentId)) {
      this.selectedAppointments.delete(appointmentId);
    } else {
      this.selectedAppointments.add(appointmentId);
    }
  }

  clearSelection() {
    this.selectedDates = new Set<string>();
    this.selectedAppointments = new Set<number>();
  }

  isDateSelected(date: Date): boolean {
    if (!date) return false;
    // Use local date components to avoid timezone conversion issues
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return this.selectedDates.has(dateKey);
  }

  isAppointmentSelected(appointmentId: number): boolean {
    return this.selectedAppointments.has(appointmentId);
  }

  bulkCreateAppointment() {
    if (this.selectedDates.size === 0) {
      alert('Please select at least one day to create appointments');
      return;
    }

    // Parse ISO date strings as local dates to avoid timezone issues
    const dates = Array.from(this.selectedDates).map(d => {
      const [year, month, day] = d.split('-').map(Number);
      return new Date(year, month - 1, day);
    }).sort((a, b) => a.getTime() - b.getTime());
    this.currentAppointment = {
      isEditing: false,
      startDate: dates[0],
      endDate: dates[dates.length - 1],
      calendarName: this.selectedCalendar,
      bulkCreateMode: true,
      selectedDates: dates
    };
    this.showAppointmentEditorDialog();
  }

  bulkDeleteAppointments() {
    if (this.selectedAppointments.size === 0) {
      alert('Please select at least one appointment to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedAppointments.size} appointment(s)?`)) {
      // Execute sequentially to avoid SQLite database locking
      const deleteAppointmentsSequentially = async () => {
        for (const id of Array.from(this.selectedAppointments)) {
          await firstValueFrom(this.apiAppointments.apiAppointmentsIdDelete(id));
        }
      };

      deleteAppointmentsSequentially().then(() => {
        this.clearSelection();
        this.router.navigate(['calendar/', this.selectedYear]);
      }).catch(err => {
        alert('Error while deleting appointments: ' + err.message);
      });
    }
  }
}
