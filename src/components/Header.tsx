
import React, { useEffect, useRef, useState } from 'react';
import {
  BsJustify,
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsBoxArrowRight,
  BsKey,
} from 'react-icons/bs';
import { Button, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeContext } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
interface HeaderProps {
  OpenSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ OpenSidebar }) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const { toggleTheme, mode } = useThemeContext();

  const profileRef = useRef<HTMLDivElement>(null);
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("UserID");
    localStorage.removeItem("department");
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
  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left">
        <BsSearch className="icon" />
      </div>
      <div className="header-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />

        <div
          className="profile-wrapper"
          ref={profileRef}
          style={{ position: "relative" }}
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
              <BsPersonCircle
                className="icon"
                style={{
                  fontSize: "22px",
                  color: showLogout ? "#4dabf5" : undefined
                }}
              />
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
            <div
              className="profile-menu"
              style={{
                backgroundColor: mode === 'dark' ? '#333' : '#fff',
                color: mode === 'dark' ? '#fff' : '#333',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div
                className="profile-option logout"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                <BsBoxArrowRight style={{ marginRight: "10px", fontSize: "16px" }} />
                <span>Logout</span>
              </div>
              <div
                className="profile-option change-password"
                onClick={handleChangePassword}
                style={{ cursor: 'pointer' }}
              >
                <BsKey style={{ marginRight: "10px", fontSize: "16px" }} />
                <span>Change Password</span>
              </div>
            </div>
          )}
        </div>

        <Button onClick={toggleTheme}>
          <DarkModeIcon />
        </Button>
      </div>
    </header>
  );
};

export default Header;

