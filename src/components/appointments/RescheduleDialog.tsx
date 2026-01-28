import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const RescheduleAppointmentDialog = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    console.log("Reschedule", {
      appointmentId,
      date,
      time,
    });

    handleClose();
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Reschedule Appointment</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="New Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="New Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!date || !time}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RescheduleAppointmentDialog;
