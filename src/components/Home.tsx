import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={styles.wrapper}>
        <Stack spacing={4}>
          <Typography variant="h3" fontWeight={700} sx={styles.heading}>
            Welcome to Scheduler
          </Typography>

          <Typography sx={styles.subText}>
            Manage appointments and scheduling effortlessly for clinics, salons, or coworking spaces.
            Book, track, and reschedule appointments all in one place.
          </Typography>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Button
              size="large"
              variant="contained"
              sx={styles.continueBtn}
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>

            <Button
              size="large"
              variant="outlined"
              sx={styles.learnBtn}
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

const styles = {
  wrapper: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    animation: "fadeIn 0.8s ease-in-out",
    "@keyframes fadeIn": {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  },
  heading: {
    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subText: {
    color: "text.secondary",
    maxWidth: 500,
    mx: "auto",
  },
  continueBtn: {
    px: 4,
    py: 1.2,
    fontWeight: 600,
    background: "linear-gradient(135deg, #1976d2, #42a5f5)",
    boxShadow: "0 8px 20px rgba(25,118,210,0.35)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 25px rgba(25,118,210,0.45)",
    },
  },
  learnBtn: {
    px: 4,
    py: 1.2,
    fontWeight: 600,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "action.hover",
      transform: "translateY(-2px)",
    },
  },
};
