import {
  Box,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  IconButton,
  useTheme,
  type Theme,
  type SxProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

interface AppointmentStatusIndicatorProps {
  status: "booking" | "rescheduling" | "cancelling" | "completed";
  progress?: number;  
  onClose?: () => void;
}

export default function AppointmentStatusIndicator({
  status,
  progress = 0,
  onClose,
}: AppointmentStatusIndicatorProps) {
  const theme = useTheme();
  const [manualClose, setManualClose] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (status === "completed") {
      setShowComplete(true);
      const timer = setTimeout(() => setManualClose(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowComplete(false);
      setManualClose(false);
    }
  }, [status]);

  if (manualClose) return null;

  const getTitle = () => {
    switch (status) {
      case "booking":
        return "Booking Appointment...";
      case "rescheduling":
        return "Rescheduling Appointment...";
      case "cancelling":
        return "Cancelling Appointment...";
      case "completed":
        return "Appointment Updated!";
      default:
        return "";
    }
  };

  const getSubtitle = () => {
    switch (status) {
      case "booking":
        return "Processing your booking";
      case "rescheduling":
        return "Updating appointment time";
      case "cancelling":
        return "Cancelling your appointment";
      case "completed":
        return "Action completed successfully";
      default:
        return "";
    }
  };

  return (
    <Paper sx={styles.paper(theme)}>
      <Stack spacing={2}>
        <Stack sx={styles.header}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={styles.iconWrapper(theme, showComplete)}>
              {showComplete ? (
                <CheckCircleIcon sx={styles.icon} />
              ) : (
                <EventAvailableIcon sx={styles.iconUploading} />
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                {getTitle()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getSubtitle()}
              </Typography>
            </Box>
          </Stack>

          <IconButton
            sx={styles.closeBtn(theme)}
            onClick={() => {
              setManualClose(true);
              onClose?.();
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        {!showComplete && status !== "completed" && (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <LinearProgress
                variant="determinate"
                value={Math.min(progress, 100)}
                sx={styles.progress(theme)}
              />
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
              >
                {Math.min(progress, 100)}%
              </Typography>
            </Stack>
          </Box>
        )}

        {showComplete && (
          <Box sx={styles.completeBox(theme)}>
            <Typography variant="body2" fontWeight={600} color="success.main">
              ✓ Action completed
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

export const styles = {
  paper: (theme: Theme): SxProps<Theme> => ({
    position: "fixed",
    bottom: 24,
    right: 24,
    p: 2.5,
    minWidth: 300,
    maxWidth: 340,
    zIndex: 1300,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 2,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    animation: "slideIn 0.3s ease-out",
    "@keyframes slideIn": {
      from: { transform: "translateX(400px)", opacity: 0 },
      to: { transform: "translateX(0)", opacity: 1 },
    },
  }),

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  } as SxProps<Theme>,

  iconWrapper:
    (theme: Theme, complete: boolean): SxProps<Theme> => ({
      width: 36,
      height: 36,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: complete
        ? theme.palette.success.light
        : theme.palette.primary.light,
      transition: "all 0.3s ease",
    }),

  icon: { fontSize: 20 } as SxProps<Theme>,
  iconUploading: { fontSize: 20, color: "primary.main" } as SxProps<Theme>,

  closeBtn: (theme: Theme): SxProps<Theme> => ({
    width: 32,
    height: 32,
    color: "text.secondary",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      color: "text.primary",
    },
  }),

  progress: (theme: Theme): SxProps<Theme> => ({
    flex: 1,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.palette.action.hover,
    "& .MuiLinearProgress-bar": {
      borderRadius: 2.5,
      backgroundColor: theme.palette.primary.main,
      transition: "width 0.3s ease",
    },
  }),

  completeBox: (theme: Theme): SxProps<Theme> => ({
    p: 1.5,
    textAlign: "center",
    borderRadius: 1,
    backgroundColor: theme.palette.success.light,
    border: `1px solid ${theme.palette.success.main}`,
  }),
};
