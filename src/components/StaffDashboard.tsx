import {
  Typography,
  Box,
  Container,
  Stack,
  Button,
  Paper,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Event as AppointmentIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TrendingUp as StatsIcon,
  AssignmentTurnedIn as CompletedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAppointments } from "@/services/api";
import type { Appointment, User } from "@/libs/types";

interface Props {
  user: User;
}

export default function StaffDashboard({ user }: Props) {
  const navigate = useNavigate();
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayCount: 0,
    pendingCount: 0,
    totalCompleted: 0,
  });

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const apps = await getAppointments();
        setMyAppointments(apps);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        setStats({
          todayCount: apps.filter((a) => {
            const date = new Date(a.startTime);
            date.setHours(0, 0, 0, 0);
            return (
              date.getTime() === today.getTime() && a.status !== "CANCELLED"
            );
          }).length,
          pendingCount: apps.filter((a) => a.status === "PENDING").length,
          totalCompleted: apps.filter((a) => a.status === "COMPLETED").length,
        });
      } catch (error) {
        console.error("Staff dashboard data fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  return (
    <Container maxWidth="lg" className="py-4">
      <Box className="mb-6 flex-between">
        <Box>
          <Typography
            variant="h3"
            fontWeight="900"
            className="letter-spacing-tight mb-1"
          >
            Staff Management
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight="400">
            Welcome back, {user.fullName}. You have {stats.todayCount}{" "}
            appointments today.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ScheduleIcon />}
          onClick={() => navigate("/profile/staff")}
          className="btn-primary"
          sx={styles.container}
        >
          Manage Working Hours
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Section */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={styles.statsCardBlue}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box sx={styles.iconBoxBlue}>
                <AppointmentIcon fontSize="small" />
              </Box>
              <Typography fontWeight="700">Today</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" color="#1e40af">
              {stats.todayCount}
            </Typography>
            <Typography variant="body2" color="#60a5fa">
              Scheduled Appointments
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={styles.statsCardOrange}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box sx={styles.iconBoxOrange}>
                <StatsIcon fontSize="small" />
              </Box>
              <Typography fontWeight="700">Pending</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" color="#9a3412">
              {stats.pendingCount}
            </Typography>
            <Typography variant="body2" color="#fb923c">
              Awaiting Confirmation
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper sx={styles.statsCardGreen}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box sx={styles.iconBoxGreen}>
                <CompletedIcon fontSize="small" />
              </Box>
              <Typography fontWeight="700">Completed</Typography>
            </Box>
            <Typography variant="h3" fontWeight="800" color="#166534">
              {stats.totalCompleted}
            </Typography>
            <Typography variant="body2" color="#4ade80">
              Total Sessions Done
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5" fontWeight="800" className="mb-3 mt-4">
            My Schedule
          </Typography>
          <Stack spacing={2}>
            {myAppointments
              .filter((a) => a.status !== "CANCELLED")
              .slice(0, 10)
              .map((appt) => (
                <Paper key={appt.id} className="premium-card p-3">
                  <Grid container spacing={2} alignItems="center">
                    <Grid size="auto">
                      <Avatar sx={styles.appointmentAvatar}>
                        {appt.user.fullName.charAt(0)}
                      </Avatar>
                    </Grid>
                    <Grid size="grow">
                      <Typography fontWeight="700">
                        {appt.user.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appt.service.name} •{" "}
                        {new Date(appt.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Grid>
                    <Grid size="auto">
                      <Chip
                        label={appt.status}
                        size="small"
                        color={
                          appt.status === "CONFIRMED"
                            ? "success"
                            : appt.status === "PENDING"
                              ? "warning"
                              : "default"
                        }
                        variant="outlined"
                        sx={styles.statusChip}
                      />
                    </Grid>
                    <Grid size="auto">
                      <Button
                        size="small"
                        variant="text"
                        onClick={() =>
                          navigate(`/appointments`, {
                            state: {
                              tab:
                                appt.status === "COMPLETED"
                                  ? 2
                                  : appt.status === "CONFIRMED"
                                    ? 1
                                    : 0,
                            },
                          })
                        }
                      >
                        Details
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            {myAppointments.length === 0 && !loading && (
              <Paper className="placeholder-card">
                <Typography color="text.secondary">
                  No appointments scheduled
                </Typography>
              </Paper>
            )}
            {loading && (
              <Box sx={styles.loadingBox}>
                <CircularProgress size={30} />
              </Box>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h5" fontWeight="800" className="mb-3 mt-4">
            Tools & Settings
          </Typography>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ScheduleIcon />}
              onClick={() => navigate("/profile/staff")}
              className="btn-secondary-outlined py-2"
              sx={styles.actionButton}
            >
              Availability Settings
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/appointments")}
              className="btn-secondary-outlined py-2"
              sx={styles.actionButton}
            >
              Client Management
            </Button>
          </Stack>

          <Paper sx={styles.proTipPaper}>
            <Typography variant="subtitle2" fontWeight="700" mb={1}>
              Pro Tip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regularly update your availability to ensure clients can book you
              during your preferred working hours.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

const styles = {
  container: { borderRadius: 3, px: 3 },
  statsCardBlue: {
    p: 3,
    borderRadius: 4,
    bgcolor: "#eff6ff",
    border: "1px solid #dbeafe",
  },
  iconBoxBlue: {
    p: 1,
    bgcolor: "#3b82f6",
    borderRadius: 2,
    color: "white",
    display: "flex",
  },
  statsCardOrange: {
    p: 3,
    borderRadius: 4,
    bgcolor: "#fff7ed",
    border: "1px solid #ffedd5",
  },
  iconBoxOrange: {
    p: 1,
    bgcolor: "#f97316",
    borderRadius: 2,
    color: "white",
    display: "flex",
  },
  statsCardGreen: {
    p: 3,
    borderRadius: 4,
    bgcolor: "#f0fdf4",
    border: "1px solid #dcfce7",
  },
  iconBoxGreen: {
    p: 1,
    bgcolor: "#22c55e",
    borderRadius: 2,
    color: "white",
    display: "flex",
  },
  appointmentAvatar: { bgcolor: "#8b5cf6" },
  statusChip: { fontWeight: 600, borderRadius: 1.5 },
  loadingBox: { display: "flex", justifyContent: "center", py: 4 },
  actionButton: { justifyContent: "flex-start", px: 3 },
  proTipPaper: {
    mt: 4,
    p: 3,
    borderRadius: 4,
    bgcolor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
};
