import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppointmentsService } from '../api/OrganizerApiClient/api/appointments.service';
import { CalendarDisplay } from '../api/OrganizerApiClient/model/calendarDisplay';

@Injectable({
  providedIn: 'root'
})
export class AppointmentResolver  {
  constructor(private appointmentService: AppointmentsService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var calendarDisplayStored = localStorage.getItem("SelectedDisplay");
    var calendarDisplayToSend: CalendarDisplay;
    if (calendarDisplayStored) {
      calendarDisplayToSend = parseInt(localStorage.getItem("SelectedDisplay")) as CalendarDisplay
    } else {
      calendarDisplayToSend = CalendarDisplay.NUMBER_1;
    }

    return this.appointmentService.apiAppointmentsGet(route.params["year?"], localStorage.getItem("SelectedCalendar"), calendarDisplayToSend, localStorage.getItem('UpstreamEventToken'));
  }
}
