import {
  Card,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  Event,
  Schedule,
  Person,
  AttachMoney,
  Cancel,
  History,
  CheckCircle,
  Block,
  TaskAlt,
  Notifications,
} from "@mui/icons-material";
import type { Appointment, AppointmentStatus } from "@/libs/types";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { sendReminder } from "@/services/api";
import { toast } from "react-toastify";
import type { ReactElement } from "react";

interface Props {
  appointment: Appointment;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onStatusUpdate?: (
    appointment: Appointment,
    status: AppointmentStatus,
  ) => void;
}

interface ActionButtonConfig {
  label: string;
  icon: ReactElement;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "success" | "error" | "info";
  fullWidth?: boolean;
  sx?: object;
}

const statusColors: Record<
  string,
  "warning" | "success" | "error" | "info" | "default"
> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
  COMPLETED: "info",
  RESCHEDULED: "default",
};

export default function AppointmentCard({
  appointment,
  onReschedule,
  onCancel,
  onStatusUpdate,
}: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const isStaff = user?.role === "STAFF";
  const isAdmin = user?.role === "ADMIN";
  const isManagement = isStaff || isAdmin;

  const dateStr = new Date(appointment.startTime).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'Asia/Kolkata',
    },
  );
  const timeStr = new Date(appointment.startTime).toLocaleTimeString(
    undefined,
    {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: 'Asia/Kolkata',
    },
  );

  const handleSendReminder = async () => {
    try {
      await sendReminder(appointment.id);
      toast.success("Reminder sent successfully");
    } catch (err) {
      toast.error("Failed to send reminder");
    }
  };

  const renderActionButton = (config: ActionButtonConfig, index: number) => (
    <Button
      key={index}
      size="small"
      variant={config.variant || "outlined"}
      color={config.color}
      startIcon={config.icon}
      onClick={config.onClick}
      fullWidth={config.fullWidth}
      sx={config.sx || styles.actionButton}
    >
      {config.label}
    </Button>
  );

  const getActionButtons = (): ActionButtonConfig[] => {
    const isPendingOrRescheduled =
      appointment.status === "PENDING" ||
      appointment.status === "RESCHEDULED";
    const isConfirmed = appointment.status === "CONFIRMED";
    const isFinished =
      appointment.status === "CANCELLED" ||
      appointment.status === "COMPLETED";

    if (isManagement && isPendingOrRescheduled) {
      return [
        {
          label: "Accept",
          icon: <CheckCircle />,
          onClick: () => onStatusUpdate?.(appointment, "CONFIRMED"),
          variant: "contained",
          color: "success",
        },
        {
          label: "Reject",
          icon: <Block />,
          onClick: () => onStatusUpdate?.(appointment, "CANCELLED"),
          color: "error",
        },
      ];
    }

    if (isManagement && isConfirmed) {
      return [
        {
          label: "Mark Complete",
          icon: <TaskAlt />,
          onClick: () => onStatusUpdate?.(appointment, "COMPLETED"),
          variant: "contained",
          color: "primary",
        },
        {
          label: "Send Reminder",
          icon: <Notifications />,
          onClick: handleSendReminder,
          color: "info",
        },
        {
          label: "Cancel",
          icon: <Cancel />,
          onClick: () => onCancel(appointment),
          color: "error",
        },
      ];
    }

    if (!isManagement && !isFinished) {
      return [
        {
          label: "Reschedule",
          icon: <History />,
          onClick: () => onReschedule(appointment),
          fullWidth: true,
          sx: styles.rescheduleButton,
        },
        {
          label: "Cancel",
          icon: <Cancel />,
          onClick: () => onCancel(appointment),
          color: "error",
          fullWidth: true,
          sx: styles.cancelButton,
        },
      ];
    }

    if (isFinished) {
      return [
        {
          label: "No further actions available",
          icon: <></>,
          onClick: () => {},
          variant: "text",
          fullWidth: true,
          sx: styles.disabledButton,
        },
      ];
    }

    return [];
  };

  const renderInfoRow = (
    icon: ReactElement,
    content: string | ReactElement,
  ) => (
    <Box display="flex" alignItems="center" gap={1.5}>
      {icon}
      <Typography variant="body2" fontWeight="600">
        {content}
      </Typography>
    </Box>
  );

  const personLabels = (
    <Stack spacing={0.5}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="caption" color="text.secondary">Client:</Typography>
        <Typography variant="body2" fontWeight="700">{appointment.user.fullName}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="caption" color="text.secondary">Specialist:</Typography>
        <Typography variant="body2" fontWeight="700">{appointment.staff.fullName}</Typography>
      </Box>
    </Stack>
  );

  return (
    <Card className="premium-card" sx={styles.card}>
      <Box sx={styles.detailsBox}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Typography variant="h6" fontWeight="700" color="primary">
              {appointment.service.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {appointment.id.substring(0, 8)}
            </Typography>
          </Box>
          <Chip
            label={appointment.status}
            color={statusColors[appointment.status] || "default"}
            size="small"
            sx={styles.statusChip}
          />
        </Box>

        <Stack spacing={1.5}>
          {renderInfoRow(
            <Event fontSize="small" sx={styles.eventIcon} />,
            dateStr,
          )}
          {renderInfoRow(
            <Schedule fontSize="small" sx={styles.scheduleIcon} />,
            timeStr,
          )}
          <Box display="flex" alignItems="flex-start" gap={1.5}>
            <Person fontSize="small" sx={styles.personIcon} />
            <Box>{personLabels}</Box>
          </Box>
          {renderInfoRow(
            <AttachMoney fontSize="small" sx={styles.moneyIcon} />,
            `₹${Number(appointment.service.price).toFixed(2)}`,
          )}
        </Stack>
      </Box>

      <Divider />

      <Box sx={styles.actionsBox}>
        {getActionButtons().map((config, index) =>
          renderActionButton(config, index),
        )}
      </Box>
    </Card>
  );
}

const styles = {
  card: { p: 0, overflow: "hidden" },
  detailsBox: { p: 3 },
  statusChip: { fontWeight: 700, borderRadius: 1.5 },
  eventIcon: { color: "#6366f1" },
  scheduleIcon: { color: "#6366f1" },
  personIcon: { color: "#8b5cf6" },
  moneyIcon: { color: "#10b981" },
  actionsBox: {
    p: 2,
    bgcolor: "#f8fafc",
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
  },
  actionButton: { borderRadius: 2, flex: 1 },
  rescheduleButton: {
    borderRadius: 2,
    borderColor: "#e2e8f0",
    color: "#64748b",
  },
  cancelButton: { borderRadius: 2 },
  disabledButton: { color: "#94a3b8" },
};