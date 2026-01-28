import {
  Typography,
  Box,
  Container,
  Stack,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import {
  Event as AppointmentIcon,
  AddCircle as BookIcon,
  NotificationsActive,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAppointments } from "@/services/api";
import type { Appointment } from "@/libs/types";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import StaffDashboard from "./StaffDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apps = await getAppointments();
        setRecentAppointments(apps.slice(0, 3));
        setStats({
          upcoming: apps.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length,
          completed: apps.filter(a => a.status === 'COMPLETED').length
        });
      } catch (error) {
        console.error("Dashboard data fetch failed");
      }
    };
    fetchData();
  }, []);

  if (user?.role === 'STAFF') {
    return <StaffDashboard user={user} />;
  }

  return (
    <Container maxWidth="lg" className="py-4">
      <Box className="mb-6">
        <Typography variant="h3" fontWeight="900" className="letter-spacing-tight mb-1">
          Welcome back!
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight="400">
          Everything looks great for today.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={3} className="mb-6">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper className="stat-card-purple">
                <Typography variant="subtitle2" className="opacity-80">Upcoming Appointments</Typography>
                <Typography variant="h2" fontWeight="800" className="mt-1">{stats.upcoming}</Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper className="stat-card-teal">
                <Typography variant="subtitle2" className="opacity-80">Completed Sessions</Typography>
                <Typography variant="h2" fontWeight="800" className="mt-1">{stats.completed}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h5" fontWeight="800" className="mb-3">Recent Activity</Typography>
          <Stack spacing={2}>
            {recentAppointments.map((appt) => (
              <Paper key={appt.id} className="premium-card flex-center-y p-2">
                <Box className="icon-box-muted mr-2">
                  <AppointmentIcon color="primary" />
                </Box>
                <Box className="flex-1">
                  <Typography fontWeight="700">{appt.service.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    With {appt.staff?.fullName || 'Specialist'} • {new Date(appt.startTime).toLocaleDateString()}
                  </Typography>
                </Box>
                <Button onClick={() => navigate(`/appointments`)}>View</Button>
              </Paper>
            ))}
            {recentAppointments.length === 0 && (
              <Paper className="placeholder-card">
                <Typography color="text.secondary">No recent appointments</Typography>
              </Paper>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h5" fontWeight="800" className="mb-3">Quick Actions</Typography>
          <Stack spacing={2} className="mb-6">
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<BookIcon />} 
              onClick={() => navigate("/book")}
              className="btn-primary py-2"
            >
              Book New Appointment
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<NotificationsActive />}
              onClick={() => navigate("/calendar")}
              className="btn-secondary-outlined py-2"
            >
              Check Availability
            </Button>
          </Stack>

          <Paper className="glass-dark p-3">
            <Box className="flex-center-y gap-1-5 mb-2">
              <NotificationsActive className="text-warning" />
              <Typography fontWeight="700">Notifications</Typography>
            </Box>
            <Typography variant="body2" className="opacity-70 mb-3">
              Stay updated with your latest appointment reminders and changes.
            </Typography>
            <Button fullWidth variant="contained" className="btn-muted">
              View All Alerts
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

