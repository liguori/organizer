import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppointmentsService } from '../api/OrganizerApiClient/api/appointments.service';
import { Calendar } from '../api/OrganizerApiClient/model/calendar';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarResolver  {
  private cachedCalendars: Calendar[] | null = null;
  constructor(private appointmentService: AppointmentsService) {
  }
  invalidate() {
    this.cachedCalendars = null;
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.cachedCalendars) {
      return of(this.cachedCalendars);
    }
    return this.appointmentService.apiAppointmentsCalendarsGet().pipe(
      tap(calendars => this.cachedCalendars = calendars)
    );
  }
}
