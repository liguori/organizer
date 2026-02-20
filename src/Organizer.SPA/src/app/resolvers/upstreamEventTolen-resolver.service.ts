import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppointmentsService } from '../api/OrganizerApiClient/api/appointments.service';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpstreamEventTokenResolver  {
  private cachedResult: boolean | null = null;
  constructor(private appointmentService: AppointmentsService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.cachedResult !== null) {
      return of(this.cachedResult);
    }
    return this.appointmentService.apiAppointmentsUpstreamCustomTokenGet().pipe(
      tap(result => this.cachedResult = result)
    );
  }
}
