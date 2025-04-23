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
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

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

      <ul className="sidebar-list">

        {/* Admin-only sidebar */}
        {role === "Admin" && department === "Admin" ? (
          <Link to="/admin_users" className="Admin_link_sidebar">
            <li className="sidebar-list-item">
              <BsGrid1X2Fill className="icon" /> Users
            </li>
          </Link>
        ) : (
          <>
            <Link to="/dashboard" className="Dashboard_link_sidebar">
              <li className="sidebar-list-item">
                <BsGrid1X2Fill className="icon" /> Dashboard
              </li>
            </Link>
            <Link to="/products" className="Dashboard_link_sidebar">
              <li className="sidebar-list-item">
                <BsFillArchiveFill className="icon" /> Products
              </li>
            </Link>
            <Link to="/categories" className="Dashboard_link_sidebar">
              <li className="sidebar-list-item">
                <BsFillGrid3X3GapFill className="icon" /> Categories
              </li>
            </Link>
            <Link to="/customers" className="Dashboard_link_sidebar">
              <li className="sidebar-list-item">
                <BsPeopleFill className="icon" /> Customers
              </li>
            </Link>
            <Link to="/inventory" className="Dashboard_link_sidebar">
              <li className="sidebar-list-item">
                <BsListCheck className="icon" /> Inventory
              </li>
            </Link>
            <Link to="/reports" className="Dashboard_link_sidebar">
              <li className="sidebar-list-item">
                <BsMenuButtonWideFill className="icon" /> Reports
              </li>
            </Link>
            <Link to="/settings" className="Dashboard_link_sidebar">
              <li className="sidebar-list-item">
                <BsFillGearFill className="icon" /> Setting
              </li>
            </Link>
          </>
        )}

      </ul>
    </aside>
  );
};

export default Sidebar;
