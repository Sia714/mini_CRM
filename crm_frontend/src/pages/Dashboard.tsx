import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import ViewSegments from "../components/viewSegments";
import { Grid } from "@mui/material";
import { IconButton, Avatar, Menu, MenuItem, Button,Box,Typography,  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText, } from "@mui/material";
import AddNewCustomer from "../components/addNewCustomer";
import AddNewOrder from "../components/addNewOrder";
import { createTheme, styled } from "@mui/material/styles";
import SegmentCampaign from "../components/segmentCampaign";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider,type Navigation, type NavigationItem} from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Campaign from "../components/campaign";

// type MyNavItem = {
//   kind?: string;
//   title: string;
//   icon?: React.ReactNode;
//   url?: string;
// };
const getNavigation = (user: any): NavigationItem[] => [
  { kind: "header" as const, title: "Main" },
  { segment: "", title: "Dashboard", icon: <DashboardIcon /> },
  ...(user ? [
    { segment: "add-customer", title: "Add Customer", icon: <ShoppingCartIcon /> },
    { segment: "add-order", title: "Add Order", icon: <LayersIcon /> },
    { kind: "header" as const, title: "Segments" },
    { segment: "view-segment", title: "View Segments", icon: <BarChartIcon /> },
    { kind: "header" as const, title: "Campaigns" },
    { segment: "campaign", title: "Campaign History", icon: <BarChartIcon /> },
  ] : []),
];

const demoTheme = createTheme(
//   {
//   colorSchemes: { light: true, dark: true },
//   cssVariables: {
//     colorSchemeSelector: "class",
//   },
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 600,
//       lg: 1200,
//       xl: 1536,
//     },
//   },
// }
);



type DashboardProps = {
  user: any; // or a more specific type if you have one
};

function Dashboard({ user }: DashboardProps) {
  
  const API_BASE = import.meta.env.VITE_API_BASE;
type user={
  name:String,
  email:String,
  photo: URL,
}
  const [userData,setUserData]=useState<user|null>();
   const loadUserData=()=>{
      fetch(`${API_BASE}/auth/me`, { credentials: 'include',})
          .then(res=>res.json())
          .then(details=>{
              setUserData(details||[]);
          })
           .catch((err) => console.error(err));
    }
     useEffect(()=>{
      loadUserData();
      
    },[])
    const navigate = useNavigate();
const location = useLocation();

const router = {
  navigate: async (to: string | URL) => {
    let path = typeof to === "string" ? to : to.toString();
    if (path === "" || path === "/") {
      navigate("/dashboard");
      return;
    }
    if (path.startsWith("/")) path = path.slice(1);
    const finalPath = `${path}`.replace(/\/+/g, '/');
    navigate(finalPath);
  },
  pathname: location.pathname,
  searchParams: new URLSearchParams(location.search),
};


  
    const handleLogin = () => {
    window.location.href =`${API_BASE}/auth/google`;
  };

  const handleLogout = () => {
    fetch(`${API_BASE}/auth/logout`)
    .then(() => {
      setUserData(null);
    })
    .catch(err => console.error(err));
  };
  useEffect(() => {
    loadUserData();
  },[]);
  const login = Boolean(userData && Object.keys(userData).length > 0);



  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  
  return (
    <>
    <Dialog open={!login}>
        <DialogTitle>Login required</DialogTitle>
        <DialogContent>
          <List>
             <ListItem>
              <ListItemText>
                ▶ Login to access this page
              </ListItemText>
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
  navigation={getNavigation(user) as Navigation}
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
      
      {login ?(
        <>
          <IconButton onClick={handleClick}>
            <Avatar alt="User" src="/profile-placeholder.png" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleClose}>Your Campaigns</MenuItem>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
          </>
        ):(  <Button variant="outlined" onClick={handleLogin}>
          Login
        </Button>)}
      
    </Box>
    <DashboardLayout >
     <PageContainer
  className={user ? "app-wrapper" : "app-wrapper blurred"}
  sx={{
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    overflowX: "hidden",
    boxSizing: "border-box",
  }}
>
  <Outlet />


</PageContainer>

      </DashboardLayout>
    </AppProvider>
    </>
  );
}

export default Dashboard;
