import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { AppontmentResolver } from './appontment-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'calendar/', pathMatch: 'full' },
  { path: 'calendar/:year?', component: HomeComponent, resolve: { appointments: AppontmentResolver }, runGuardsAndResolvers: 'always' },
  { path: 'customer/:year?', component: CustomerComponent, resolve: { appointments: AppontmentResolver }, runGuardsAndResolvers: 'always' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
