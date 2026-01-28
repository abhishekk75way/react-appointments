import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Home as DashboardIcon,
  People as UsersIcon,
  EventNote as AppointmentsIcon,
  Group as StaffIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
} from "@mui/icons-material";
import { logout } from "@/store/authSlice";

const drawerWidth = 240;

const adminApps = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
  },
  {
    id: "users",
    label: "Users",
    icon: <UsersIcon />,
    path: "/staff/users",
  },
  {
    id: "staff",
    label: "Staff",
    icon: <StaffIcon />,
    path: "/staff",
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: <AppointmentsIcon />,
    path: "/admin/appointments",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon />,
    path: "/admin/settings",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <ProfileIcon />,
    path: "/profile/staff",
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getActiveTab = () => {
    const found = adminApps.find((app) => location.pathname.startsWith(app.path));
    return found ? found.id : false;
  };

  const handleTabChange = (appId: string) => {
    const app = adminApps.find((a) => a.id === appId);
    if (app) navigate(app.path, { replace: true });
  };

  return (
    <Box sx={styles.root}>
      <Drawer variant="permanent" sx={styles.drawer}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700} color="primary">
            Appointment Admin
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
            {adminApps.map((app) => (
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

        <Divider sx={styles.divider} />
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

export default AdminLayout;

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
  divider: { mb: 1 },

  logoutBtn: {
    color: "error.main",
    m: 1,
    borderRadius: 1,
    "&:hover": {
      backgroundColor: "rgba(211,47,47,0.08)",
    },
  },

  logoutIcon: { color: "error.main", minWidth: 40 },

  main: {
    flexGrow: 1,
    p: 3,
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  },
};
