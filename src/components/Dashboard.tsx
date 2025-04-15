
import React, { useState } from 'react';
import Header from './Header'; // adjust path if needed
import Sidebar from './Sidebar'; // if you have one
import Home from './Home'; // or whatever component you're rendering
import '../App.css';
const Dashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Home />
    </div>
  );
};

export default Dashboard;





