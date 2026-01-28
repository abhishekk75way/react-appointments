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
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginApi } from "@/services/api";
import { setCredentials } from "@/store/authSlice";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      dispatch(setCredentials(data));
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.avatarBox}>
            <LockOutlined sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant="h4"
            fontWeight="900"
            gutterBottom
            letterSpacing={-1}
          >
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Welcome back to your scheduling hub
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Box>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    sx: styles.passwordInput,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() =>
                      toast.info("Password reset feature coming soon!")
                    }
                    sx={styles.forgotPasswordLink}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </Box>

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
                  "Sign In"
                )}
              </Button>
            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                onClick={() => navigate("/signup")}
                sx={styles.createAccountLink}
              >
                Create Account
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
  avatarBox: {
    width: 60,
    height: 60,
    bgcolor: "#e0e7ff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mx: "auto",
    mb: 3,
    color: "#6366f1",
  },
  passwordInput: {
    borderRadius: 3,
  },
  forgotPasswordLink: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: 600,
  },
  submitButton: {
    py: 1.5,
    borderRadius: 3,
    fontWeight: 700,
    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.4)",
  },
  createAccountLink: {
    cursor: "pointer",
    fontWeight: 700,
    color: "#6366f1",
    textDecoration: "none",
  },
};
