export type AppointmentStatus =
  | "scheduled"
  | "cancelled"
  | "completed"
  | "rescheduled";

export interface Appointment {
  id: string;

  customerId: string;
  customerName: string;

  staffId: string;
  staffName: string;

  serviceId: string;
  serviceName: string;

  dateTime: string;         
  startTime: string;     
  endTime: string;       

  status: AppointmentStatus;
}
