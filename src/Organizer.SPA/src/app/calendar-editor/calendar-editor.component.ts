import { Component, OnInit, Input, Inject } from '@angular/core';
import { AppointmentViewModel } from '../models/appointmentViewModel';
import { AppointmentType, CustomersService, Customer, AppointmentsService, Appointment } from '../api/OrganizerApiClient';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { Calendar } from '../api/OrganizerApiClient/model/calendar';


@Component({
    selector: 'app-calendar-editor',
    templateUrl: './calendar-editor.component.html',
    styleUrls: ['./calendar-editor.component.scss'],
    standalone: false
})
export class CalendarEditorComponent implements OnInit {

  constructor(
    private router: Router,
    private apiAppointments: AppointmentsService,
    public dialogRef: MatDialogRef<CalendarEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { route: ActivatedRoute, currentCalendar: string }) {
    this.currentCalendar = this.data.currentCalendar;
    this.route = this.data.route
  }

  ngOnInit() {
    if (this.currentCalendar == null) {
      this.editCalendar = { calendarName: "", description: "", color: "" };
    } else {
      this.apiAppointments.apiAppointmentsCalendarCalendarNameGet(this.currentCalendar).subscribe(result => {
        this.editCalendar = result;
      });
    }
  }

  cancel() {
    this.currentCalendar = null;
    this.dialogRef.close();
  }

  validateData() {
    if (this.editCalendar.calendarName.trim() == "") {
      alert("Please insert a valid calendar name");
      return false;
    }
    if (this.editCalendar.color.trim() == "") {
      alert("Please insert a valid color");
      return false;
    }
    if (this.editCalendar.textColor.trim() == "") {
      alert("Please insert a valid text color");
      return false;
    }
    return true;
  }

  save() {

    if (!this.validateData()) return;

    if (confirm("Are you sure you want to save the calendar?")) {
      if (this.currentCalendar == null) {
        this.apiAppointments.apiAppointmentsCalendarPost(this.editCalendar).subscribe(x => {
          this.dialogRef.close(this.editCalendar);
        },
          (err) => {
            alert('Error while saving calendar' + err.message);
          });
      } else {
        this.apiAppointments.apiAppointmentsCalendarCalendarNamePut(this.currentCalendar, this.editCalendar).subscribe(x => {
          this.dialogRef.close(this.editCalendar);
        },
          (err) => {
            alert('Error while saving calendar' + err.message);
          });
      }
    }
  }

  route: ActivatedRoute

  currentCalendar: string

  editCalendar: Calendar
}
