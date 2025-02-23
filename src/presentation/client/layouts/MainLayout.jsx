import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';

const DRAWER_WIDTH = 280;

function MainLayout() {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar 
        drawerWidth={DRAWER_WIDTH} 
        isDrawerOpen={isSidebarOpen}
        onDrawerToggle={toggleSidebar}
      />

      {/* Sidebar */}
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: '64px',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout; 