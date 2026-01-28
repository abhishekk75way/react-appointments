import { type Appointment } from "@/libs/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";

type Mode = "reschedule" | "cancel";

interface Props {
  open: boolean;
  mode: Mode;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (payload: string) => void;
}

export default function AppointmentActionDialog({
  open,
  mode,
  appointment,
  onClose,
  onConfirm,
}: Props) {
  const [value, setValue] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setValue("");
      setSelectedSlot(null);
    }
  }, [open]);

  if (!appointment) return null;

  const handleConfirm = () => {
    if (mode === "reschedule") {
      if (selectedSlot) {
        const [year, month, day] = selectedSlot.date.split("-").map(Number);
        const [hour, minute] = selectedSlot.time.split(":").map(Number);
        const newDate = new Date(year, month - 1, day, hour, minute);
        onConfirm(newDate.toISOString());
      }
    } else {
      onConfirm(value);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: styles.dialogPaper }}
    >
      <DialogTitle fontWeight="800">
        {mode === "reschedule"
          ? "Reschedule Appointment"
          : "Cancel Appointment"}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={styles.contentText}>
          {mode === "reschedule"
            ? "Choose a new available time slot below."
            : "Are you sure you want to cancel this appointment? This action cannot be undone."}
        </Typography>

        {mode === "reschedule" ? (
          <Box>
            <AvailabilityCalendar
              staffId={appointment.staffId}
              selectedSlot={selectedSlot}
              onSelectSlot={(date, time) => setSelectedSlot({ date, time })}
            />
          </Box>
        ) : (
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Reason for cancellation (optional)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={styles.textField}
          />
        )}
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} sx={styles.cancelButton}>
          Nevermind
        </Button>
        <Button
          variant="contained"
          color={mode === "cancel" ? "error" : "primary"}
          onClick={handleConfirm}
          disabled={mode === "reschedule" ? !selectedSlot : false}
          sx={styles.confirmButton}
        >
          {mode === "reschedule" ? "Confirm Reschedule" : "Confirm Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const styles = {
  dialogPaper: { borderRadius: 4, p: 1 },
  contentText: { mb: 3 },
  textField: {
    "& .MuiOutlinedInput-root": { borderRadius: 3 },
  },
  dialogActions: { p: 2, gap: 1 },
  cancelButton: { borderRadius: 2, color: "#64748b" },
  confirmButton: { borderRadius: 2, px: 3 },
};
