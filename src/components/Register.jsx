import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  TextField, Button, Container, Typography, Box, 
  CssBaseline, Grid, Link, CircularProgress, Alert 
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme'; 
import taskSvg from '../assets/task.svg'; 
import axios from 'axios';
import { API_URL } from '../constants';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: '' });

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
      console.log(data);
      const response = await axios.post(`${API_URL}/api/auth/register`, data);
      console.log(response);

      setAlert({ show: true, message: response.data.message || 'Registration successful!', severity: 'success' });
      setLoading(false);
    } catch (error) {
      let errorMessage = 'Registration failed!';
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('Email is already registered but not verified')) {
          errorMessage = 'Email is already registered but not verified. A new verification email has been sent.';
        } else if (error.response.data.message.includes('Email is already registered')) {
          errorMessage = 'Email is already registered.';
        } else {
          errorMessage = error.response.data.message;
        }
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
              <img src={taskSvg} alt="Task" style={{ width: '80%', height: 'auto' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box p={4} bgcolor="background.paper" borderRadius={4} boxShadow={3} style={{ width: '100%', maxWidth: '450px', height: 'auto' }}>
              <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                Register
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="filled"
                      {...register('firstName', { required: 'First Name is required' })}
                      error={!!errors.firstName}
                      helperText={errors.firstName ? errors.firstName.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="filled"
                      {...register('lastName', { required: 'Last Name is required' })}
                      error={!!errors.lastName}
                      helperText={errors.lastName ? errors.lastName.message : ''}
                    />
                  </Grid>
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
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters long',
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&amp;]{6,}$/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                         },
                      })}
                      error={!!errors.password}
                      helperText={errors.password ? errors.password.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm Password"
                      variant="filled"
                      {...register('confirmPassword', {
                        required: 'Confirm Password is required',
                        validate: (value) => value === watch('password') || 'Passwords do not match',
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                    />
                  </Grid>
                </Grid>
                <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                  <Button variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Register'}
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
                  Already have an account? <Link href="/login" color="primary">Login</Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
