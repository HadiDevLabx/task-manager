import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  TextField, Button, Container, Typography, Box, 
  CssBaseline, Grid, Link, CircularProgress, Alert 
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';  
import loginSvg from '../assets/task.svg';  

import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';
import axios from 'axios';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, message: '', severity: '' });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, data);
      const { user } = response.data;

      localStorage.setItem('user', JSON.stringify(user));

      setAlert({ show: true, message: 'Login successful!', severity: 'success' });
      setLoading(false);

      navigate('/home');
    } catch (error) {
      let errorMessage = 'Login failed!';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setAlert({ show: true, message: errorMessage, severity: 'error' });
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Task Management
        </Typography>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <img src={loginSvg} alt="Login" style={{ width: '80%', height: 'auto' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box p={4} bgcolor="background.paper" borderRadius={4} boxShadow={3} style={{ width: '100%', maxWidth: '450px', height: 'auto' }}>
              <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                Login
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="filled"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Password"
                      variant="filled"
                      {...register('password', {
                        required: 'Password is required',
                      })}
                      error={!!errors.password}
                      helperText={errors.password ? errors.password.message : ''}
                    />
                  </Grid>
                </Grid>
                <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                  <Button variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                  </Button>
                  {alert.show && (
                    <Box mt={2} width="100%">
                      <Alert severity={alert.severity} onClose={() => setAlert({ show: false, message: '', severity: '' })}>
                        {alert.message}
                      </Alert>
                    </Box>
                  )}
                </Box>
              </form>
              <Box mt={2} display="flex" justifyContent="center">
                <Typography variant="body2" color="textSecondary">
                  Don't have an account? <Link href="/register" color="primary">Register</Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
