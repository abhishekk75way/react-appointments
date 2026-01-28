import { getAppointmentById } from "@/libs/data";
import {
  Button,
  Container,
  Stack,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { History, Cancel } from "@mui/icons-material";

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => (
  <Box sx={styles.detailRow}>
    <Typography variant="body2" color="text.secondary" fontWeight={600}>
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);

const AppointmentDetailsPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const appointment = appointmentId ? getAppointmentById(appointmentId) : undefined;

  if (!appointment) {
    return (
      <Container maxWidth="sm" sx={styles.container}>
        <Paper sx={styles.errorPaper}>
          <Typography variant="h6" color="error">
            Appointment not found
          </Typography>
        </Paper>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });
  };

  const actionButtons = [
    {
      label: "Reschedule",
      icon: <History />,
      onClick: () => navigate("reschedule"),
      color: undefined,
    },
    {
      label: "Cancel",
      icon: <Cancel />,
      onClick: () => navigate("cancel"),
      color: "error" as const,
    },
  ];

  return (
    <Container maxWidth="sm" sx={styles.container}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Appointment Details
      </Typography>

      <Paper elevation={0} sx={styles.detailsPaper}>
        <Stack spacing={2}>
          <DetailRow label="Customer" value={appointment.user.fullName} />
          <Divider />
          <DetailRow label="Staff" value={appointment.staff.fullName} />
          <Divider />
          <DetailRow label="Service" value={appointment.service.name} />
          <Divider />
          <DetailRow
            label="Start Time"
            value={formatDate(appointment.startTime)}
          />
          <Divider />
          <DetailRow
            label="End Time"
            value={formatDate(appointment.endTime)}
          />
          <Divider />
          <DetailRow label="Status" value={appointment.status} />
          {appointment.notes && (
            <>
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
                  Notes:
                </Typography>
                <Typography variant="body2">
                  {appointment.notes}
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={styles.actionsStack}
      >
        {actionButtons.map((button, index) => (
          <Button
            key={index}
            fullWidth
            variant="outlined"
            color={button.color}
            startIcon={button.icon}
            onClick={button.onClick}
            sx={styles.actionButton}
          >
            {button.label}
          </Button>
        ))}
      </Stack>

      <Outlet />
    </Container>
  );
};

export default AppointmentDetailsPage;

const styles = {
  container: {
    py: 4,
  },
  errorPaper: {
    p: 4,
    textAlign: "center" as const,
    borderRadius: 3,
    bgcolor: "#fef2f2",
  },
  detailsPaper: {
    p: 3,
    borderRadius: 3,
    border: "1px solid #e5e7eb",
    bgcolor: "#fafafa",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  },
  actionsStack: {
    mt: 3,
  },
  actionButton: {
    borderRadius: 2,
    py: 1.5,
  },
};
