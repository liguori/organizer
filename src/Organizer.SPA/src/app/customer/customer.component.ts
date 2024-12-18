import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CustomersService, Customer, Appointment } from '../api/OrganizerApiClient';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
    standalone: false
})
export class CustomerComponent implements OnInit {
  public appointments: Array<Appointment>;
  public customers: Array<Customer>;
  public selectedYear: number;
  public filterProject: string;
  public showOnlyCustomerWithAppointments: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomersService,
    private cdr: ChangeDetectorRef) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.customerService.apiCustomersGet().subscribe(cus => {
        this.customers = cus;
      });
      this.appointments = this.route.snapshot.data.appointments;
    });
    this.clearCustomerEditing();
  }

  currentCustomer: Customer;

  isEditingCustomer: Boolean = false;

  ngOnInit() {
    this.selectedYear = Number.parseInt(this.route.snapshot.params["year?"]);
  }

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
    if (!this.currentCustomer.color.startsWith('#')) this.currentCustomer.color = '#' + this.currentCustomer.color;
    if (confirm("Are you sure you want to save the customer?")) {

      if (this.currentCustomer.id == null) {
        this.currentCustomer.id = 0;
        this.customerService.apiCustomersPost(this.currentCustomer).subscribe(
          data => {
            this.router.navigate(['customer/', this.route.snapshot.params["year?"]]);
          },
          (err) => {
            alert('Error while saving customer' + err.message);
          }
        );
      } else {
        this.customerService.apiCustomersIdPut(this.currentCustomer.id, this.currentCustomer).subscribe(
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

  changeYear(value) {
    this.selectedYear = Number.parseInt(value);
    this.router.navigate(['customer/', value]);
  }

  changeFilterProject(value) {
    this.filterProject = value;
  }


}
