import { Component, Inject, TemplateRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Calendar } from '../api/OrganizerApiClient/model/calendar';

export interface MobileFiltersData {
  selectedCalendar: string;
  calendars: Calendar[];
  selectedAppointmentDescriptions: string[];
  appointmentDescriptions: string[];
  filterSelectedAppointmentDescription: string;
  upstreamEventTokenEnabled: boolean;
  upstreamEventToken: string;
  warningsCount: number;
  selectedDatesCount: number;
  selectedAppointmentsCount: number;
  
  // Template references for filter injection
  calendarFilterTemplate: TemplateRef<any>;
  appointmentFilterTemplate: TemplateRef<any>;
  
  // Callback functions
  onCalendarChange: (value: string) => void;
  onCreateCalendar: () => void;
  onAppointmentDescriptionChange: (event: any) => void;
  onClearAppointmentDescriptions: () => void;
  onUpstreamTokenClick: () => void;
  onWarningsClick: () => void;
  onAvailabilityClick: () => void;
  onTravelClick: () => void;
  onBulkCreateClick: () => void;
  onBulkDeleteClick: () => void;
  onClearSelectionClick: () => void;
  onShowCalendarEditor: (event: any, calendarName: string) => void;
  onDeleteCalendar: (event: any, calendarName: string) => void;
}

@Component({
  selector: 'app-mobile-filters',
  templateUrl: './mobile-filters.component.html',
  styleUrls: ['./mobile-filters.component.scss'],
  standalone: false
})
export class MobileFiltersComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<MobileFiltersComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: MobileFiltersData
  ) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }
}
