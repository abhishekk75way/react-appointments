import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { getAvailability, getStaffAppointments } from "@/services/api";
import type { Availability } from "@/libs/types";

interface Props {
  staffId: string;
  onSelectSlot: (date: string, time: string) => void;
  selectedSlot: { date: string; time: string } | null;
}

const AvailabilityCalendar: React.FC<Props> = ({
  staffId,
  onSelectSlot,
  selectedSlot,
}) => {
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [bookedSlots, setBookedSlots] = useState<
    { startTime: string; endTime: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [avail, appointments] = await Promise.all([
          getAvailability(staffId),
          getStaffAppointments(staffId),
        ]);
        setAvailability(avail);
        setBookedSlots(appointments);
      } catch (error) {
        console.error("Failed to fetch calendar data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [staffId]);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const getSlotsForDay = (date: Date) => {
    const dateString = formatDate(date);
    const specificAvailability = availability.filter((a) => {
    
      if (a.date) {
        try {
          return new Date(a.date).toISOString().split("T")[0] === dateString;
        } catch (e) {
          return false;
        }
      }
      return false;
    });


    const dayOfWeek = date.getDay();
    const weeklyAvailability = availability.filter(
      (a) => !a.date && a.dayOfWeek === dayOfWeek,
    );

    const activeAvailability =
      specificAvailability.length > 0 ? specificAvailability : weeklyAvailability;

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const slots: { time: string; available: boolean; booked?: boolean }[] = [];

    activeAvailability.forEach((a) => {
      let current = a.startTime;
      const end = a.endTime;

      while (current < end) {
        const [h, m] = current.split(":").map(Number);
        const slotDate = new Date(date);
        slotDate.setHours(h, m, 0, 0);

        let available = true;
        let booked = false;

        // 1. Past check
        if (isToday && slotDate < now) {
          available = false;
        }

        // 2. Booking check
        if (available) {
          const isBooked = bookedSlots.some((b) => {
            const bStart = new Date(b.startTime);
            const bEnd = new Date(b.endTime);
            // If slot start time falls within a booking
            return slotDate >= bStart && slotDate < bEnd;
          });
          if (isBooked) {
            available = false;
            booked = true;
          }
        }

        slots.push({ time: current, available, booked });

        const nextM = m + 30;
        const nextH = h + Math.floor(nextM / 60);
        current = `${String(nextH).padStart(2, "0")}:${String(nextM % 60).padStart(2, "0")}`;
      }
    });

    // Sort slots by time
    return slots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    <Box>
      <Box sx={styles.header}>
        <Typography variant="h6" fontWeight="700">
          Select Date & Time
        </Typography>
        <Box>
          <IconButton disabled>
            <ChevronLeft />
          </IconButton>
          <IconButton disabled>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box className="date-scroll-container">
        {dates.map((date) => {
          const isSelected = formatDate(date) === formatDate(selectedDate);
          return (
            <Box
              key={date.toString()}
              onClick={() => setSelectedDate(date)}
              className={`date-item ${isSelected ? "selected" : ""}`}
            >
              <Typography
                variant="caption"
                sx={styles.dateWeekday}
              >
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </Typography>
              <Typography variant="h6" fontWeight="700">
                {date.getDate()}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {loading ? (
        <Box sx={styles.loadingBox}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={styles.slotsContainer}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={styles.slotsTitle}
          >
            Available Slots (Timezone: Local)
          </Typography>
          <Grid container spacing={1}>
            {getSlotsForDay(selectedDate).map((slot) => {
              const isSelected =
                selectedSlot?.date === formatDate(selectedDate) &&
                selectedSlot?.time === slot.time;
              return (
                <Grid size={{ xs: 4, sm: 3, md: 2 }} key={slot.time}>
                  <button
                    disabled={!slot.available}
                    className={`slot-button ${isSelected ? "selected" : ""} ${!slot.available ? "disabled" : ""}`}
                    onClick={() =>
                      slot.available &&
                      onSelectSlot(formatDate(selectedDate), slot.time)
                    }
                    style={{
                      opacity: slot.available ? 1 : 0.5,
                      cursor: slot.available ? "pointer" : "not-allowed",
                      textDecoration: slot.booked ? "line-through" : "none",
                    }}
                  >
                    {slot.time}
                  </button>
                </Grid>
              );
            })}
            {getSlotsForDay(selectedDate).length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Box sx={styles.noSlotsBox}>
                  <Typography color="text.secondary" variant="body1">
                    No slots available for{" "}
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                    .
                  </Typography>
                  <Typography color="text.secondary" variant="caption">
                    {availability.length === 0
                      ? "This professional hasn't set their working hours yet."
                      : "Try selecting a different day or professional."}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default AvailabilityCalendar;

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3,
  },
  dateWeekday: { textTransform: "uppercase", fontWeight: 600 },
  loadingBox: { display: "flex", justifyContent: "center", py: 4 },
  slotsContainer: { mt: 4 },
  slotsTitle: { mb: 2 },
  noSlotsBox: {
    py: 6,
    textAlign: "center",
    bgcolor: "rgba(0,0,0,0.02)",
    borderRadius: 3,
  },
};
