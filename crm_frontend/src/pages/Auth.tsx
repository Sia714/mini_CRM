import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';

type AuthProps = {
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

const Auth = () => {

    const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
    setFormData({ name: '', email: '', password: '' }); // clear form on switch
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(tab === 0 ? 'Logging in...' : 'Signing up...', formData);
  };
  // LoginButton.tsx

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };





    return(
        <>
            <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 400 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {tab === 1 && (
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 2 }}
            color="primary"
          >
            {tab === 0 ? 'Login' : 'Sign Up'}
          </Button>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          {tab === 0 ? "Don't have an account?" : 'Already registered?'}{' '}
          <span
            style={{ color: '#1976d2', cursor: 'pointer' }}
            onClick={() => setTab(tab === 0 ? 1 : 0)}
          >
            {tab === 0 ? 'Sign up' : 'Login'}
          </span>
        </Typography>
      </Paper>
    </Box>
        </>
    )
}
export default Auth;