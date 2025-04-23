
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import '../App.css';
import { useThemeContext } from './ThemeContext';
import { Box } from '@mui/material';

const Dashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const { mode } = useThemeContext();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <Box 
      className='grid-container'
      sx={{
        // This ensures Material UI theme is properly applied
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Home />
    </Box>
  );
};

export default Dashboard;





