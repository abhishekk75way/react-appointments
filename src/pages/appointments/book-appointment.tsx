import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import { getServices, getStaff, bookAppointment } from "@/services/api";
import type { Service, User } from "@/libs/types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";

const steps = [
  "Select Service",
  "Select Professional",
  "Choose Time",
  "Confirm",
];

const BookAppointmentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<User[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<User | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesData, staffData] = await Promise.all([
          getServices(),
          getStaff(),
        ]);
        setServices(servicesData);
        setStaffList(staffData);
      } catch (error) {
        toast.error("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleBooking = async () => {
    if (!selectedService || !selectedStaff || !selectedSlot) return;

    setLoading(true);
    try {
      const [year, month, day] = selectedSlot.date.split("-").map(Number);
      const [hour, minute] = selectedSlot.time.split(":").map(Number);
      const startDate = new Date(year, month - 1, day, hour, minute);

      await bookAppointment({
        serviceId: selectedService.id,
        staffId: selectedStaff.id,
        startTime: startDate.toISOString(),
        notes: "Booked via web app",
      });
      toast.success("Appointment booked successfully!");
      navigate("/appointments");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to book appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && activeStep === 0) {
    return (
      <Box className="flex-center" sx={styles.loadingBox}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-4">
      <Typography
        variant="h3"
        fontWeight="800"
        align="center"
        className="text-gradient mb-4"
      >
        Book Your Experience
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel className="mb-6">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper elevation={0} className="glass p-4">
        {activeStep === 0 && (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid size={{ xs: 12, sm: 6 }} key={service.id}>
                <Card
                  className={`premium-card ${selectedService?.id === service.id ? "selected" : ""}`}
                  onClick={() => setSelectedService(service)}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="700">
                      {service.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="mb-2"
                    >
                      {service.description}
                    </Typography>
                    <Box className="flex-between">
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color="primary"
                      >
                        ₹{Number(service.price).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" className="pill">
                        {service.duration} mins
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            {staffList.map((staff) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={staff.id}>
                <Card
                  className={`premium-card text-center ${selectedStaff?.id === staff.id ? "selected" : ""}`}
                  onClick={() => setSelectedStaff(staff)}
                >
                  <CardContent>
                    <Avatar className="avatar-large mx-auto mb-2">
                      {staff.fullName.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight="700">
                      {staff.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Professional Specialist
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {activeStep === 2 && selectedStaff && (
          <AvailabilityCalendar
            staffId={selectedStaff.id}
            onSelectSlot={(date, time) => setSelectedSlot({ date, time })}
            selectedSlot={selectedSlot}
          />
        )}

        {activeStep === 3 && selectedService && selectedStaff && selectedSlot && (
          <Box className="text-center">
            <Typography variant="h5" fontWeight="700" className="mb-3">
              Confirm Booking Details
            </Typography>
            <Divider className="mb-3" />
            <Box className="confirm-grid">
              <Box className="flex-between mb-2">
                <Typography color="text.secondary">Service</Typography>
                <Typography fontWeight="600">{selectedService.name}</Typography>
              </Box>
              <Box className="flex-between mb-2">
                <Typography color="text.secondary">Specialist</Typography>
                <Typography fontWeight="600">
                  {selectedStaff.fullName}
                </Typography>
              </Box>
              <Box className="flex-between mb-2">
                <Typography color="text.secondary">Date & Time</Typography>
                <Typography fontWeight="600">
                  {selectedSlot.date} at {selectedSlot.time}
                </Typography>
              </Box>
              <Box className="flex-between">
                <Typography color="text.secondary">Total Price</Typography>
                <Typography fontWeight="600" color="primary" variant="h6">
                  ₹{Number(selectedService.price).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box className="flex-between mt-6">
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className="btn-text px-4"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleBooking}
              disabled={loading}
              className="btn-primary px-6 py-2"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Confirm & Pay"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !selectedService) ||
                (activeStep === 1 && !selectedStaff) ||
                (activeStep === 2 && !selectedSlot)
              }
              className="btn-primary px-6 py-2"
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default BookAppointmentPage;

const styles = {
  loadingBox: { height: "60vh" },
};
