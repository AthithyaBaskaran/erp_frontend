import React, { useState, useEffect } from 'react';
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill
} from 'react-icons/bs';
import { Link, NavLink } from 'react-router-dom';
import '../styles/sidebar.css';
import { Typography } from '@mui/material';

type SidebarProps = {
  openSidebarToggle: boolean;
  OpenSidebar: () => void;
};



const Sidebar: React.FC<SidebarProps> = ({ openSidebarToggle, OpenSidebar }) => {
  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('roles');
    const storedDepartment = localStorage.getItem('department');
    setRole(storedRole);
    setDepartment(storedDepartment);
  }, []);

  return (
    <aside id="sidebar" className={openSidebarToggle ? 'sidebar-responsive' : ''}>
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> SHOP
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>X</span>
      </div>

      <div className="sidebar-menu-container">
        <Typography 
          variant="subtitle2" 
          sx={{ 
            padding: '0 20px', 
            marginBottom: '10px', 
            color: '#9e9ea4',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            fontSize: '12px'
          }}
        >
          MAIN MENU
        </Typography>
        
        <ul className="sidebar-list">
          {/* Admin-only sidebar */}
          {role === "Admin" && department === "Admin" ? (
            <NavLink to="/admin_users" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
              <li className="sidebar-list-item">
                <BsGrid1X2Fill className="icon" /> <span className="sidebar-item-text">Users</span>
              </li>
            </NavLink>
          ) : (
            <>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsGrid1X2Fill className="icon" /> <span className="sidebar-item-text">Dashboard</span>
                </li>
              </NavLink>
              
              <NavLink to="/products" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillArchiveFill className="icon" /> <span className="sidebar-item-text">Products</span>
                </li>
              </NavLink>
              
              <NavLink to="/categories" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillGrid3X3GapFill className="icon" /> <span className="sidebar-item-text">Categories</span>
                </li>
              </NavLink>
              
              <NavLink to="/customers" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsPeopleFill className="icon" /> <span className="sidebar-item-text">Customers</span>
                </li>
              </NavLink>
              
              <NavLink to="/inventory" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsListCheck className="icon" /> <span className="sidebar-item-text">Inventory</span>
                </li>
              </NavLink>
              
              <NavLink to="/reports" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsMenuButtonWideFill className="icon" /> <span className="sidebar-item-text">Reports</span>
                </li>
              </NavLink>
              
              <NavLink to="/settings" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillGearFill className="icon" /> <span className="sidebar-item-text">Settings</span>
                </li>
              </NavLink>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
