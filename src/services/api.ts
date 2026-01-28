import {
  type AuthData,
  type User,
  type LoginResponse,
  type SignupFormData,
  type Service,
  type Availability,
  type Appointment,
  type AppointmentStatus,
} from "@/libs/types";
import {
  getUserByEmail,
  getUserById,
  getStaffUsers,
  validatePassword,
  getAllServices,
  getServiceById,
  getAvailabilityByStaffId,
  getAllAppointments,
  getAppointmentsByUserId,
  getAppointmentsByStaffId,
  getStaffAppointmentTimes,
  addAppointment,
  updateAppointmentStatus as updateAppointmentStatusData,
} from "@/libs/data";

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (data: AuthData): Promise<LoginResponse> => {
  await delay();
  
  const user = getUserByEmail(data.email);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  if (!validatePassword(data.email, data.password)) {
    throw new Error("Invalid email or password");
  }
  
  const accessToken = `mock-access-token-${user.id}-${Date.now()}`;
  const refreshToken = `mock-refresh-token-${user.id}-${Date.now()}`;
  
  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const signup = async (data: AuthData): Promise<SignupFormData> => {
  await delay();
  
  const existingUser = getUserByEmail(data.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  
  return {
    fullName: data.fullName || "",
    email: data.email,
    password: data.password,
    role: "USER",
  };
};

export const forgotPassword = async (data: { email: string }): Promise<{ message: string }> => {
  await delay();
  
  const user = getUserByEmail(data.email);
  if (!user) {
    throw new Error("No user found with this email");
  }
  
  return { message: "Password reset email sent successfully" };
};

export const resetPassword = async (data: {
  token: string;
  password: string;
  passwordConfirm: string;
}): Promise<{ message: string }> => {
  await delay();
  
  if (data.password !== data.passwordConfirm) {
    throw new Error("Passwords do not match");
  }
  
  return { message: "Password reset successfully" };
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}): Promise<{ message: string }> => {
  await delay();
  
  if (data.newPassword !== data.newPasswordConfirm) {
    throw new Error("New passwords do not match");
  }
  
  return { message: "Password changed successfully" };
};

export const getProfile = async (): Promise<User> => {
  await delay();
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    throw new Error("Not authenticated");
  }
  return JSON.parse(storedUser);
};

export const getServices = async (): Promise<Service[]> => {
  await delay();
  return getAllServices().filter(s => s.active);
};

export const getStaff = async (): Promise<User[]> => {
  await delay();
  return getStaffUsers();
};

export const getAvailability = async (staffId: string): Promise<Availability[]> => {
  await delay();
  return getAvailabilityByStaffId(staffId);
};

export const bookAppointment = async (data: {
  staffId: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}): Promise<Appointment> => {
  await delay();
  
  const user = await getProfile();
  const staff = getUserById(data.staffId);
  const service = getServiceById(data.serviceId);
  
  if (!staff || !service) {
    throw new Error("Invalid staff or service");
  }
  
  const startTime = new Date(data.startTime);
  const endTime = new Date(startTime.getTime() + service.duration * 60000);
  
  const newAppointment: Appointment = {
    id: `appt-${Date.now()}`,
    userId: user.id,
    staffId: data.staffId,
    serviceId: data.serviceId,
    startTime: data.startTime,
    endTime: endTime.toISOString(),
    status: "PENDING",
    notes: data.notes,
    user,
    staff,
    service,
    createdAt: new Date().toISOString(),
  };
  
  return addAppointment(newAppointment);
};

export const getAppointments = async (): Promise<Appointment[]> => {
  await delay();
  
  const user = await getProfile();
  
  if (user.role === "ADMIN") {
    return getAllAppointments();
  }
  
  if (user.role === "STAFF") {
    return getAppointmentsByStaffId(user.id);
  }
  
  return getAppointmentsByUserId(user.id);
};

export const getStaffAppointments = async (
  staffId: string
): Promise<{ startTime: string; endTime: string }[]> => {
  await delay();
  return getStaffAppointmentTimes(staffId);
};

export const updateAppointmentStatus = async (
  id: string,
  status: AppointmentStatus,
  data: Partial<Appointment> = {}
): Promise<Appointment> => {
  await delay();
  
  const updatedAppointment = updateAppointmentStatusData(id, status, data);
  
  if (!updatedAppointment) {
    throw new Error("Appointment not found");
  }
  
  return updatedAppointment;
};

export const sendReminder = async (id: string): Promise<void> => {
  await delay();
  
  console.log(`Reminder sent for appointment ${id}`);
};

export const api = {
  get: async (_url: string) => {
    throw new Error("Direct API calls are not supported with static data. Use the exported functions instead.");
  },
  post: async (_url: string, _data: unknown) => {
    throw new Error("Direct API calls are not supported with static data. Use the exported functions instead.");
  },
  patch: async (_url: string, _data: unknown) => {
    throw new Error("Direct API calls are not supported with static data. Use the exported functions instead.");
  },
  put: async (_url: string, _data: unknown) => {
    throw new Error("Direct API calls are not supported with static data. Use the exported functions instead.");
  },
  delete: async (_url: string) => {
    throw new Error("Direct API calls are not supported with static data. Use the exported functions instead.");
  },
};
