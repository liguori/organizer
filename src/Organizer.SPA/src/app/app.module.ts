import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { UtilizationComponent } from './utilization/utilization.component';
import { EventViewerComponent } from './event-viewer/event-viewer.component';
import { ApiModule as OrganizerApiClient, Configuration, ConfigurationParameters } from './api/OrganizerApiClient';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppointmentEditorComponent } from './appointment-editor/appointment-editor.component';
import { CalendarEditorComponent } from './calendar-editor/calendar-editor.component';
import { AppointmentSummaryComponent } from './appointment-summary/appointment-summary.component';
import { AppConfig } from './app.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CustomDialogModule } from './custom-dialog/custom-dialog.module';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { StyleManager } from './themes/style-manager';
import { WarningResumeComponent } from './warning-resume/warning-resume.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ColorPickerDirective } from 'ngx-color-picker';
import {MatProgressBarModule} from '@angular/material/progress-bar';

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
    basePath: AppConfig.settings.api.url,
    apiKeys: { "X-API-Key": AppConfig.settings.api.key }
  }
  return new Configuration(params);
}

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

export function createApiConfigFactory() {
  return apiConfigFactory();
}

@NgModule({ declarations: [
        AppComponent,
        CalendarComponent,
        HomeComponent,
        CustomerComponent,
        UtilizationComponent,
        EventViewerComponent,
        AppointmentEditorComponent,
        CalendarEditorComponent,
        AppointmentSummaryComponent,
        CustomerViewComponent,
        WarningResumeComponent,
        InputDialogComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        CustomDialogModule,
        MatIconModule,
        OrganizerApiClient.forRoot(createApiConfigFactory),
        NgxMatSelectSearchModule,
        ColorPickerDirective,
        MatProgressBarModule], providers: [
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppConfig], multi: true
        },
        MatDatepickerModule,
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
        StyleManager,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
