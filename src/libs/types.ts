import { type AxiosRequestConfig } from "axios";
import { type ReactElement } from "react";

export interface AuthData {
  fullName?: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN" | "STAFF";
  phoneNumber?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; 
  price: number;
  active: boolean;
}

export interface Availability {
  id: string;
  userId: string;
  dayOfWeek?: number; 
  date?: string; 
  startTime: string; 
  endTime: string;
}

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "RESCHEDULED";

export interface Appointment {
  id: string;
  userId: string;
  staffId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  user: User;
  staff: User;
  service: Service;
  createdAt: string;
}

export interface ErrorResponse {
  message: string;
}

export interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

export interface AppItem {
  id: string;
  label: string;
  icon: ReactElement;
  path: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN" | "STAFF";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
