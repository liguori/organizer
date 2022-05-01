import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppointmentsService } from '../api/OrganizerApiClient/api/appointments.service';

@Injectable({
  providedIn: 'root'
})
export class UpstreamEventTokenResolver implements Resolve<any> {
  requested: Boolean = false;
  constructor(private appointmentService: AppointmentsService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.appointmentService.apiAppointmentsUpstreamCustomTokenGet();
  }
}
