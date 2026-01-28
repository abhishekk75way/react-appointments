import type { User } from "../types";

const STORAGE_KEY = "appointments_users";

const defaultUsers: User[] = [
  {
    id: "user-1",
    email: "rajesh.kumar@gmail.com",
    fullName: "Rajesh Kumar",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    role: "USER",
    phoneNumber: "+91-98765-43210",
    createdAt: "2025-03-15T10:00:00Z",
    lastLogin: "2026-01-28T09:30:00Z",
  },
  {
    id: "user-2",
    email: "priya.sharma@gmail.com",
    fullName: "Priya Sharma",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    role: "USER",
    phoneNumber: "+91-98234-56789",
    createdAt: "2025-04-22T09:00:00Z",
    lastLogin: "2026-01-27T14:20:00Z",
  },
  {
    id: "user-3",
    email: "amit.patel@gmail.com",
    fullName: "Amit Patel",
    avatarUrl: "https://i.pravatar.cc/150?img=13",
    role: "USER",
    phoneNumber: "+91-97123-45678",
    createdAt: "2025-05-18T08:00:00Z",
    lastLogin: "2026-01-26T16:45:00Z",
  },
  {
    id: "user-4",
    email: "sneha.reddy@gmail.com",
    fullName: "Sneha Reddy",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
    role: "USER",
    phoneNumber: "+91-96543-21098",
    createdAt: "2025-06-10T11:30:00Z",
    lastLogin: "2026-01-25T10:15:00Z",
  },
  {
    id: "user-5",
    email: "vikram.singh@gmail.com",
    fullName: "Vikram Singh",
    avatarUrl: "https://i.pravatar.cc/150?img=14",
    role: "USER",
    phoneNumber: "+91-95432-10987",
    createdAt: "2025-07-05T13:45:00Z",
    lastLogin: "2026-01-24T11:30:00Z",
  },
  {
    id: "user-6",
    email: "ananya.iyer@gmail.com",
    fullName: "Ananya Iyer",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    role: "USER",
    phoneNumber: "+91-94321-09876",
    createdAt: "2025-08-12T14:20:00Z",
    lastLogin: "2026-01-23T15:10:00Z",
  },
  {
    id: "user-7",
    email: "arjun.mehta@gmail.com",
    fullName: "Arjun Mehta",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    role: "USER",
    phoneNumber: "+91-93210-98765",
    createdAt: "2025-09-08T10:15:00Z",
    lastLogin: "2026-01-22T12:45:00Z",
  },
  {
    id: "admin-1",
    email: "admin@salonpro.in",
    fullName: "Karthik Menon",
    avatarUrl: "https://i.pravatar.cc/150?img=33",
    role: "ADMIN",
    phoneNumber: "+91-99999-88888",
    createdAt: "2024-11-01T10:00:00Z",
    lastLogin: "2026-01-28T08:00:00Z",
  },
  {
    id: "staff-1",
    email: "deepak.verma@salonpro.in",
    fullName: "Deepak Verma",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    role: "STAFF",
    phoneNumber: "+91-98888-77777",
    createdAt: "2025-01-20T10:00:00Z",
    lastLogin: "2026-01-28T08:30:00Z",
  },
  {
    id: "staff-2",
    email: "kavita.nair@salonpro.in",
    fullName: "Kavita Nair",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    role: "STAFF",
    phoneNumber: "+91-98777-66666",
    createdAt: "2025-02-15T10:00:00Z",
    lastLogin: "2026-01-28T08:45:00Z",
  },
  {
    id: "staff-3",
    email: "rahul.das@salonpro.in",
    fullName: "Rahul Das",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    role: "STAFF",
    phoneNumber: "+91-98666-55555",
    createdAt: "2025-03-10T10:00:00Z",
    lastLogin: "2026-01-28T09:15:00Z",
  },
  {
    id: "staff-4",
    email: "meera.joshi@salonpro.in",
    fullName: "Meera Joshi",
    avatarUrl: "https://i.pravatar.cc/150?img=16",
    role: "STAFF",
    phoneNumber: "+91-98555-44444",
    createdAt: "2025-04-05T10:00:00Z",
    lastLogin: "2026-01-28T09:00:00Z",
  },
];

const defaultPasswords: Record<string, string> = {
  "rajesh.kumar@gmail.com": "Rajesh@123",
  "priya.sharma@gmail.com": "Priya@123",
  "amit.patel@gmail.com": "Amit@123",
  "sneha.reddy@gmail.com": "Sneha@123",
  "vikram.singh@gmail.com": "Vikram@123",
  "ananya.iyer@gmail.com": "Ananya@123",
  "arjun.mehta@gmail.com": "Arjun@123",
  "admin@salonpro.in": "Admin@123",
  "deepak.verma@salonpro.in": "Deepak@123",
  "kavita.nair@salonpro.in": "Kavita@123",
  "rahul.das@salonpro.in": "Rahul@123",
  "meera.joshi@salonpro.in": "Meera@123",
};

const loadUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...defaultUsers];
    }
  }
  return [...defaultUsers];
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const mockUsers = loadUsers();

export const mockPasswords: Record<string, string> = { ...defaultPasswords };

export const getUserByEmail = (email: string): User | undefined => {
  const users = loadUsers();
  return users.find((user) => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
  const users = loadUsers();
  return users.find((user) => user.id === id);
};

export const getStaffUsers = (): User[] => {
  const users = loadUsers();
  return users.filter((user) => user.role === "STAFF");
};

export const getAllUsers = (): User[] => {
  return loadUsers();
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const users = loadUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
  }
  return undefined;
};

export const addUser = (user: User): User => {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return user;
};

export const deleteUser = (id: string): boolean => {
  const users = loadUsers();
  const filtered = users.filter((user) => user.id !== id);
  if (filtered.length < users.length) {
    saveUsers(filtered);
    return true;
  }
  return false;
};

export const validatePassword = (email: string, password: string): boolean => {
  return mockPasswords[email] === password;
};

export const updatePassword = (email: string, newPassword: string): void => {
  mockPasswords[email] = newPassword;
};
