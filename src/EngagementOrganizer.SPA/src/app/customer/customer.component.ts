import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CustomersService, Customer, Appointment } from '../api/EngagementOrganizerApiClient';
import { DateTimeUtils } from '../utils/dateTimeUtils';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  appointments: Array<Appointment>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomersService) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.appointments = this.route.snapshot.data.appointments;
    });
    this.clearCustomerEditing();
  }

  currentCustomer: Customer;

  isEditingCustomer: Boolean = false;


  addCustomer() {
    this.isEditingCustomer = true;
  }

  saveCustomer() {
    if (this.currentCustomer.shortDescription.trim() == '') {
      alert('Insert a code for the customer');
      return;
    }
    if (this.currentCustomer.name.trim() == '') {
      alert('Insert a name for the customer');
      return;
    }
    if (this.currentCustomer.color.trim() == '') {
      alert('Insert a color for the customer');
      return;
    }
    if (this.currentCustomer.textColor.trim() == '') {
      alert('Insert a text color for the customer');
      return;
    }
    if (!this.currentCustomer.textColor.startsWith('#')) this.currentCustomer.textColor = '#' + this.currentCustomer.textColor;
    if (!this.currentCustomer.color.startsWith('#')) this.currentCustomer.color = '#' + this.currentCustomer.textColor;
    if (confirm("Are you sure you want to save the customer?")) {

      if (this.currentCustomer.id == null) {
        this.customerService.postCustomer(this.currentCustomer).subscribe(
          data => {
            this.router.navigate(['customer/', this.route.snapshot.params["year?"]]);
          },
          (err) => {
            alert('Error while saving customer' + err.message);
          }
        );
      } else {
        this.customerService.putCustomer(this.currentCustomer.id, this.currentCustomer).subscribe(
          data => {
            this.router.navigate(['customer/', this.route.snapshot.params["year?"]]);
          },
          (err) => {
            alert('Error while editing customer' + err.message);
          }
        );
      }
      this.clearCustomerEditing();
    }
  }

  clearCustomerEditing() {
    this.currentCustomer = { id: null, shortDescription: '', name: '', color: '', textColor: '' };
    this.isEditingCustomer = false;
  }

  cancelEditCustomer() {
    this.clearCustomerEditing();
  }

  editCustomer(cus: Customer) {
    this.currentCustomer = cus;
    this.isEditingCustomer = true;
  }

  selectedYear: number;

  ngOnInit() {
    this.selectedYear = Number.parseInt(this.route.snapshot.params["year?"]);

    this.customerService.getCustomers().subscribe(
      data => {
        this.customers = data
      },
      (err) => {
        console.log(err.message);
      }
    );;
  }

  customers: Array<Customer>

  changeYear(value) {
    this.router.navigate(['customer/', value]);
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


  getAvailableYears(): Array<Number> {
    var currentYear = new Date().getFullYear();
    var res = new Array<Number>();
    res.push(currentYear - 3);
    res.push(currentYear - 2);
    res.push(currentYear - 1);
    res.push(currentYear);
    res.push(currentYear + 1);
    res.push(currentYear + 2);
    res.push(currentYear + 1);
    return res;
  }

}
