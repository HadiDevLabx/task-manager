import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('user');
  return !token ? children : <Navigate to="/home" />;
};

export default PublicRoute;
