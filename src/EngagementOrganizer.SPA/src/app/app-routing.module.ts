import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { UtilizationComponent } from './utilization/utilization.component';
import { AppointmentResolver } from './resolvers/appointment-resolver.service';
import { UpstreamEventTokenResolver } from './resolvers/upstreamEventTolen-resolver.service';
import { CalendarResolver } from './resolvers/calendar-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'calendar/', pathMatch: 'full' },
  { path: 'calendar/:year?', component: HomeComponent, resolve: { appointments: AppointmentResolver, upstreamEventTokenEnabled: UpstreamEventTokenResolver, calendars: CalendarResolver }, runGuardsAndResolvers: 'always' },
  { path: 'customer/:year?', component: CustomerComponent, resolve: { appointments: AppointmentResolver }, runGuardsAndResolvers: 'always' },
  { path: 'utilization/:year?', component: UtilizationComponent, resolve: { appointments: AppointmentResolver }, runGuardsAndResolvers: 'always' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
