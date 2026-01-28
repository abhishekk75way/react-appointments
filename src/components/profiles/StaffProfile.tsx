import {
  Container,
  Typography,
  Stack,
  Avatar,
  Button,
  Box,
  Paper,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Tabs,
  Tab,
  Card,
  CardContent,
  Checkbox,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { User, Availability, Service } from "@/libs/types";
import { getProfile, getAvailability, getServices } from "@/services/api";
import { toast } from "react-toastify";
import { AccessTime, CalendarMonth, Save, MedicalServices, Person, Schedule } from "@mui/icons-material";

const DAYS = [
  { id: 1, label: "Monday" },
  { id: 2, label: "Tuesday" },
  { id: 3, label: "Wednesday" },
  { id: 4, label: "Thursday" },
  { id: 5, label: "Friday" },
  { id: 6, label: "Saturday" },
  { id: 0, label: "Sunday" },
];

const StaffProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [availability, setAvailability] = useState<Partial<Availability>[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAvail, setSavingAvail] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [staffServices, setStaffServices] = useState<string[]>([]);
  const [savingServices, setSavingServices] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
        if (profile.role === "STAFF" || profile.role === "ADMIN") {
          const [avail, allServices] = await Promise.all([
            getAvailability(profile.id),
            getServices(),
          ]);
          setAvailability(avail);
          setServices(allServices);
          
          const storedServices = localStorage.getItem(`staff-services-${profile.id}`);
          setStaffServices(storedServices ? JSON.parse(storedServices) : []);
        }
      } catch (error) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddDay = () => {
    setAvailability([
      ...availability,
      { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const handleUpdateDay = (
    index: number,
    field: keyof Availability,
    value: string | number,
  ) => {
    const newAvail = [...availability];
    newAvail[index] = { ...newAvail[index], [field]: value };
    setAvailability(newAvail);
  };

  const handleRemoveDay = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSaveAvailability = async () => {
    setSavingAvail(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (user) {
        const { setStaffAvailability } = await import("@/libs/data");
        setStaffAvailability(user.id, availability);
      }
      
      toast.success("Availability updated successfully");
    } catch (error) {
      toast.error("Failed to save availability");
    } finally {
      setSavingAvail(false);
    }
  };

  const handleToggleService = (serviceId: string) => {
    setStaffServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSaveServices = async () => {
    if (!user) return;
    setSavingServices(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.setItem(`staff-services-${user.id}`, JSON.stringify(staffServices));
      
      toast.success("Services updated successfully");
    } catch (error) {
      toast.error("Failed to save services");
    } finally {
      setSavingServices(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Paper elevation={0} sx={styles.headerPaper}>
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Avatar sx={styles.avatar}>{user?.fullName?.charAt(0)}</Avatar>
          <Box flex={1}>
            <Typography variant="h4" fontWeight="800">
              {user?.fullName}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={0} sx={styles.tabsPaper}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={styles.tabs}
        >
          <Tab icon={<Person />} label="Profile" iconPosition="start" />
          <Tab icon={<Schedule />} label="Working Hours" iconPosition="start" />
          <Tab icon={<MedicalServices />} label="My Services" iconPosition="start" />
        </Tabs>

        {currentTab === 0 && (
          <Box sx={styles.tabContent}>
            <Typography variant="h6" fontWeight="700" mb={3}>
              Personal Information
            </Typography>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                value={user?.fullName || ""}
                onChange={(e) =>
                  user && setUser({ ...user, fullName: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Email"
                value={user?.email || ""}
                disabled
                fullWidth
              />
              <TextField
                label="Phone Number"
                value={user?.phoneNumber || ""}
                onChange={(e) =>
                  user && setUser({ ...user, phoneNumber: e.target.value })
                }
                placeholder="Add phone number"
                fullWidth
              />
            </Stack>
            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
              <Button 
                variant="text" 
                color="error" 
                onClick={() => {
                  if (window.confirm("This will reset all your appointments, services, and profile changes to defaults. Are you sure?")) {
                    localStorage.clear();
                    window.location.href = "/login";
                  }
                }}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Reset System Data
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={async () => {
                  if (!user) return;
                  try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    const { updateUser } = await import("@/libs/data");
                    updateUser(user.id, {
                      fullName: user.fullName,
                      phoneNumber: user.phoneNumber,
                    });
                    
                    localStorage.setItem("user", JSON.stringify(user));
                    
                    toast.success("Profile details updated");
                  } catch (e) {
                    toast.error("Failed to update profile");
                  }
                }}
                sx={styles.saveButton}
              >
                Save Profile
              </Button>
            </Box>
          </Box>
        )}

        {currentTab === 1 && (
          <Box sx={styles.tabContent}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Typography variant="h6" fontWeight="700">
                Set Your Availability
              </Typography>
              <Box gap={2} display="flex">
                <Button
                  variant="outlined"
                  startIcon={<CalendarMonth />}
                  onClick={() =>
                    setAvailability([
                      ...availability,
                      {
                        date: new Date().toISOString(),
                        startTime: "09:00",
                        endTime: "17:00",
                      },
                    ])
                  }
                  sx={styles.addDayButton}
                >
                  Add Date
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AccessTime />}
                  onClick={handleAddDay}
                  sx={styles.addDayButton}
                >
                  Add Weekly Day
                </Button>
              </Box>
            </Box>

            <Stack spacing={3}>
              {availability.map((avail, index) => (
                <Box key={index} sx={styles.availabilityItem}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      {avail.date ? (
                        <TextField
                          fullWidth
                          size="small"
                          label="Date"
                          type="date"
                          value={
                            avail.date
                              ? new Date(avail.date).toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handleUpdateDay(
                              index,
                              "date",
                              new Date(e.target.value).toISOString(),
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      ) : (
                        <FormControl fullWidth size="small">
                          <InputLabel>Day</InputLabel>
                          <Select
                            value={avail.dayOfWeek}
                            label="Day"
                            onChange={(e) =>
                              handleUpdateDay(index, "dayOfWeek", e.target.value)
                            }
                          >
                            {DAYS.map((day) => (
                              <MenuItem key={day.id} value={day.id}>
                                {day.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="From"
                        type="time"
                        value={avail.startTime}
                        onChange={(e) =>
                          handleUpdateDay(index, "startTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="To"
                        type="time"
                        value={avail.endTime}
                        onChange={(e) =>
                          handleUpdateDay(index, "endTime", e.target.value)
                        }
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                      <Button
                        color="error"
                        fullWidth
                        onClick={() => handleRemoveDay(index)}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              {availability.length === 0 && (
                <Typography align="center" color="text.secondary" py={4}>
                  No availability set. Add working days to appear in searches.
                </Typography>
              )}
            </Stack>

            <Box mt={6} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveAvailability}
                disabled={savingAvail}
                sx={styles.saveButton}
              >
                {savingAvail ? "Saving..." : "Save Availability"}
              </Button>
            </Box>
          </Box>
        )}

        {currentTab === 2 && (
          <Box sx={styles.tabContent}>
            <Typography variant="h6" fontWeight="700" mb={2}>
              Select Services You Provide
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Choose which services you offer to clients. This will determine which bookings you can accept.
            </Typography>

            {services.length === 0 ? (
              <Box sx={styles.emptyState}>
                <MedicalServices sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography color="text.secondary">
                  No services available. Contact your administrator to add services.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {services.map((service) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={service.id}>
                    <Card
                      sx={{
                        ...styles.serviceCard,
                        ...(staffServices.includes(service.id) && styles.serviceCardSelected),
                      }}
                      onClick={() => handleToggleService(service.id)}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          <Checkbox
                            checked={staffServices.includes(service.id)}
                            onChange={() => handleToggleService(service.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight="700" mb={1}>
                              {service.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={2}
                            >
                              {service.description}
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center">
                              <Chip
                                label={`₹${Number(service.price).toFixed(2)}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={`${service.duration} mins`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {staffServices.length} service{staffServices.length !== 1 ? 's' : ''} selected
              </Typography>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveServices}
                disabled={savingServices}
                sx={styles.saveButton}
              >
                {savingServices ? "Saving..." : "Save Services"}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StaffProfile;

const styles = {
  container: { py: 4 },
  headerPaper: { 
    p: 3, 
    borderRadius: 4, 
    mb: 3, 
    border: "1px solid #e2e8f0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "black",
  },
  avatar: {
    width: 80,
    height: 80,
    bgcolor: "rgba(255,255,255,0.2)",
    fontSize: "2rem",
    fontWeight: "800",
    border: "3px solid rgba(255,255,255,0.3)",
  },
  tabsPaper: {
    borderRadius: 4,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  tabs: {
    borderBottom: "1px solid #e2e8f0",
    px: 2,
    "& .MuiTab-root": {
      minHeight: 64,
      textTransform: "none",
      fontSize: "1rem",
      fontWeight: 600,
    },
  },
  tabContent: {
    p: 4,
  },
  addDayButton: { borderRadius: 2 },
  availabilityItem: {
    p: 3,
    borderRadius: 3,
    bgcolor: "#f8fafc",
    border: "1px solid #f1f5f9",
  },
  saveButton: {
    borderRadius: 3,
    px: 6,
    py: 1.5,
    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
    "&:hover": {
      background: "linear-gradient(45deg, #5558e3, #7c4ddb)",
    },
  },
  serviceCard: {
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid #e2e8f0",
    "&:hover": {
      borderColor: "#8b5cf6",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
    },
  },
  serviceCardSelected: {
    borderColor: "#8b5cf6",
    bgcolor: "#f5f3ff",
  },
  emptyState: {
    textAlign: "center",
    py: 8,
    bgcolor: "#f8fafc",
    borderRadius: 3,
  },
};

