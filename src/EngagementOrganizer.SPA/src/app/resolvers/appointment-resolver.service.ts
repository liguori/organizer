import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppointmentsService } from '../api/EngagementOrganizerApiClient/api/appointments.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentResolver implements Resolve<any> {
  constructor(private appointmentService: AppointmentsService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.appointmentService.apiAppointmentsGet(route.params["year?"], localStorage.getItem("SelectedCalendar"), localStorage.getItem('UpstreamEventToken'));
  }
}
