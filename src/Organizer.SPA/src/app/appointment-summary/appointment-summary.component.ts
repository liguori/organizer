import { Component, OnInit, Input, Inject } from '@angular/core';
import { AppointmentExtraInfo } from '../api/OrganizerApiClient';
import { ActivatedRoute } from '@angular/router';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss']
})
export class AppointmentSummaryComponent implements OnInit {

  currentAppointment: AppointmentExtraInfo

  constructor(
    public dialogRef: MatDialogRef<AppointmentSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { route: ActivatedRoute, currentAppointment: AppointmentExtraInfo }) {
    this.currentAppointment = this.data.currentAppointment;
  }

  ngOnInit() {
  }
  cancel() {
    this.dialogRef.close();
  }
}
