import type { Availability } from "../types";

const STORAGE_KEY = "appointments_availability";

const defaultAvailability: Availability[] = [
  {
    id: "avail-1",
    userId: "staff-1",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: "avail-2",
    userId: "staff-1",
    dayOfWeek: 2,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: "avail-3",
    userId: "staff-1",
    dayOfWeek: 3,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: "avail-4",
    userId: "staff-1",
    dayOfWeek: 4,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: "avail-5",
    userId: "staff-1",
    dayOfWeek: 5,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: "avail-6",
    userId: "staff-2",
    dayOfWeek: 2,
    startTime: "10:00",
    endTime: "18:00",
  },
  {
    id: "avail-7",
    userId: "staff-2",
    dayOfWeek: 3,
    startTime: "10:00",
    endTime: "18:00",
  },
  {
    id: "avail-8",
    userId: "staff-2",
    dayOfWeek: 4,
    startTime: "10:00",
    endTime: "18:00",
  },
  {
    id: "avail-9",
    userId: "staff-2",
    dayOfWeek: 5,
    startTime: "10:00",
    endTime: "18:00",
  },
  {
    id: "avail-10",
    userId: "staff-2",
    dayOfWeek: 6,
    startTime: "10:00",
    endTime: "16:00",
  },
  {
    id: "avail-11",
    userId: "staff-3",
    dayOfWeek: 3,
    startTime: "11:00",
    endTime: "19:00",
  },
  {
    id: "avail-12",
    userId: "staff-3",
    dayOfWeek: 4,
    startTime: "11:00",
    endTime: "19:00",
  },
  {
    id: "avail-13",
    userId: "staff-3",
    dayOfWeek: 5,
    startTime: "11:00",
    endTime: "19:00",
  },
  {
    id: "avail-14",
    userId: "staff-3",
    dayOfWeek: 6,
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    id: "avail-15",
    userId: "staff-3",
    dayOfWeek: 0,
    startTime: "10:00",
    endTime: "16:00",
  },
  {
    id: "avail-16",
    userId: "staff-4",
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "16:00",
  },
  {
    id: "avail-17",
    userId: "staff-4",
    dayOfWeek: 2,
    startTime: "08:00",
    endTime: "16:00",
  },
  {
    id: "avail-18",
    userId: "staff-4",
    dayOfWeek: 3,
    startTime: "08:00",
    endTime: "16:00",
  },
  {
    id: "avail-19",
    userId: "staff-4",
    dayOfWeek: 4,
    startTime: "08:00",
    endTime: "16:00",
  },
  {
    id: "avail-20",
    userId: "staff-4",
    dayOfWeek: 5,
    startTime: "08:00",
    endTime: "16:00",
  },
  {
    id: "avail-21",
    userId: "staff-4",
    dayOfWeek: 6,
    startTime: "09:00",
    endTime: "14:00",
  },
];

const loadAvailability = (): Availability[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...defaultAvailability];
    }
  }
  return [...defaultAvailability];
};

const saveAvailability = (availability: Availability[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(availability));
};

export const mockAvailability = loadAvailability();

export const getAvailabilityByStaffId = (staffId: string): Availability[] => {
  const availability = loadAvailability();
  return availability.filter((avail) => avail.userId === staffId);
};

export const getAvailabilityByDay = (dayOfWeek: number): Availability[] => {
  const availability = loadAvailability();
  return availability.filter((avail) => avail.dayOfWeek === dayOfWeek);
};

export const getAllAvailability = (): Availability[] => {
  return loadAvailability();
};

export const updateAvailability = (id: string, updates: Partial<Availability>): Availability | undefined => {
  const availability = loadAvailability();
  const index = availability.findIndex((avail) => avail.id === id);
  if (index !== -1) {
    availability[index] = { ...availability[index], ...updates };
    saveAvailability(availability);
    return availability[index];
  }
  return undefined;
};

export const addAvailability = (avail: Availability): Availability => {
  const availability = loadAvailability();
  availability.push(avail);
  saveAvailability(availability);
  return avail;
};

export const deleteAvailability = (id: string): boolean => {
  const availability = loadAvailability();
  const filtered = availability.filter((avail) => avail.id !== id);
  if (filtered.length < availability.length) {
    saveAvailability(filtered);
    return true;
  }
  return false;
};

export const setStaffAvailability = (staffId: string, availability: Partial<Availability>[]): void => {
  const allAvailability = loadAvailability();
  const filtered = allAvailability.filter((avail) => avail.userId !== staffId);
  const newAvailability = availability.map((avail, index) => ({
    id: `avail-${staffId}-${Date.now()}-${index}`,
    userId: staffId,
    dayOfWeek: avail.dayOfWeek,
    date: avail.date,
    startTime: avail.startTime || "09:00",
    endTime: avail.endTime || "17:00",
  } as Availability));
  saveAvailability([...filtered, ...newAvailability]);
};
