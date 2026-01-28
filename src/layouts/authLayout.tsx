import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Home as DashboardIcon,
  EventNote as AppointmentsIcon,
  AddCircle as BookIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import React, { Suspense, useState } from "react";
import { logout } from "@/store/authSlice";
import { type RootState } from "@/store";
import theme from "@/styles/theme";
import { useDispatch, useSelector } from "react-redux";

const drawerWidth = 240;

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const apps = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { id: "appointments", label: "Appointments", icon: <AppointmentsIcon />, path: "/appointments" },
    ...(user?.role === 'STAFF' 
      ? [{ id: "availability", label: "My Availability", icon: <BookIcon />, path: "/profile/staff" }]
      : [{ id: "book", label: "Book Appointment", icon: <BookIcon />, path: "/book" }]
    ),
    { id: "profile", label: "Profile", icon: <ProfileIcon />, path: "/profile/user" },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogoutClick = () => { handleMenuClose(); handleLogout(); };

  const getActiveTab = () => {
    const found = apps.find((a) => location.pathname.startsWith(a.path));
    return found ? found.id : false;
  };

  const handleTabChange = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (app) navigate(app.path, { replace: true });
  };

  return (
    <Box sx={styles.root}>
      <Drawer variant="permanent" sx={styles.drawer}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} color="primary">
            Appointments
          </Typography>
        </Toolbar>
        <Divider />
        <Box sx={styles.appsBox}>
          <Tabs
            value={getActiveTab()}
            onChange={(_, newValue) => handleTabChange(newValue)}
            orientation="vertical"
            variant="scrollable"
            sx={styles.tabs}
          >
            {apps.map((app) => (
              <Tab
                key={app.id}
                label={app.label}
                value={app.id}
                icon={app.icon}
                iconPosition="start"
                sx={styles.tab(getActiveTab() === app.id)}
              />
            ))}
          </Tabs>
        </Box>
        <Box sx={styles.spacer} />
      </Drawer>

      <Box component="main" sx={styles.main}>
        <Box sx={styles.topBar}>
          <IconButton onClick={handleMenuOpen} sx={styles.profileBtn}>
            <Avatar sx={styles.avatar}>{user?.email?.[0]?.toUpperCase() || "U"}</Avatar>
            <Box sx={styles.userInfoBox}>
              <Typography variant="body2" fontWeight={600}>
                {user?.email?.split("@")[0] || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || "user@example.com"}
              </Typography>
            </Box>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: styles.menuPaper }}
          >
            <MenuItem disabled sx={styles.menuProfileInfo}>
              <Stack spacing={0.5} sx={styles.menuProfileStack}>
                <Typography variant="body2" fontWeight={600}>
                  {user?.email?.split("@")[0] || "User"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || "user@example.com"}
                </Typography>
              </Stack>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogoutClick} sx={styles.logoutItem}>
              <ListItemIcon sx={styles.logoutIcon}><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={styles.contentBox}>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLayout;

const styles = {
  root: { display: "flex" },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#f8f9fa",
      borderRight: "1px solid #e0e0e0",
      display: "flex",
      flexDirection: "column",
    },
  },
  appsBox: { px: 1, pt: 2 },
  tabs: {
    mt: 1,
    "& .MuiTabs-indicator": {
      left: 0,
      width: 4,
      backgroundColor: "primary.main",
    },
  },
  tab: (active: boolean) => ({
    justifyContent: "flex-start",
    px: 2,
    py: 1.5,
    textAlign: "left",
    minHeight: "auto",
    color: active ? "primary.main" : "text.secondary",
    backgroundColor: active ? "rgba(25, 103, 210, 0.08)" : "transparent",
    borderRadius: 1,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(25, 103, 210, 0.12)",
    },
    "& .MuiTab-iconWrapper": { marginRight: 1, marginBottom: 0 },
  }),
  spacer: { flex: 1 },
  main: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  },
  topBar: {
    p: 2,
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    p: 1,
    borderRadius: 1.5,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "transparent",
    transition: "all 0.2s ease",
    "&:hover": { backgroundColor: theme.palette.action.hover },
  },
  avatar: { width: 32, height: 32, backgroundColor: theme.palette.primary.main, fontSize: 14, fontWeight: 600 },
  userInfoBox: { textAlign: "left", display: { xs: "none", sm: "flex" }, flexDirection: "column", gap: 0.25 },
  menuPaper: { minWidth: 240, mt: 1, border: `1px solid ${theme.palette.divider}`, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
  menuProfileInfo: { py: 1.5, px: 2 },
  menuProfileStack: { width: "100%" },
  logoutItem: { color: "error.main", "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.08)" } },
  logoutIcon: { color: "error.main" },
  contentBox: { p: 3, flex: 1, overflow: "auto" },
};
