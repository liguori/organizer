export * from './appointmentTypes.service';
import { AppointmentTypesService } from './appointmentTypes.service';
export * from './appointments.service';
import { AppointmentsService } from './appointments.service';
export * from './customers.service';
import { CustomersService } from './customers.service';
export const APIS = [AppointmentTypesService, AppointmentsService, CustomersService];
