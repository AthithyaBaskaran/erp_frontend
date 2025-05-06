
import React, { useEffect, useRef, useState } from 'react';
import {
  BsJustify,
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsSearch,
  BsBoxArrowRight,
  BsKey,
  BsPersonCircle,
  BsGear,
} from 'react-icons/bs';
import { Tooltip, Typography, Avatar, Button, Badge } from '@mui/material';
import { deepOrange, deepPurple, red } from '@mui/material/colors';
import { useThemeContext } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import '../styles/red-header.css';


interface HeaderProps {
  OpenSidebar: () => void;
  onNotificationClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ OpenSidebar, onNotificationClick }) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const { toggleTheme, mode } = useThemeContext();
  const [notificationCount, setNotificationCount] = useState(4);
  const [messageCount, setMessageCount] = useState(10);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("UserID");
    localStorage.removeItem("department");
    localStorage.removeItem("UserName");
    navigate("/");
  }

  const toggleProfileMenu = () => {
    setShowLogout(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  function handleChangePassword() {
    navigate("/change_password");
  }
  
  const Username = localStorage.getItem('UserName');
  const UserRole = localStorage.getItem('roles');
  
  // Determine gender based on name (this is a simple approach, you might want to store gender in localStorage instead)
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  useEffect(() => {
    // This is a simplified approach to determine gender based on common name endings
    // For a production app, you should store the user's gender in your database/localStorage
    if (Username) {
      const lowerName = Username.toLowerCase();
      if (lowerName.endsWith('a') || lowerName.endsWith('i') || lowerName.endsWith('e')) {
        setGender('female');
      } else {
        setGender('male');
      }
    }
  }, [Username]);
  
  // Apply the data-role attribute to the body element for role-specific styling
  useEffect(() => {
    if (UserRole) {
      // Check if the user is a Sales Manager
      const isSalesManager = 
        UserRole === "Sales Manager" || 
        UserRole.toLowerCase() === "sales manager" || 
        UserRole.includes("Sales Manager") || 
        UserRole.toLowerCase().includes("sales manager");
      
      if (isSalesManager) {
        document.body.setAttribute('data-role', 'sales-manager');
      } else {
        document.body.removeAttribute('data-role');
      }
    } else {
      document.body.removeAttribute('data-role');
    }
    
    // Cleanup function to remove the attribute when component unmounts
    return () => {
      document.body.removeAttribute('data-role');
    };
  }, [UserRole]);
  
  // Get the first letter of username for the avatar fallback
  const getInitial = () => {
    return Username ? Username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsSearch className="icon" />
      </div>
      <div className="header-right">
        {/* Notification Icon */}
        <Tooltip title="Notifications">
          <div 
            className="header-icon-container" 
            ref={notificationRef} 
            onClick={onNotificationClick}
          >
            <Badge badgeContent={notificationCount} color="error" sx={{ cursor: 'pointer' }}>
              <BsFillBellFill className="icon" style={{ fontSize: '20px' }} />
            </Badge>
          </div>
        </Tooltip>

        {/* Email/Message Icon */}
        <Tooltip title="Messages">
          <div className="header-icon-container" ref={messageRef}>
            <Badge badgeContent={messageCount} color="primary" sx={{ cursor: 'pointer' }}>
              <BsFillEnvelopeFill className="icon" style={{ fontSize: '20px' }} />
            </Badge>
          </div>
        </Tooltip>

        {/* Theme Toggle Icon */}
        <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
          <div className="header-icon-container">
            <Button
              onClick={toggleTheme}
              sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                color: mode === 'dark' ? '#fff' : '#333',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </Button>
          </div>
        </Tooltip>

        {/* User Profile with Dropdown */}
        <div
          className="profile-wrapper"
          ref={profileRef}
          style={{ position: "relative", marginLeft: "10px" }}
        >
          <Tooltip title="User Profile">
            <div
              className="profile-icon-container"
              onClick={toggleProfileMenu}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Avatar 
                alt={Username || 'User'}
                sx={{ 
                  width: 32, 
                  height: 32,
                  marginRight: '8px',
                  bgcolor: document.body.getAttribute('data-role') === 'sales-manager' 
                    ? red[700] 
                    : (gender === 'male' ? deepOrange[500] : deepPurple[500]),
                  border: showLogout 
                    ? document.body.getAttribute('data-role') === 'sales-manager'
                      ? '2px solid #ffffff'
                      : '2px solid #4dabf5' 
                    : 'none',
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer'
                }}
              >
                {getInitial()}
              </Avatar>
              <Typography 
                variant="body1" 
                className='nav_username'
                sx={{ 
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  letterSpacing: '0.2px'
                }}
              >
                {Username}
              </Typography>

              <span
                style={{
                  marginLeft: "5px",
                  fontSize: "10px",
                  transform: showLogout ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease"
                }}
              >
                ▼
              </span>
            </div>
          </Tooltip>

          {showLogout && (
            <div className="profile-menu">
              {/* User Info Section */}
              <div className="profile-info" style={{ 
                padding: "10px", 
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                marginBottom: "5px"
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  {Username}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '12px',
                    color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'
                  }}
                >
                  Role: {UserRole || 'User'}
                </Typography>
              </div>
              
              {/* Change Password Option */}
              <div
                className="profile-option change-password"
                onClick={handleChangePassword}
                style={{ cursor: 'pointer' }}
              >
                <BsKey style={{ marginRight: "10px", fontSize: "16px" }} />
                <span>Change Password</span>
              </div>
              
              {/* Logout Option */}
              <div
                className="profile-option logout"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <BsBoxArrowRight style={{ marginRight: "10px", fontSize: "16px" }} />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

