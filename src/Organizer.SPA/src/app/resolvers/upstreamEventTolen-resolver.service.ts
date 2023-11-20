import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppointmentsService } from '../api/OrganizerApiClient/api/appointments.service';

@Injectable({
  providedIn: 'root'
})
export class UpstreamEventTokenResolver  {
  requested: Boolean = false;
  constructor(private appointmentService: AppointmentsService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.appointmentService.apiAppointmentsUpstreamCustomTokenGet();
  }
}
