import { Component, OnInit, Input, Inject } from '@angular/core';
import { AppointmentViewModel } from '../models/appointmentViewModel';
import { AppointmentTypesService } from '../api/OrganizerApiClient/api/appointmentTypes.service';
import { AppointmentType, CustomersService, Customer, AppointmentsService, Appointment } from '../api/OrganizerApiClient';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { Calendar } from '../api/OrganizerApiClient/model/calendar';
import { firstValueFrom } from 'rxjs';


@Component({
    selector: 'app-appointment-editor',
    templateUrl: './appointment-editor.component.html',
    styleUrls: ['./appointment-editor.component.scss'],
    standalone: false
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

    if (this.currentAppointment.bulkCreateMode && this.currentAppointment.selectedDates && this.currentAppointment.selectedDates.length > 0) {
      // Bulk create mode - create an appointment for each selected date
      const confirmMsg = `Are you sure you want to create ${this.currentAppointment.selectedDates.length} appointment(s)?`;
      if (confirm(confirmMsg)) {
        // Execute sequentially to avoid SQLite database locking
        const createAppointmentsSequentially = async () => {
          for (const date of this.currentAppointment.selectedDates!) {
            const appForDate: Appointment = { ...appToSend };
            appForDate.startDate = DateTimeUtils.setToUtc(date);
            appForDate.endDate = DateTimeUtils.setToUtc(date);
            await firstValueFrom(this.appServ.apiAppointmentsPost(appForDate));
          }
        };

        createAppointmentsSequentially().then(() => {
          this.router.navigate(['calendar/', this.route.snapshot.params["year?"]]);
          this.dialogRef.close();
        }).catch(err => {
          alert('Error while creating appointments: ' + err.message);
        });
      }
    } else if (this.currentAppointment.isEditing) {
      // Update existing appointment
      if (confirm("Are you sure you want to save the appointment?")) {
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
      }
    } else {
      // Create single appointment
      if (confirm("Are you sure you want to save the appointment?")) {
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
