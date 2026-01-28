import type { RouteObject } from "react-router";
import { authLoader } from "@/services/authLoader";
import AuthLayout from "@/layouts/authLayout";
import AdminLayout from "@/layouts/adminLayout";
import AdminPage from "@/pages/admin";
import { adminLoader } from "@/services/adminLoader";
import DashboardPage from "@/pages/dashboard";
import ErrorBoundaryPage from "@/pages/error-boundary";
import AppointmentCalendarPage from "@/pages/appointments/calendar";
import AppointmentsPage from "@/pages/appointments/appointment";
import BookAppointmentPage from "@/pages/appointments/book-appointment";
import AppointmentDetailsPage from "@/pages/appointments/appointment-details";
import RescheduleAppointmentDialog from "@/components/appointments/RescheduleDialog";
import CancelAppointmentDialog from "@/components/appointments/CancelAppointmentDialog";
import UserProfilePage from "@/pages/profile/user-profile";
import StaffProfilePage from "@/pages/profile/staff-profile";

const protectedRoutes: RouteObject[] = [
  {
    loader: authLoader,
    element: <AuthLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      { path: "/appointments", element: <AppointmentsPage /> },
      { path: "/book", element: <BookAppointmentPage /> },
      { path: "/calendar", element: <AppointmentCalendarPage /> },
      {
        path: "/appointment/:appointmentId",
        element: <AppointmentDetailsPage />,
        children: [
          {
            path: "cancel",
            element: <CancelAppointmentDialog />,
          },
          {
            path: "reschedule",
            element: <RescheduleAppointmentDialog />,
          },
        ],
      },
      {
        path: "/profile/user",      
        element: <UserProfilePage />,
      },
      {
        path: "/profile/staff",      
        element: <StaffProfilePage />,
      },
    ],
  },
  {
    loader: adminLoader,
    element: <AdminLayout />,
    errorElement: <ErrorBoundaryPage />,
    children: [
      {
        path: "/admin",
        element: <AdminPage />,
      },
    ],
  },
];

export default protectedRoutes;
