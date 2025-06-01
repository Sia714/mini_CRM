import { Navigate } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import {
  CircularProgress,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';

type ProtectedRouteProps = {
  user: any;        // null (unknown), false (not logged in), or user object
  children: ReactNode;
};

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  // If user state is still `null`, we can render a loading indicator:
  if (user === null) {

    return (
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <CircularProgress></CircularProgress>
      </Paper>);
  }

  // If user is explicitly false (unauthorized), redirect immediately:
 

  // Otherwise: user is truthy → render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
