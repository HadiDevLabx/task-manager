import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from '../components/Register';
import Login from '../components/Login';
import HomePage from '../components/HomePage';
import ProfilePage from '../components/ProfilePage';  
import MainLayout from '../components/MainLayout';
 
import PublicRoute from '../utils/PublicRoute';
import PrivateRoute from '../utils/privateRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/home" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
