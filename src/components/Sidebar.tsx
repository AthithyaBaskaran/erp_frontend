import React, { useState, useEffect } from 'react';
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsCashCoin,
  BsBellFill,
  BsFileEarmarkText,
  BsCreditCard,
  BsTruck,
  BsBarChartFill,
  BsReceiptCutoff
} from 'react-icons/bs';
import { Link, NavLink } from 'react-router-dom';
import '../styles/sidebar.css';
import '../styles/purple-blue-sidebar.css'; // Import the purple-blue gradient sidebar theme
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
    console.log("Stored role:", storedRole);
    console.log("Stored department:", storedDepartment);
    
    // Try to parse the role if it's a JSON string
    try {
      if (storedRole && storedRole.startsWith('{') && storedRole.endsWith('}')) {
        const parsedRole = JSON.parse(storedRole);
        console.log("Parsed role:", parsedRole);
        // If parsedRole has a name property, use that
        if (parsedRole.name) {
          setRole(parsedRole.name);
        } else {
          setRole(storedRole);
        }
      } else {
        setRole(storedRole);
      }
    } catch (error) {
      console.log("Error parsing role:", error);
      setRole(storedRole);
    }
    
    setDepartment(storedDepartment);
  }, []);

  // Debug output to help troubleshoot role issues
  console.log("Current role state:", role);
  console.log("Is Sales Manager?", role === "Sales Manager");
  console.log("Is sales manager (lowercase)?", role?.toLowerCase() === "sales manager");
  
  // Check if user is a Sales Manager to apply the red sidebar
  const isSalesManager = role === "Sales Manager" || 
                        (role && typeof role === 'string' && role.toLowerCase() === "sales manager") ||
                        (role && typeof role === 'string' && role.includes("Sales Manager"));
  
  return (
    <aside 
      id="sidebar" 
      className={`${openSidebarToggle ? 'sidebar-responsive' : ''} ${isSalesManager ? 'sales-manager-sidebar' : ''}`}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <BsCart3 className="icon_header" /> SALES PORTAL
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
            <>
              <NavLink to="/admin_users" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsGrid1X2Fill className="icon" /> <span className="sidebar-item-text">Users</span>
                </li>
              </NavLink>
              
              <NavLink to="/inventory" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsListCheck className="icon" /> <span className="sidebar-item-text">Inventory</span>
                </li>
              </NavLink>
            </>
          ) : role && typeof role === 'string' && role.toLowerCase() === "supplier" ? (
            <>
              {/* Supplier Dashboard Menu Options */}
              <li 
                className={`sidebar-list-item ${window.location.pathname === '/supplier-dashboard' && !window.location.hash ? 'active' : ''}`}
                onClick={() => window.location.href = '/supplier-dashboard'}
              >
                <BsGrid1X2Fill className="icon" /> <span className="sidebar-item-text">Overview</span>
              </li>
              
              <li 
                className={`sidebar-list-item ${window.location.hash === '#orders' ? 'active' : ''}`}
                onClick={() => {
                  window.location.href = '/supplier-dashboard#orders';
                }}
              >
                <BsListCheck className="icon" /> <span className="sidebar-item-text">Orders</span>
              </li>
              
              <li 
                className={`sidebar-list-item ${window.location.hash === '#products' ? 'active' : ''}`}
                onClick={() => {
                  window.location.href = '/supplier-dashboard#products';
                }}
              >
                <BsFillArchiveFill className="icon" /> <span className="sidebar-item-text">Products</span>
              </li>
              
              
              <li 
                className={`sidebar-list-item ${window.location.hash === '#notifications' ? 'active' : ''}`}
                onClick={() => {
                  window.location.href = '/supplier-dashboard#notifications';
                }}
              >
                <BsBellFill className="icon" /> <span className="sidebar-item-text">Notifications</span>
              </li>
              
            </>
          ) : role && (
            role === "Sales Manager" || 
            role.toLowerCase() === "sales manager" || 
            role.includes("Sales Manager") || 
            role.toLowerCase().includes("sales manager")
          ) ? (
            <>
              {/* Sales Manager Menu Options */}
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  padding: '0 20px', 
                  marginTop: '20px',
                  marginBottom: '15px', 
                  color: '#ffffff',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textShadow: '0px 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                SALES MANAGEMENT
              </Typography>
              
              <NavLink to="/book-order" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsCart3 className="icon" /> <span className="sidebar-item-text">Book Order</span>
                </li>
              </NavLink>
              
              <NavLink to="/order-items" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsListCheck className="icon" /> <span className="sidebar-item-text">Order Items</span>
                </li> 
              </NavLink>
              
              <NavLink to="/invoices" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFileEarmarkText className="icon" /> <span className="sidebar-item-text">Invoices</span>
                </li>
              </NavLink>
              
              <NavLink to="/payments" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsCreditCard className="icon" /> <span className="sidebar-item-text">Payments</span>
                </li>
              </NavLink>
              
              <NavLink to="/shipping" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsTruck className="icon" /> <span className="sidebar-item-text">Shipping Status</span>
                </li>
              </NavLink>
            </>
          ) : role && typeof role === 'string' && role.toLowerCase() === "inventory" ? (
            <>
              {/* Inventory Role Menu Options */}
              <NavLink to="/inventory-dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsGrid1X2Fill className="icon" /> <span className="sidebar-item-text">Dashboard</span>
                </li>
              </NavLink>
              
              <NavLink to="/inventory-products" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillArchiveFill className="icon" /> <span className="sidebar-item-text">Products</span>
                </li>
              </NavLink>
              
              <NavLink to="/inventory-analytics" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsMenuButtonWideFill className="icon" /> <span className="sidebar-item-text">Analytics</span>
                </li>
              </NavLink>
              
              <NavLink to="/inventory-settings" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillGearFill className="icon" /> <span className="sidebar-item-text">Settings</span>
                </li>
              </NavLink>
            </>
          ) : role && typeof role === 'string' && role.toLowerCase() === "salesman" ? (
            <>
              {/* Salesman Menu Options */}
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  padding: '0 20px', 
                  marginTop: '20px',
                  marginBottom: '15px', 
                  color: '#ffffff',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textShadow: '0px 1px 2px rgba(0,0,0,0.2)'
                }}
              >
                SALES MANAGEMENT
              </Typography>
              
              <NavLink to="/book-order" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsCart3 className="icon" /> <span className="sidebar-item-text">Book Order</span>
                </li>
              </NavLink>
              
              <NavLink to="/order-items" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsListCheck className="icon" /> <span className="sidebar-item-text">Order Items</span>
                </li> 
              </NavLink>
              
              <NavLink to="/invoices" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFileEarmarkText className="icon" /> <span className="sidebar-item-text">Invoices</span>
                </li>
              </NavLink>
              
              <NavLink to="/payments" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsCreditCard className="icon" /> <span className="sidebar-item-text">Payments</span>
                </li>
              </NavLink>
              
              <NavLink to="/shipping" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsTruck className="icon" /> <span className="sidebar-item-text">Shipping Status</span>
                </li>
              </NavLink>
            </>
          ) : (department === "5" && role === "6") ? (
            <>
              {/* Sales Management Dashboard Menu Options (non-Sales Manager) */}
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  padding: '0 20px', 
                  marginTop: '20px',
                  marginBottom: '10px', 
                  color: '#9e9ea4',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px'
                }}
              >
                SALES MANAGEMENT
              </Typography>
              
              <NavLink to="/sales-dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsBarChartFill className="icon" /> 
                  <span className="sidebar-item-text">Overview</span>
                </li>
              </NavLink>
              
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  padding: '0 20px', 
                  marginTop: '20px',
                  marginBottom: '10px', 
                  color: '#9e9ea4',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px'
                }}
              >
                MANAGEMENT
              </Typography>
              
              <NavLink to="/customers" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsPeopleFill className="icon" /> <span className="sidebar-item-text">Customers</span>
                </li>
              </NavLink>
              
              <NavLink to="/reports" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsReceiptCutoff className="icon" /> <span className="sidebar-item-text">Reports</span>
                </li>
              </NavLink>
              
              <NavLink to="/settings" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillGearFill className="icon" /> <span className="sidebar-item-text">Settings</span>
                </li>
              </NavLink>
            </>
          ) : role && typeof role === 'string' && role.toLowerCase() === "salesman" ? (
            <>  
              {/* Salesman Dashboard Menu Options */}
              <NavLink to="/salesman-dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsGrid1X2Fill className="icon" /> <span className="sidebar-item-text">Dashboard</span>
                </li>
              </NavLink>
              
              <NavLink to="/salesman-dashboard?tab=1" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsCart3 className="icon" /> <span className="sidebar-item-text">Book Order</span>
                </li>
              </NavLink>
              
              <NavLink to="/salesman-dashboard?tab=2" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsPeopleFill className="icon" /> <span className="sidebar-item-text">Customers</span>
                </li>
              </NavLink>
              
              <NavLink to="/salesman-dashboard?tab=3" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillArchiveFill className="icon" /> <span className="sidebar-item-text">Products</span>
                </li>
              </NavLink>
              
              <NavLink to="/salesman-dashboard?tab=4" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsListCheck className="icon" /> <span className="sidebar-item-text">Leads</span>
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
          ) : (
            <>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsGrid1X2Fill className="icon" /> <span className="sidebar-item-text">Dashboard</span>
                </li>
              </NavLink>
              {/* <NavLink to="/categories" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillGrid3X3GapFill className="icon" /> <span className="sidebar-item-text">Categories</span>
                </li>
              </NavLink> */}
              
            <NavLink to="/inventory" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsListCheck className="icon" /> <span className="sidebar-item-text">Inventory</span>
                </li>
              </NavLink>
              

              
              <NavLink to="/products" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsFillArchiveFill className="icon" /> <span className="sidebar-item-text">Products</span>
                </li>
              </NavLink>
              <NavLink to="/customers" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsPeopleFill className="icon" /> <span className="sidebar-item-text">Customers</span>
                </li>
              </NavLink>
              
              <NavLink to="/book-order" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsCart3 className="icon" /> <span className="sidebar-item-text">Book Order</span>
                </li>
              </NavLink>
     
              {/* <NavLink to="/reports" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>
                <li className="sidebar-list-item">
                  <BsMenuButtonWideFill className="icon" /> <span className="sidebar-item-text">Reports</span>
                </li>
              </NavLink> */}
              
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
