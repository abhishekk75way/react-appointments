import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Person, WorkOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signup as signupApi } from "@/services/api";
import { toast } from "react-toastify";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "STAFF",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signupApi(formData);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Typography
            variant="h4"
            fontWeight="900"
            gutterBottom
            letterSpacing={-1}
          >
            Join Us
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Start your booking journey today
          </Typography>

          <Box mb={4}>
            <ToggleButtonGroup
              fullWidth
              value={formData.role}
              exclusive
              onChange={(_, val) =>
                val && setFormData({ ...formData, role: val })
              }
              sx={styles.toggleGroup}
            >
              <ToggleButton value="USER" sx={styles.toggleButton}>
                <Person sx={{ mr: 1 }} /> Client
              </ToggleButton>
              <ToggleButton value="STAFF" sx={styles.toggleButton}>
                <WorkOutline sx={{ mr: 1 }} /> Professional
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loading}
                sx={styles.submitButton}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link onClick={() => navigate("/login")} sx={styles.signInLink}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const styles = {
  mainContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    py: 4,
  },
  paper: {
    p: 5,
    borderRadius: 6,
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
  },
  toggleGroup: { gap: 1 },
  toggleButton: {
    borderRadius: 3,
    border: "1px solid #e2e8f0 !important",
    flex: 1,
    textTransform: "none",
  },
  submitButton: {
    py: 1.5,
    borderRadius: 3,
    fontWeight: 700,
    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
  },
  signInLink: {
    cursor: "pointer",
    fontWeight: 700,
    color: "#6366f1",
    textDecoration: "none",
  },
};
