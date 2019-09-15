import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer, Appointment } from '../api/EngagementOrganizerApiClient';
import { DateTimeUtils } from '../utils/dateTimeUtils';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerViewComponent implements OnInit {

  constructor() { }

  @Input()
  customers: Array<Customer>;

  @Input()
  appointments: Array<Appointment>;

  @Input()
  selectedYear: number;

  @Output() 
  public customerSelectedForEdit = new EventEmitter<Customer>();

  ngOnInit() {
  }

  
  getCustomerStyle(cus: Customer) {
    let style = {
      "background-color": cus.color,
      "color": cus.textColor
    }
    return style;
  }

  getCustomerSummary(cus: Customer): string {
    var ris = "";
    var countCustomerDays = 0;
    var countCustomerMonths = 0;
    for (const month of DateTimeUtils.months) {
      var monthFound = false;
      var daysInMonth = this.getDaysInMonth(month.monthNumber, this.selectedYear);
      var currentMonthAppointmentDays: Array<Number> = [];
      for (let i = 1; i <= daysInMonth; i++) {
        var currentDate = new Date(this.selectedYear, month.monthNumber - 1, i);
        if (this.getEventsByDateAndCustomer(currentDate, cus.id).length > 0) {
          currentMonthAppointmentDays.push(i);
          countCustomerDays++;
          if (!monthFound) {
            countCustomerMonths++;
            monthFound = true;
          }
        }
      }
      if (monthFound) {
        ris += '<br>' + month.monthDescription + ": " + currentMonthAppointmentDays.join(', ') + ' (' + currentMonthAppointmentDays.length + ' days)'
      }
    }
    ris += '<br><br>TOTAL: ' + countCustomerDays + ' days in ' + countCustomerMonths + ' months';
    return ris;
  }

  getEventsByDateAndCustomer(date: Date, customerId: number): Array<Appointment> {
    var ris: Array<Appointment> = [];
    if (date != null) {
      ris = this.appointments.filter(x => new Date(x.startDate.toString()) <= date && new Date(x.endDate.toString()) >= date && x.customerID == customerId);
    }
    return ris;
  }

  getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
  };


}
