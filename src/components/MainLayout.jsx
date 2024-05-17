import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';  
import Header from './Header';

const MainLayout = ({ children, onLogout }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex">
        <Box component="main" flexGrow={1}>
          <Header onLogout={onLogout} />
          <Box p={3}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
