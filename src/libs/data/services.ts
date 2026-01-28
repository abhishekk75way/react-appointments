import type { Service } from "../types";

const STORAGE_KEY = "appointments_services";

const defaultServices: Service[] = [
  {
    id: "service-1",
    name: "Men's Haircut & Styling",
    description: "Professional haircut with styling, includes head massage and hair wash",
    duration: 45,
    price: 350.00,
    active: true,
  },
  {
    id: "service-2",
    name: "Women's Haircut & Blow Dry",
    description: "Expert haircut with professional blow dry and styling",
    duration: 60,
    price: 600.00,
    active: true,
  },
  {
    id: "service-3",
    name: "Hair Coloring (Full)",
    description: "Complete hair coloring with premium L'Oréal products and color protection treatment",
    duration: 120,
    price: 2500.00,
    active: true,
  },
  {
    id: "service-4",
    name: "Highlights & Streaks",
    description: "Professional highlights or streaks with natural-looking dimension",
    duration: 90,
    price: 1800.00,
    active: true,
  },
  {
    id: "service-5",
    name: "Beard Trim & Grooming",
    description: "Professional beard trimming and shaping with hot towel treatment",
    duration: 30,
    price: 200.00,
    active: true,
  },
  {
    id: "service-6",
    name: "Hair Spa & Treatment",
    description: "Deep conditioning hair spa with keratin and argan oil for damaged hair",
    duration: 60,
    price: 1200.00,
    active: true,
  },
  {
    id: "service-7",
    name: "Bridal Hair Styling",
    description: "Complete bridal hair styling package with trial session included",
    duration: 120,
    price: 3500.00,
    active: true,
  },
  {
    id: "service-8",
    name: "Hair Smoothening",
    description: "Keratin smoothening treatment for frizz-free, silky smooth hair",
    duration: 180,
    price: 4500.00,
    active: true,
  },
  {
    id: "service-9",
    name: "Scalp Treatment",
    description: "Therapeutic scalp treatment with essential oils and deep cleansing",
    duration: 45,
    price: 800.00,
    active: true,
  },
  {
    id: "service-10",
    name: "Hair Rebonding",
    description: "Professional hair rebonding for permanently straight hair",
    duration: 240,
    price: 5500.00,
    active: true,
  },
  {
    id: "service-11",
    name: "Party Makeup",
    description: "Professional party makeup with complimentary hair styling",
    duration: 90,
    price: 2000.00,
    active: true,
  },
  {
    id: "service-12",
    name: "Hair Consultation",
    description: "Personalized hair consultation with expert recommendations",
    duration: 20,
    price: 0.00,
    active: true,
  },
];

const loadServices = (): Service[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...defaultServices];
    }
  }
  return [...defaultServices];
};

const saveServices = (services: Service[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

export const mockServices = loadServices();

export const getActiveServices = (): Service[] => {
  const services = loadServices();
  return services.filter((service) => service.active);
};

export const getAllServices = (): Service[] => {
  return loadServices();
};

export const getServiceById = (id: string): Service | undefined => {
  const services = loadServices();
  return services.find((service) => service.id === id);
};

export const updateService = (id: string, updates: Partial<Service>): Service | undefined => {
  const services = loadServices();
  const index = services.findIndex((service) => service.id === id);
  if (index !== -1) {
    services[index] = { ...services[index], ...updates };
    saveServices(services);
    return services[index];
  }
  return undefined;
};

export const addService = (service: Service): Service => {
  const services = loadServices();
  services.push(service);
  saveServices(services);
  return service;
};

export const deleteService = (id: string): boolean => {
  const services = loadServices();
  const filtered = services.filter((service) => service.id !== id);
  if (filtered.length < services.length) {
    saveServices(filtered);
    return true;
  }
  return false;
};
