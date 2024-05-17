import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, } from '@mui/material';
import {  Home, Person, ExitToApp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  animation: `${fadeIn} 1s ease-in`,
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const Header = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, animation: `${fadeIn} 2s ease-in` }}>
          Task Management
        </Typography>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <AnimatedButton
            color="inherit"
            startIcon={<Home />}
            component={Link}
            to="/home"
          >
            Home
          </AnimatedButton>
          <AnimatedButton
            color="inherit"
            startIcon={<Person />}
            component={Link}
            to="/profile"
          >
            Profile
          </AnimatedButton>
        </Box>
        <Box display="flex" alignItems="center">
          
          <AnimatedButton
            color="inherit"
            startIcon={<ExitToApp />}
            onClick={onLogout}
          >
            Logout
          </AnimatedButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
