export interface Staff {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: "doctor" | "stylist" | "manager" | "receptionist";
  services: string[];
}
