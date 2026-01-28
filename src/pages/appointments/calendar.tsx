import AvailabilityCalendar from "@/components/calendar/AvailabilityCalendar";
import { Typography, Stack, Box, Paper, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { useState, useEffect } from "react";
import type { User } from "@/libs/types";

const AppointmentCalendarPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  if (!user) return null;

  const [staffList, setStaffList] = useState<User[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  useEffect(() => {
    if (user && user.role === "USER") {
      import("@/services/api").then(({ getStaff }) => {
        getStaff().then(setStaffList).catch(console.error);
      });
    }
  }, [user]);

  if (!user) return null;

  if (user.role !== "STAFF" && user.role !== "ADMIN") {
    return (
      <Stack spacing={3} sx={styles.container}>
        <Box>
          <Typography variant="h4" fontWeight="800">
            Check Availability
          </Typography>
          <Typography color="text.secondary">
            Select a professional to view their available slots.
          </Typography>
        </Box>

        <Paper sx={styles.paper}>
          {!selectedStaffId ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Choose a Professional
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {staffList.map((staff) => (
                  <Button
                    key={staff.id}
                    variant="outlined"
                    onClick={() => setSelectedStaffId(staff.id)}
                    sx={styles.staffButton}
                  >
                    <Typography fontWeight="700">{staff.fullName}</Typography>
                  </Button>
                ))}
                {staffList.length === 0 && (
                  <Typography>No professionals found.</Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Button onClick={() => setSelectedStaffId("")} sx={styles.backButton}>
                &larr; Back to List
              </Button>
              <AvailabilityCalendar
                staffId={selectedStaffId}
                selectedSlot={selectedSlot}
                onSelectSlot={(date, time) => setSelectedSlot({ date, time })}
              />
            </Box>
          )}
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} sx={styles.container}>
      <Box>
        <Typography variant="h4" fontWeight="800">
          My Availability Preview
        </Typography>
        <Typography color="text.secondary">
          This is how clients see your schedule. Past slots are hidden.
        </Typography>
      </Box>
      <Paper sx={styles.paper}>
        <AvailabilityCalendar
          staffId={user.id}
          selectedSlot={selectedSlot}
          onSelectSlot={(date, time) => setSelectedSlot({ date, time })}
        />
      </Paper>
    </Stack>
  );
};

export default AppointmentCalendarPage;

const styles = {
  container: { maxWidth: 1100, mx: "auto", py: 4 },
  paper: { p: 4, borderRadius: 4 },
  staffButton: {
    borderRadius: 2,
    p: 2,
    display: "flex",
    flexDirection: "column",
    minWidth: 120,
  },
  backButton: { mb: 2 },
};
