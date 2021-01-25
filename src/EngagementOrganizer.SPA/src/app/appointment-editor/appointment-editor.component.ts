import { Component, OnInit, Input, Inject } from '@angular/core';
import { AppointmentViewModel } from '../models/appointmentViewModel';
import { AppointmentTypesService } from '../api/EngagementOrganizerApiClient/api/appointmentTypes.service';
import { AppointmentType, CustomersService, Customer, AppointmentsService, Appointment } from '../api/EngagementOrganizerApiClient';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { Calendar } from '../api/EngagementOrganizerApiClient/model/calendar';


@Component({
  selector: 'app-appointment-editor',
  templateUrl: './appointment-editor.component.html',
  styleUrls: ['./appointment-editor.component.scss']
})
export class AppointmentEditorComponent implements OnInit {
  route: ActivatedRoute
  currentAppointment: AppointmentViewModel
  appointmentsType: Array<AppointmentType>
  customers: Array<Customer>
  calendars: Array<Calendar>;

  constructor(
    private router: Router,
    private appointmentTypeService: AppointmentTypesService,
    private customerService: CustomersService,
    private appServ: AppointmentsService,
    public dialogRef: MatDialogRef<AppointmentEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { route: ActivatedRoute, currentAppointment: AppointmentViewModel }) {
    this.currentAppointment = this.data.currentAppointment;
    this.route = this.data.route
    this.calendars = this.route.snapshot.data.calendars;
  }

  ngOnInit() {
    this.appointmentTypeService.apiAppointmentTypesGet().subscribe(
      data => {
        this.appointmentsType = data.filter(x => x.id != 99);
      },
      (err) => {
        console.log(err.message);
      }
    );;

    this.customerService.apiCustomersGet().subscribe(
      data => {
        this.customers = data
      },
      (err) => {
        console.log(err.message);
      }
    );;
  }


  canSelectCustomer(appType: Number) {
    if (typeof this.appointmentsType === 'undefined') return false;
    return appType != null && this.appointmentsType.filter(x => x.id == appType)[0].requireCustomer;
  }

  cancel() {
    this.currentAppointment = null;
    this.dialogRef.close();
  }


  validateData(appToSend: Appointment) {
    if (appToSend.endDate < appToSend.startDate) {
      alert("'From' date can't be after 'To' date");
      return false;
    }
    return true;
  }

  save() {
    var appToSend: Appointment = {};
    appToSend.confirmed = this.currentAppointment.confirmed;
    appToSend.customerID = this.currentAppointment.customer;
    appToSend.note = this.currentAppointment.note;
    appToSend.availabilityID = this.currentAppointment.availabilityID;
    appToSend.requireTravel = this.currentAppointment.requireTravel;
    appToSend.project = this.currentAppointment.project;
    appToSend.travelBooked = this.currentAppointment.travelBooked;
    appToSend.typeID = this.currentAppointment.type;
    appToSend.startDate = DateTimeUtils.setToUtc(this.currentAppointment.startDate);
    appToSend.endDate = DateTimeUtils.setToUtc(this.currentAppointment.endDate);
    appToSend.calendarName = this.currentAppointment.calendarName;

    if (!this.validateData(appToSend)) return;

    if (confirm("Are you sure you want to save the appointment?")) {
      if (this.currentAppointment.isEditing) {
        appToSend.id = this.currentAppointment.id;
        this.appServ.apiAppointmentsIdPut(this.currentAppointment.id, appToSend).subscribe(
          data => {
            this.router.navigate(['calendar/', this.route.snapshot.params["year?"]]);
            this.dialogRef.close();
          },
          (err) => {
            alert('Error while updating appointment' + err.message);
          }
        );;
      } else {
        this.appServ.apiAppointmentsPost(appToSend).subscribe(
          data => {
            this.router.navigate(['calendar/', this.route.snapshot.params["year?"]]);
            this.dialogRef.close();
          },
          (err) => {
            alert('Error while saving appointment' + err.message);
          }
        );;
      }
    }
  }

  delete() {
    if (confirm("Are you sure you want to delete the appointment from " + this.currentAppointment.startDate + ' to ' + this.currentAppointment.endDate)) {
      this.appServ.apiAppointmentsIdDelete(this.currentAppointment.id).subscribe(
        data => {
          this.router.navigate(['calendar/', this.route.snapshot.params["year?"]]);
          this.currentAppointment = null;
          this.dialogRef.close();
        },
        (err) => {
          alert('Error while deleting appointment' + err.message);
        }
      );
    }
  }

  oneDay() {
    this.currentAppointment.endDate = this.currentAppointment.startDate;
  }

}
