import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ScheduleIcon from "@mui/icons-material/Schedule";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router";

const features = [
  {
    icon: <EventAvailableIcon />,
    title: "Easy Booking",
    desc: "Schedule appointments with just a few clicks.",
  },
  {
    icon: <PersonAddIcon />,
    title: "Manage Clients",
    desc: "Keep track of client details and appointment history.",
  },
  {
    icon: <ScheduleIcon />,
    title: "Flexible Scheduling",
    desc: "Set availability and manage staff schedules easily.",
  },
  {
    icon: <NotificationsActiveIcon />,
    title: "Reminders & Alerts",
    desc: "Automatic notifications for upcoming appointments.",
  },
];

const steps = [
  { icon: <PersonAddIcon />, text: "Create your client profile" },
  { icon: <EventAvailableIcon />, text: "Book an appointment" },
  { icon: <ScheduleIcon />, text: "Staff confirms availability" },
  {
    icon: <NotificationsActiveIcon />,
    text: "Receive reminders & notifications",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={styles.hero}>
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Appointment Scheduler
          </Typography>
          <Typography variant="h6" sx={styles.heroText}>
            Book, manage, and track appointments effortlessly
          </Typography>
          <Button
            size="large"
            variant="contained"
            sx={styles.heroButton}
            onClick={() => navigate("/book")}
          >
            Book Now
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box sx={styles.section}>
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
            Why Choose Our Scheduler?
          </Typography>

          <Grid container spacing={4}>
            {features.map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={styles.card}>
                  <CardContent>
                    <Avatar sx={styles.avatarCard}>{item.icon}</Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1.5}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Box sx={styles.section}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={5}>
            How It Works
          </Typography>

          <Grid container spacing={4}>
            {steps.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Stack alignItems="center" spacing={2} sx={styles.textCenter}>
                  <Avatar sx={styles.avatarStep}>{step.icon}</Avatar>
                  <Typography fontWeight={500}>{step.text}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box py={8}>
        <Container maxWidth="md" sx={styles.textCenter}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography color="text.secondary" mb={4}>
            Schedule your appointments online and streamline your workflow today.
          </Typography>
          <Button
            size="large"
            variant="contained"
            sx={styles.ctaButton}
            onClick={() => navigate("/book")}
          >
            Book Your Appointment
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
    color: "white",
    py: { xs: 8, md: 10 },
    textAlign: "center" as const,
  },
  heroButton: {
    bgcolor: "white",
    color: "primary.main",
    fontWeight: 600,
    px: 4,
    "&:hover": { bgcolor: "#f5f5f5" },
  },
  heroText: { opacity: 0.9, mb: 4 },
  section: { py: 8 },
  card: {
    height: "100%",
    textAlign: "center" as const,
    p: 3,
    borderRadius: 3,
    transition: "all 0.3s ease",
    "&:hover": { transform: "translateY(-8px)", boxShadow: 10 },
  },
  avatarCard: {
    bgcolor: "primary.main",
    color: "primary.contrastText",
    width: 56,
    height: 56,
    mx: "auto",
    mb: 2,
  },
  avatarStep: {
    bgcolor: "primary.main",
    color: "white",
    width: 56,
    height: 56,
  },
  textCenter: { textAlign: "center" as const },
  ctaButton: { px: 5, py: 1.5 },
};
