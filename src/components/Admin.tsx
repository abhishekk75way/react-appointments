import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Avatar,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      icon: <PeopleIcon sx={styles.icon} />,
      title: "Users",
      desc: "View and manage registered customers and staff",
      action: "/admin/users",
    },
    {
      icon: <EventNoteIcon sx={styles.icon} />,
      title: "Appointments",
      desc: "Monitor all appointments and their statuses",
      action: "/appointments",
    },
    {
      icon: <SettingsIcon sx={styles.icon} />,
      title: "System Settings",
      desc: "Configure appointment rules and schedules",
      action: "/admin/settings",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={styles.headerBox}>
        <Avatar sx={styles.headerAvatar}>
          <AdminPanelSettingsIcon fontSize="large" />
        </Avatar>
        <Typography variant="h4" fontWeight={700}>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Manage users, appointments, and system settings
        </Typography>
      </Box>

      {/* Cards */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        justifyContent="center"
      >
        {adminCards.map((item, index) => (
          <Card
            key={index}
            sx={styles.card}
            onClick={() => navigate(item.action)}
          >
            <CardContent>
              <Avatar sx={styles.cardAvatar}>{item.icon}</Avatar>
              <Typography variant="h6" fontWeight={600}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {item.desc}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={styles.manageButton}
                onClick={() => navigate(item.action)}
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default Admin;

const styles = {
  headerBox: { textAlign: "center" as const, mt: 6, mb: 6 },
  headerAvatar: {
    bgcolor: "primary.main",
    width: 72,
    height: 72,
    mx: "auto",
    mb: 2,
  },
  card: {
    flex: 1,
    textAlign: "center" as const,
    p: 3,
    borderRadius: 3,
    transition: "0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: 4,
    },
  },
  cardAvatar: {
    color: "primary.main",
    width: 56,
    height: 56,
    mx: "auto",
    mb: 2,
  },
  manageButton: { mt: 3 },
  icon: { color: "primary.main" },
};
