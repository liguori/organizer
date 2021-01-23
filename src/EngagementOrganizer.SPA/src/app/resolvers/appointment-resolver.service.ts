import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppointmentsService } from '../api/EngagementOrganizerApiClient/api/appointments.service';
import { CalendarDisplay } from '../api/EngagementOrganizerApiClient/model/calendarDisplay';

@Injectable({
  providedIn: 'root'
})
export class AppointmentResolver implements Resolve<any> {
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
