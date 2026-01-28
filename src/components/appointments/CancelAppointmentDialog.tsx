import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const CancelAppointmentDialog = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const handleClose = () => navigate(-1);

  const handleCancelAppointment = () => {
    console.log("Cancel appointment", appointmentId);
    handleClose();
  };

  return (
    <Dialog open onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Cancel Appointment</DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" mt={1}>
          Are you sure you want to cancel this appointment?
          <br />
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Keep Appointment
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleCancelAppointment}
        >
          Cancel Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelAppointmentDialog;
