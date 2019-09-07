import { Component, OnInit } from '@angular/core';
import { ApiModule, Appointment, AppointmentExtraInfo } from '../api/EngagementOrganizerApiClient';
import { AppModule } from '../app.module';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AppointmentViewModel } from '../models/appointmentViewModel';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { CustomDialogService } from '../custom-dialog/custom-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentEditorComponent } from '../appointment-editor/appointment-editor.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  appointments: Array<AppointmentExtraInfo>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer,
    private customDialog: CustomDialogService,
    public dialog: MatDialog) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.appointments = this.route.snapshot.data.appointments;
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
  }

  changeYear(value) {
    this.selectedYear=Number.parseInt(value);
    this.router.navigate(['calendar/', value]);
  }

  selectedYear: number;

  currentAppointment: AppointmentViewModel;

  calendarDaySelected(date: Date) {
    this.currentAppointment = {
      isEditing: false,
      startDate: date,
      endDate: date,
    }
    this.showDialog();
  }

  showDialog() {
    const dialogRef = this.dialog.open(AppointmentEditorComponent, {
      width: '1100px',
      height: '400px',
      data: {
        route: this.route,
        currentAppointment: this.currentAppointment
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.currentAppointment = result;
    });
  }

  calendarEventSelcted(app: AppointmentExtraInfo) {
    this.currentAppointment = {
      isEditing: true,
      startDate: new Date(app.startDate.toString()),
      endDate: new Date(app.endDate.toString()),
      confirmed: app.confirmed,
      customer: app.customerID,
      requireTravel: app.requireTravel,
      travelBooked: app.travelBooked,
      id: app.id,
      note: app.note,
      type: app.type.id,
      warning: app.warning,
      warningMessage: app.warningDescription
    }
    this.showDialog();
  }

  getWarnings(): Array<AppointmentExtraInfo> {
    return this.appointments.filter(x => x.warning);
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


}
