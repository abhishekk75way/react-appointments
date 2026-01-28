import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Drawer,
  Tabs,
  Tab,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home as DashboardIcon,
  People as UsersIcon,
  EventNote as AppointmentsIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { logout } from "@/store/authSlice";

const drawerWidth = 260;

const staffApps = [
  { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { id: "customers", label: "Customers", icon: <UsersIcon />, path: "/staff/customers" },
  { id: "appointments", label: "Appointments", icon: <AppointmentsIcon />, path: "/staff/appointments" },
  { id: "profile", label: "Profile", icon: <ProfileIcon />, path: "/profile/staff" },
  { id: "settings", label: "Settings", icon: <SettingsIcon />, path: "/staff/settings" },
];

const StaffLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getActiveTab = () => {
    const app = staffApps.find((a) => location.pathname.startsWith(a.path));
    return app ? app.id : false;
  };

  const handleTabChange = (tabId: string) => {
    const app = staffApps.find((a) => a.id === tabId);
    if (app) navigate(app.path, { replace: true });
  };

  return (
    <Box sx={styles.root}>
      <Drawer variant="permanent" sx={styles.drawer}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} color="primary">
            Staff Dashboard
          </Typography>
        </Toolbar>

        <Divider />

        <Box sx={styles.tabsBox}>
          <Tabs
            orientation="vertical"
            value={getActiveTab()}
            onChange={(_, newValue) => handleTabChange(newValue)}
            sx={styles.tabs}
            variant="scrollable"
          >
            {staffApps.map((app) => (
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

        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={styles.logoutBtn}>
              <ListItemIcon sx={styles.logoutIcon}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={styles.main}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default StaffLayout;

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

  tabsBox: { px: 1, pt: 2 },

  tabs: {
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
    color: active ? "primary.main" : "text.secondary",
    backgroundColor: active ? "rgba(25,103,210,0.08)" : "transparent",
    borderRadius: 1,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(25,103,210,0.12)",
    },
    "& .MuiTab-iconWrapper": {
      marginRight: 1,
      marginBottom: 0,
    },
  }),

  spacer: { flex: 1 },

  logoutBtn: {
    color: "error.main",
    m: 1,
    borderRadius: 1,
    "&:hover": { backgroundColor: "rgba(211,47,47,0.08)" },
  },

  logoutIcon: { color: "error.main", minWidth: 40 },

  main: {
    flexGrow: 1,
    p: 3,
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  },
};
