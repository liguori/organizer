import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppointmentExtraInfo } from '../api/OrganizerApiClient/model/models';

@Component({
  selector: 'app-warning-resume',
  templateUrl: './warning-resume.component.html',
  styleUrls: ['./warning-resume.component.scss']
})
export class WarningResumeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {  warnings: Array<AppointmentExtraInfo> }) { 
    this.warnings = this.data.warnings;
  }

  ngOnInit(): void {
    
  }

  warnings: Array<AppointmentExtraInfo>;

}
