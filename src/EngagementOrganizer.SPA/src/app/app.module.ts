import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { EventViewerComponent } from './event-viewer/event-viewer.component';
import { ApiModule as EngagementOrganizerApiClient, Configuration, ConfigurationParameters } from './api/EngagementOrganizerApiClient';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentEditorComponent } from './appointment-editor/appointment-editor.component';
import { AppConfig } from './app.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatFormFieldModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CustomDialogModule } from './custom-dialog/custom-dialog.module';

//create our cost var with the information about the format that we want
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: AppConfig.settings.api.url
  }
  return new Configuration(params);
}

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

export function createApiConfigFactory() {
  return apiConfigFactory();
}

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    HomeComponent,
    CustomerComponent,
    EventViewerComponent,
    AppointmentEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CustomDialogModule,
    EngagementOrganizerApiClient.forRoot(createApiConfigFactory)
  ],
  entryComponents: [
    AppointmentEditorComponent
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    },
    MatDatepickerModule,
    { provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }