import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </>
  );
}
