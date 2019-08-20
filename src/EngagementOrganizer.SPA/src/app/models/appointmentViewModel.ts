export interface AppointmentViewModel {
    isEditing: boolean,
    id?: number;
    customer?: number;
    type?: number;
    startDate?: Date;
    endDate?: Date;
    note?: string;
    confirmed?: boolean;
    requireTravel?: boolean;
    travelBooked?: boolean;
    warning?:boolean;
    warningMessage?:string;
}
