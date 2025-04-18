import React , {useState, useEffect} from 'react';
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
    console.log("User Role:", storedRole);
    console.log("User Department:", storedDepartment);
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
          <li className="sidebar-list-item">
            <Link to="/admin_users" className="Admin_link_sidebar">
              <BsGrid1X2Fill className="icon" /> Users
            </Link>
          </li>
        ) : (
          <>
            <li className="sidebar-list-item">
              <Link to="/dashboard" className="Dashboard_link_sidebar">
                <BsGrid1X2Fill className="icon" /> Dashboard
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/products">
                <BsFillArchiveFill className="icon" /> Products
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/categories">
                <BsFillGrid3X3GapFill className="icon" /> Categories
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/customers">
                <BsPeopleFill className="icon" /> Customers
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/inventory">
                <BsListCheck className="icon" /> Inventory
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/reports">
                <BsMenuButtonWideFill className="icon" /> Reports
              </Link>
            </li>
            <li className="sidebar-list-item">
              <Link to="/settings">
                <BsFillGearFill className="icon" /> Setting
              </Link>
            </li>
          </>
        )}

      </ul>
    </aside>
  );
};

export default Sidebar;
