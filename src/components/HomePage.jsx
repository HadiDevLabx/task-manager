import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskTable from './TaskTable';
import MainLayout from './MainLayout';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/'); 
  };

  return (
    <MainLayout onLogout={handleLogout}>
      <TaskTable />
    </MainLayout>
  );
};

export default HomePage;
