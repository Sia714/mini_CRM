import react, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SegmentIcon from "@mui/icons-material/Segment";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {AppProvider} from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import CampaignIcon from "@mui/icons-material/Campaign";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const getNavigation = (user) => [
  { kind: "header", title: "Main" },
  { segment: "", title: "Create Segments", icon: <DashboardIcon /> },
  ...(user
    ? [
 {
          segment: "view-segment",
          title: "View Segments",
          icon: <SegmentIcon />,
        },
        {
          segment: "add-customer",
          title: "Manage Customers",
          icon: <PersonAddIcon />,
        },
        { segment: "add-order", 
          title: "Manage Orders", 
          icon: <ShoppingBagIcon /> },
       
        {
          segment: "campaign",
          title: "Campaign History",
          icon: <CampaignIcon />,
        },
        { segment: "profile", 
          title: "Profile",
          icon: <AccountCircleIcon /> },
      ]
    : []),
];


function Dashboard() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [isLoggedIn, setIsLoggedIn]=useState(false);
  const [photo, setPhoto]=useState();

  const [userData, setUserData] = useState(null);
  const loadUserData = () => {
    fetch(`${API_BASE}/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
  setUserData(details.user);
  setIsLoggedIn(details.loggedIn); // ✅ this will now work properly!
  setPhoto(details.user?.photos[0]?.value || "/profile-placeholder.png");
 
})
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    loadUserData();
  }, []);
 

  
  const navigate = useNavigate();
  const location = useLocation();

  const router = {
    navigate: async (to) => {
      let path = typeof to === "string" ? to : to.toString();
      if (path === "" || path === "/") {
        navigate("/dashboard");
        return;
      }
      if (path.startsWith("/")) path = path.slice(1);
      const finalPath = `${path}`.replace(/\/+/g, "/");
      navigate(finalPath);
    },
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
  };

  const handleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleLogout = () => {
    window.location.href = `${API_BASE}/auth/logout`;
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Dialog open={isLoggedIn}>
        <DialogTitle>Login required</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText>▶ Login to access this page</ListItemText>
            </ListItem>
          </List>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleLogin}>
            Login
          </Button>
        </DialogActions>
      </Dialog>

      <AppProvider
        navigation={getNavigation(userData)}
        router={router}
        theme={demoTheme}
      >
        <Box
          sx={{
            position: "fixed",
            top: 5,
            right: 24,
            zIndex: 1210,
          }}
        >
          {isLoggedIn ? (
            <>
              <IconButton onClick={handleClick}>
                <Avatar
                  alt="User"
                  src={photo}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="outlined" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Box>
        <DashboardLayout>
          <PageContainer
            className={userData ? "app-wrapper" : "app-wrapper blurred"}
            sx={{
              width: "120%",
              margin: "0 auto",
              padding: "2rem",
            }}
          >
            <Box
              sx={{
                position: "fixed",
                top: 13,
                left: 70,
                zIndex: 1210,
                backgroundColor: "white",
              }}
            >
              <Typography variant="h4" color="#1976d2">
                {" "}
                Mini CRM By Sayjan
              </Typography>
            </Box>
            <Outlet />
          </PageContainer>
        </DashboardLayout>
      </AppProvider>
    </>
  );
}

export default Dashboard;
