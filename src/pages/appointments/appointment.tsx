import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Stack,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  Button,
  Paper,
} from "@mui/material";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import AppointmentActionDialog from "@/components/appointments/AppointmentActionDialog";
import type { Appointment, AppointmentStatus } from "@/libs/types";
import { getAppointments, updateAppointmentStatus } from "@/services/api";
import { toast } from "react-toastify";
import { Add } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";

export default function AppointmentsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isStaff = user?.role === "STAFF";
  const isAdmin = user?.role === "ADMIN";
  const isManagement = isStaff || isAdmin;
  const location = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [mode, setMode] = useState<"reschedule" | "cancel">("reschedule");
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(location.state?.tab || 0);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleConfirm = async (
    id: string,
    action: "cancel" | "reschedule",
    data?: string,
  ) => {
    try {
      if (action === "cancel") {
        await updateAppointmentStatus(id, "CANCELLED");
        toast.success("Appointment cancelled");
      } else {
        if (!data) return;
        const payload = {
          startTime: new Date(data).toISOString(),
          // We assume duration stays the same, or we could calculate new endTime if needed.
        };
        await updateAppointmentStatus(id, "RESCHEDULED", payload);
        toast.success("Appointment rescheduled");
      }
      setOpen(false);
      fetchAppointments();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Action failed");
      }
    }
  };

  const handleStatusUpdate = async (
    appt: Appointment,
    status: AppointmentStatus,
  ) => {
    try {
      await updateAppointmentStatus(appt.id, status);
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchAppointments();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Status update failed");
      }
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (tabIndex === 0) {
      if (isManagement) {
        return appt.status === "PENDING" || appt.status === "RESCHEDULED";
      }
      return appt.status === "PENDING" || appt.status === "CONFIRMED" || appt.status === "RESCHEDULED";
    }
    if (tabIndex === 1) return appt.status === "CONFIRMED";
    if (tabIndex === 2) return appt.status === "COMPLETED";
    return appt.status === "CANCELLED";
  });

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight="800">
          {isAdmin ? "System Admin: Appointments" : isStaff ? "Appointment Management" : "My Appointments"}
        </Typography>
        {!isManagement && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/book")}
            sx={styles.bookButton}
          >
            Book New
          </Button>
        )}
      </Box>

      <Tabs
        value={tabIndex}
        onChange={(_, val) => setTabIndex(val)}
        sx={styles.tabs}
      >
        <Tab label={isManagement ? "Requests" : "Upcoming"} />
        <Tab label="Confirmed" />
        <Tab label="Completed" />
        <Tab label="Cancelled" />
      </Tabs>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {filteredAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onReschedule={(a) => {
                setSelected(a);
                setMode("reschedule");
                setOpen(true);
              }}
              onCancel={(a) => {
                setSelected(a);
                setMode("cancel");
                setOpen(true);
              }}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
          {filteredAppointments.length === 0 && (
            <Paper sx={styles.noAppointmentsPaper}>
              <Typography color="text.secondary">
                No appointments found
              </Typography>
            </Paper>
          )}
        </Stack>
      )}

      {selected && (
        <AppointmentActionDialog
          open={open}
          mode={mode}
          appointment={selected}
          onClose={() => setOpen(false)}
          onConfirm={(data) => handleConfirm(selected.id, mode, data)}
        />
      )}
    </Container>
  );
}

const styles = {
  container: { py: 4 },
  bookButton: {
    borderRadius: 3,
    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
  },
  tabs: { mb: 4 },
  noAppointmentsPaper: {
    p: 8,
    textAlign: "center" as const,
    borderRadius: 4,
    bgcolor: "#f8fafc",
  },
};
