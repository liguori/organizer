/**
 * Mock data fixtures for Playwright screenshot tests.
 * These simulate the API responses returned by the Organizer backend.
 */

export const mockCalendars = [
  { calendarName: "work", description: "Work" },
  { calendarName: "personal", description: "Personal" }
];

export const mockCustomers = [
  {
    id: 1,
    name: "Acme Corporation",
    shortDescription: "ACME",
    color: "#1565c0",
    textColor: "#ffffff",
    projectColors: "",
    referral: "",
    address: "123 Main St",
    note: ""
  },
  {
    id: 2,
    name: "TechCorp Ltd",
    shortDescription: "TECH",
    color: "#2e7d32",
    textColor: "#ffffff",
    projectColors: "",
    referral: "",
    address: "456 Oak Ave",
    note: ""
  },
  {
    id: 3,
    name: "Globex Inc",
    shortDescription: "GLOB",
    color: "#6a1520",
    textColor: "#ffffff",
    projectColors: "",
    referral: "",
    address: "789 Pine Rd",
    note: ""
  }
];

export const mockAppointmentTypes = [
  { id: 1, description: "Consulting", billable: true, requireCustomer: true, color: "#1565c0", textColor: "#ffffff", shortDescription: "CONS" },
  { id: 2, description: "Meeting", billable: true, requireCustomer: true, color: "#2e7d32", textColor: "#ffffff", shortDescription: "MEET" },
  { id: 3, description: "Training", billable: true, requireCustomer: false, color: "#f57f17", textColor: "#000000", shortDescription: "TRAIN" },
  { id: 4, description: "Holiday", billable: false, requireCustomer: false, color: "#546e7a", textColor: "#ffffff", shortDescription: "HOL" },
  { id: 5, description: "Available", billable: false, requireCustomer: false, color: "#e8f5e9", textColor: "#000000", shortDescription: "AVAIL" }
];

const acmeCustomer = mockCustomers[0];
const techCustomer = mockCustomers[1];
const globexCustomer = mockCustomers[2];

const consultingType = mockAppointmentTypes[0];
const meetingType = mockAppointmentTypes[1];
const trainingType = mockAppointmentTypes[2];
const holidayType = mockAppointmentTypes[3];
const availableType = mockAppointmentTypes[4];

function makeAppointment(
  id: number,
  customer: typeof acmeCustomer | null,
  type: typeof consultingType,
  startDate: string,
  endDate: string,
  project = "",
  projectColor = "",
  note = "",
  confirmed = true,
  calendarName = ""
) {
  return {
    id,
    customer: customer || undefined,
    customerID: customer?.id,
    type,
    typeID: type.id,
    project,
    projectColor: projectColor || (customer?.color ?? type.color),
    startDate,
    endDate,
    note,
    confirmed,
    requireTravel: false,
    travelBooked: false,
    calendarName,
    warning: false,
    warningDescription: "",
    isFromUpstream: false,
    availabilityID: null
  };
}

export function getMockAppointments2026() {
  const appointments = [];
  let id = 1;

  // January 2026 - ACME consulting
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-01-05", "2026-01-07", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-01-08", "2026-01-09", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, meetingType, "2026-01-12", "2026-01-12", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-01-19", "2026-01-23", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, null, holidayType, "2026-01-01", "2026-01-01", "", "#546e7a"));

  // February 2026
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-02-02", "2026-02-06", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, meetingType, "2026-02-09", "2026-02-09", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, globexCustomer, consultingType, "2026-02-16", "2026-02-20", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, techCustomer, trainingType, "2026-02-23", "2026-02-25", "Beta", "#2e7d32"));

  // March 2026
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-03-02", "2026-03-06", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, globexCustomer, meetingType, "2026-03-09", "2026-03-10", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-03-16", "2026-03-20", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, consultingType, "2026-03-23", "2026-03-27", "Beta", "#2e7d32"));

  // April 2026
  appointments.push(makeAppointment(id++, globexCustomer, consultingType, "2026-04-01", "2026-04-03", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, acmeCustomer, meetingType, "2026-04-06", "2026-04-06", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, consultingType, "2026-04-13", "2026-04-17", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, null, holidayType, "2026-04-10", "2026-04-10", "", "#546e7a"));
  appointments.push(makeAppointment(id++, globexCustomer, consultingType, "2026-04-20", "2026-04-24", "Gamma", "#6a1520"));

  // May 2026
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-05-04", "2026-05-08", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, meetingType, "2026-05-11", "2026-05-12", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, globexCustomer, trainingType, "2026-05-18", "2026-05-22", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-05-25", "2026-05-29", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, null, holidayType, "2026-05-01", "2026-05-01", "", "#546e7a"));

  // June 2026
  appointments.push(makeAppointment(id++, techCustomer, consultingType, "2026-06-01", "2026-06-05", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, acmeCustomer, meetingType, "2026-06-08", "2026-06-09", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, globexCustomer, consultingType, "2026-06-15", "2026-06-19", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, techCustomer, consultingType, "2026-06-22", "2026-06-26", "Beta", "#2e7d32"));

  // July 2026
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-07-06", "2026-07-10", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, null, holidayType, "2026-07-14", "2026-07-14", "", "#546e7a"));
  appointments.push(makeAppointment(id++, globexCustomer, meetingType, "2026-07-20", "2026-07-21", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, techCustomer, consultingType, "2026-07-27", "2026-07-31", "Beta", "#2e7d32"));

  // August 2026
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-08-03", "2026-08-07", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, trainingType, "2026-08-10", "2026-08-14", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, globexCustomer, consultingType, "2026-08-17", "2026-08-21", "Gamma", "#6a1520"));

  // September 2026
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-09-07", "2026-09-11", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, meetingType, "2026-09-14", "2026-09-15", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, globexCustomer, consultingType, "2026-09-21", "2026-09-25", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-09-28", "2026-09-30", "Alpha", "#1565c0"));

  // October 2026
  appointments.push(makeAppointment(id++, techCustomer, consultingType, "2026-10-05", "2026-10-09", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, acmeCustomer, meetingType, "2026-10-12", "2026-10-13", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, globexCustomer, consultingType, "2026-10-19", "2026-10-23", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, null, holidayType, "2026-10-26", "2026-10-26", "", "#546e7a"));

  // November 2026
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-11-02", "2026-11-06", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, techCustomer, consultingType, "2026-11-09", "2026-11-13", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, globexCustomer, meetingType, "2026-11-16", "2026-11-17", "Gamma", "#6a1520"));
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-11-23", "2026-11-27", "Alpha", "#1565c0"));

  // December 2026
  appointments.push(makeAppointment(id++, techCustomer, meetingType, "2026-12-07", "2026-12-08", "Beta", "#2e7d32"));
  appointments.push(makeAppointment(id++, acmeCustomer, consultingType, "2026-12-14", "2026-12-18", "Alpha", "#1565c0"));
  appointments.push(makeAppointment(id++, null, holidayType, "2026-12-25", "2026-12-25", "", "#546e7a"));
  appointments.push(makeAppointment(id++, null, holidayType, "2026-12-31", "2026-12-31", "", "#546e7a"));

  return appointments;
}
