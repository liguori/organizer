import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Customer, Appointment, CustomersService } from '../api/OrganizerApiClient';
import { DateTimeUtils } from '../utils/dateTimeUtils';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerViewComponent implements OnInit {

  constructor(
    private customerService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,) { }

  @Input()
  customers: Array<Customer>;

  @Input()
  appointments: Array<Appointment>;

  @Input()
  selectedYear: number;

  @Input()
  filterProject: string;

  @Input()
  showOnlyCustomerWithAppointments: boolean;

  @Output()
  public customerSelectedForEdit = new EventEmitter<Customer>();

  ngOnInit() {
  }

  getCustomersWithAppointmentInYear() {
    if (this.customers) {
      return this.customers.filter(x => this.getCountEventsBySelectedYearAndCustomer(x.id) > 0 || !this.showOnlyCustomerWithAppointments);
    }
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

  getCountEventsBySelectedYearAndCustomer(customerId: number) {
    return this.appointments.filter(x => x.customerID == customerId && new Date(x.startDate.toString()).getFullYear() == this.selectedYear).length;
  }

  getEventsByDateAndCustomer(date: Date, customerId: number): Array<Appointment> {
    var ris: Array<Appointment> = [];
    if (date != null) {
      ris = this.appointments.filter(x => new Date(x.startDate.toString()) <= date && new Date(x.endDate.toString()) >= date && x.customerID == customerId);
    }
    if (this.filterProject != null && this.filterProject.trim() != "") {
      ris = ris.filter(x => x.project != null && x.project.toLowerCase() == this.filterProject.toLowerCase())
    }
    return ris;
  }

  getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
  };


  deleteCustomer(cus: Customer) {
    if (confirm('Do you want to delete the customer ' + cus.name + '?')) {
      this.customerService.apiCustomersIdDelete(cus.id).subscribe(
        data => {
          this.router.navigate(['customer/', this.route.snapshot.params["year?"]]);
        },
        (err) => {
          alert('Error while deleting customer' + err.message + '\nMake sure you have deleted all the appointments for the customer');
        }
      );
    }
  }
}
