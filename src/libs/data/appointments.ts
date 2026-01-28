import type { Appointment } from "../types";
import { getUserById } from "./users";
import { getServiceById } from "./services";

const STORAGE_KEY = "appointments_bookings";

const defaultAppointments: Omit<Appointment, "user" | "staff" | "service">[] = [
  {
    id: "appt-1",
    userId: "user-1",
    staffId: "staff-1",
    serviceId: "service-1",
    startTime: "2026-01-29T10:00:00+05:30",
    endTime: "2026-01-29T10:45:00+05:30",
    status: "CONFIRMED",
    notes: "Regular customer, prefers short sides with textured top",
    createdAt: "2026-01-22T09:00:00+05:30",
  },
  {
    id: "appt-2",
    userId: "user-2",
    staffId: "staff-2",
    serviceId: "service-3",
    startTime: "2026-01-29T14:00:00+05:30",
    endTime: "2026-01-29T16:00:00+05:30",
    status: "PENDING",
    notes: "Wants chocolate brown color, allergic to ammonia - use ammonia-free products",
    createdAt: "2026-01-23T11:30:00+05:30",
  },
  {
    id: "appt-3",
    userId: "user-3",
    staffId: "staff-1",
    serviceId: "service-5",
    startTime: "2026-01-30T11:00:00+05:30",
    endTime: "2026-01-30T11:30:00+05:30",
    status: "CONFIRMED",
    notes: "Beard trim with hot towel, prefers traditional style",
    createdAt: "2026-01-24T14:00:00+05:30",
  },
  {
    id: "appt-4",
    userId: "user-4",
    staffId: "staff-3",
    serviceId: "service-6",
    startTime: "2026-01-31T15:00:00+05:30",
    endTime: "2026-01-31T16:00:00+05:30",
    status: "PENDING",
    notes: "Hair damaged from previous coloring, needs intensive spa treatment",
    createdAt: "2026-01-25T10:15:00+05:30",
  },
  {
    id: "appt-5",
    userId: "user-2",
    staffId: "staff-4",
    serviceId: "service-7",
    startTime: "2026-02-01T13:00:00+05:30",
    endTime: "2026-02-01T15:00:00+05:30",
    status: "CONFIRMED",
    notes: "Wedding on Feb 3rd, wants traditional South Indian bridal hairstyle with flowers",
    createdAt: "2026-01-20T16:30:00+05:30",
  },
  {
    id: "appt-6",
    userId: "user-3",
    staffId: "staff-1",
    serviceId: "service-1",
    startTime: "2026-01-25T10:00:00+05:30",
    endTime: "2026-01-25T10:45:00+05:30",
    status: "COMPLETED",
    notes: "Very satisfied with service",
    createdAt: "2026-01-18T09:00:00+05:30",
  },
  {
    id: "appt-7",
    userId: "user-1",
    staffId: "staff-2",
    serviceId: "service-5",
    startTime: "2026-01-20T14:00:00+05:30",
    endTime: "2026-01-20T14:30:00+05:30",
    status: "CANCELLED",
    notes: "Customer had office emergency, rescheduled to next week",
    createdAt: "2026-01-15T11:00:00+05:30",
  },
  {
    id: "appt-8",
    userId: "user-5",
    staffId: "staff-3",
    serviceId: "service-1",
    startTime: "2026-02-03T16:00:00+05:30",
    endTime: "2026-02-03T16:45:00+05:30",
    status: "PENDING",
    notes: "First time customer, referred by Amit",
    createdAt: "2026-01-27T13:45:00+05:30",
  },
  {
    id: "appt-9",
    userId: "user-4",
    staffId: "staff-4",
    serviceId: "service-4",
    startTime: "2026-01-30T09:00:00+05:30",
    endTime: "2026-01-30T10:30:00+05:30",
    status: "CONFIRMED",
    notes: "Wants subtle caramel highlights, natural sun-kissed look",
    createdAt: "2026-01-21T15:20:00+05:30",
  },
  {
    id: "appt-10",
    userId: "user-6",
    staffId: "staff-1",
    serviceId: "service-9",
    startTime: "2026-01-29T16:00:00+05:30",
    endTime: "2026-01-29T16:45:00+05:30",
    status: "CONFIRMED",
    notes: "Scalp has been dry due to pollution, recommend anti-dandruff treatment",
    createdAt: "2026-01-26T10:00:00+05:30",
  },
  {
    id: "appt-11",
    userId: "user-7",
    staffId: "staff-2",
    serviceId: "service-2",
    startTime: "2026-02-02T11:00:00+05:30",
    endTime: "2026-02-02T12:00:00+05:30",
    status: "PENDING",
    notes: "Layered cut with side bangs, office party in evening",
    createdAt: "2026-01-28T08:30:00+05:30",
  },
  {
    id: "appt-12",
    userId: "user-3",
    staffId: "staff-4",
    serviceId: "service-8",
    startTime: "2026-02-05T10:00:00+05:30",
    endTime: "2026-02-05T13:00:00+05:30",
    status: "CONFIRMED",
    notes: "Keratin smoothening, consultation done - hair type suitable for treatment",
    createdAt: "2026-01-19T14:15:00+05:30",
  },
  {
    id: "appt-13",
    userId: "user-5",
    staffId: "staff-3",
    serviceId: "service-1",
    startTime: "2026-01-28T14:00:00+05:30",
    endTime: "2026-01-28T14:45:00+05:30",
    status: "COMPLETED",
    notes: "Excellent service, customer very happy with result",
    createdAt: "2026-01-21T09:30:00+05:30",
  },
  {
    id: "appt-14",
    userId: "user-1",
    staffId: "staff-4",
    serviceId: "service-12",
    startTime: "2026-01-29T09:00:00+05:30",
    endTime: "2026-01-29T09:20:00+05:30",
    status: "CONFIRMED",
    notes: "Consultation for hair loss treatment and styling options",
    createdAt: "2026-01-27T16:00:00+05:30",
  },
  {
    id: "appt-15",
    userId: "user-2",
    staffId: "staff-1",
    serviceId: "service-6",
    startTime: "2026-02-04T15:00:00+05:30",
    endTime: "2026-02-04T16:00:00+05:30",
    status: "PENDING",
    notes: "Post-coloring hair spa to maintain color and hair health",
    createdAt: "2026-01-28T11:20:00+05:30",
  },
  {
    id: "appt-16",
    userId: "user-6",
    staffId: "staff-2",
    serviceId: "service-11",
    startTime: "2026-01-31T18:00:00+05:30",
    endTime: "2026-01-31T19:30:00+05:30",
    status: "CONFIRMED",
    notes: "Diwali party makeup, wants traditional look with modern touch",
    createdAt: "2026-01-26T12:00:00+05:30",
  },
  {
    id: "appt-17",
    userId: "user-7",
    staffId: "staff-3",
    serviceId: "service-10",
    startTime: "2026-02-06T10:00:00+05:30",
    endTime: "2026-02-06T14:00:00+05:30",
    status: "PENDING",
    notes: "Hair rebonding - patch test completed, no allergies",
    createdAt: "2026-01-27T10:30:00+05:30",
  },
];

