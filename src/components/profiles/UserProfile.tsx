import {
  Container,
  Typography,
  Stack,
  Avatar,
  Button,
  TextField,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Grid,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { User } from "@/libs/types";
import { getProfile } from "@/services/api";
import { toast } from "react-toastify";
import { Person, Email, Phone } from "@mui/icons-material";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { updateUser } = await import("@/libs/data");
      updateUser(user.id, {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      });
      
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  if (!user)
    return (
      <Typography sx={{ mt: 4 }} align="center">
        Profile not found
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Paper elevation={0} sx={styles.paper}>
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar sx={styles.avatar}>
            {user.fullName?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="800">
              {user.fullName}
            </Typography>
            <Box display="flex" gap={1} mt={0.5}>
              <Chip label={user.role} size="small" sx={styles.chip} />
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user.createdAt || "").getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={styles.divider} />

        <Grid container spacing={4} sx={styles.grid}>
          <Box sx={styles.contentBox}>
            <Typography variant="h6" fontWeight="700" mb={3}>
              Personal Information
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={user.fullName}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <Person sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={styles.textField}
              />
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                disabled
                value={user.email}
                InputProps={{
                  startAdornment: (
                    <Email sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={styles.textField}
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                value={user.phoneNumber || ""}
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <Phone sx={{ color: "text.secondary", mr: 1 }} />
                  ),
                }}
                sx={styles.textField}
              />
            </Stack>

            <Box sx={styles.buttonBox}>
              <Button 
                variant="text" 
                color="error" 
                onClick={() => {
                  if (window.confirm("This will reset all your appointments, services, and profile changes to defaults. Are you sure?")) {
                    localStorage.clear();
                    window.location.href = "/login";
                  }
                }}
                sx={styles.resetButton}
              >
                Reset System Data
              </Button>
              <Box flex={1} />
              <Button variant="outlined" sx={styles.cancelButton}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={styles.saveButton}
              >
                {saving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;

const styles = {
  container: { py: 4 },
  paper: {
    p: 4,
    borderRadius: 4,
    border: "1px solid #e2e8f0",
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
  },
  avatar: {
    width: 100,
    height: 100,
    bgcolor: "#6366f1",
    fontSize: "2rem",
    fontWeight: "800",
  },
  chip: { bgcolor: "#f1f5f9", fontWeight: 700, color: "#6366f1" },
  divider: { mb: 4 },
  grid: { display: "flex" },
  contentBox: { width: "100%" },
  textField: { "& .MuiOutlinedInput-root": { borderRadius: 3 } },
  buttonBox: { mt: 5, display: "flex", justifyContent: "flex-end", gap: 2 },
  cancelButton: { borderRadius: 3, px: 4 },
  saveButton: {
    borderRadius: 3,
    px: 6,
    py: 1.2,
    background: "linear-gradient(45deg, #6366f1, #8b5cf6)",
  },
  resetButton: {
    borderRadius: 3,
    textTransform: "none",
    fontWeight: 600,
  }
};