const enrichAppointment = (appt: Omit<Appointment, "user" | "staff" | "service">): Appointment | null => {
  const user = getUserById(appt.userId);
  const staff = getUserById(appt.staffId);
  const service = getServiceById(appt.serviceId);
  
  if (!user || !staff || !service) {
    return null;
  }
  
  return {
    ...appt,
    user,
    staff,
    service,
  };
};

const loadAppointments = (): Appointment[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let rawAppointments: Omit<Appointment, "user" | "staff" | "service">[];
  
  if (stored) {
    try {
      rawAppointments = JSON.parse(stored);
    } catch {
      rawAppointments = [...defaultAppointments];
    }
  } else {
    rawAppointments = [...defaultAppointments];
  }
  
  return rawAppointments.map(enrichAppointment).filter((a): a is Appointment => a !== null);
};

const saveAppointments = (appointments: Appointment[]): void => {
  const rawAppointments = appointments.map(({ user, staff, service, ...rest }) => rest);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rawAppointments));
};

export const mockAppointments = loadAppointments();

export const getAllAppointments = (): Appointment[] => {
  const appointments = loadAppointments();
  return [...appointments].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
};

export const getAppointmentsByUserId = (userId: string): Appointment[] => {
  const appointments = loadAppointments();
  return appointments
    .filter((appt) => appt.userId === userId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getAppointmentsByStaffId = (staffId: string): Appointment[] => {
  const appointments = loadAppointments();
  return appointments
    .filter((appt) => appt.staffId === staffId)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getStaffAppointmentTimes = (staffId: string): { startTime: string; endTime: string }[] => {
  const appointments = loadAppointments();
  return appointments
    .filter((appt) => appt.staffId === staffId && appt.status !== "CANCELLED")
    .map((appt) => ({
      startTime: appt.startTime,
      endTime: appt.endTime,
    }));
};

export const addAppointment = (appointment: Appointment): Appointment => {
  const appointments = loadAppointments();
  appointments.push(appointment);
  saveAppointments(appointments);
  return appointment;
};

export const updateAppointmentStatus = (
  id: string,
  status: Appointment["status"],
  updates: Partial<Appointment> = {}
): Appointment | undefined => {
  const appointments = loadAppointments();
  const index = appointments.findIndex((appt) => appt.id === id);
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      ...updates,
      status,
    };
    saveAppointments(appointments);
    return appointments[index];
  }
  return undefined;
};

export const updateAppointment = (id: string, updates: Partial<Appointment>): Appointment | undefined => {
  const appointments = loadAppointments();
  const index = appointments.findIndex((appt) => appt.id === id);
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      ...updates,
    };
    saveAppointments(appointments);
    return appointments[index];
  }
  return undefined;
};

export const deleteAppointment = (id: string): boolean => {
  const appointments = loadAppointments();
  const filtered = appointments.filter((appt) => appt.id !== id);
  if (filtered.length < appointments.length) {
    saveAppointments(filtered);
    return true;
  }
  return false;
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  const appointments = loadAppointments();
  return appointments.find((appt) => appt.id === id);
};
