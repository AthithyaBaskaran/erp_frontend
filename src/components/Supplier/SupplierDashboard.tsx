import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  LocalShipping, 
  Inventory, 
  AttachMoney, 
  Notifications, 
  MoreVert, 
  TrendingUp, 
  TrendingDown,
  Search,
  FilterList,
  CheckCircle,
  Warning,
  ErrorOutline,
  Message,
  CalendarToday,
  Person,
  Settings,
  Logout
} from '@mui/icons-material';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Ensure Chart.js is properly configured
import 'chart.js/auto';
// Import styles
import '../../styles/SupplierDashboard.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const SupplierDashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      } else {
        setActiveTab('overview');
      }
    };
    
    // Set initial tab based on hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Mock data
  const supplierInfo = {
    name: "Acme Supplies Inc.",
    rating: 4.8,
    joinDate: "Jan 15, 2023",
    status: "Verified",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const recentOrders = [
    { id: "ORD-7829", customer: "TechCorp Ltd", date: "Oct 12, 2023", amount: 12500, status: "Delivered" },
    { id: "ORD-7830", customer: "Global Industries", date: "Oct 10, 2023", amount: 8750, status: "Processing" },
    { id: "ORD-7831", customer: "Innovate Solutions", date: "Oct 8, 2023", amount: 5200, status: "Pending" },
    { id: "ORD-7832", customer: "Prime Retailers", date: "Oct 5, 2023", amount: 9300, status: "Delivered" },
  ];

  const lowStockProducts = [
    { id: "PRD-001", name: "Premium Widgets", currentStock: 12, minRequired: 20 },
    { id: "PRD-008", name: "Deluxe Gadgets", currentStock: 5, minRequired: 15 },
    { id: "PRD-015", name: "Ultra Components", currentStock: 8, minRequired: 25 },
  ];

  const notifications = [
    { id: 1, type: "order", message: "New order #ORD-7833 received", time: "2 hours ago" },
    { id: 2, type: "stock", message: "Low stock alert for Premium Widgets", time: "5 hours ago" },
    { id: 3, type: "payment", message: "Payment of $12,500 received", time: "1 day ago" },
    { id: 4, type: "message", message: "New message from TechCorp Ltd", time: "2 days ago" },
  ];



  const orderStatusData = {
    labels: ['Delivered', 'Processing', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Order Status',
        data: [65, 20, 12, 3],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(244, 67, 54, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  
  const handleNotificationMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
    // Reset notification count in Header component
    // In a real application, this would be handled through a context or state management
    // For now, we'll just simulate this behavior
    const headerNotificationCount = document.querySelector('.header-icon-container .MuiBadge-badge');
    if (headerNotificationCount) {
      headerNotificationCount.textContent = '0';
    }
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Processing':
        return 'info';
      case 'Pending':
        return 'warning';
      default:
        return 'error';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle fontSize="small" />;
      case 'Processing':
        return <Inventory fontSize="small" />;
      case 'Pending':
        return <Warning fontSize="small" />;
      default:
        return <ErrorOutline fontSize="small" />;
    }
  };

  return (
    <Box 
      className='grid-container'
      sx={{
        bgcolor: '#e6f2ff',
        color: '#2c3e50',
      }}
    >
      <Header OpenSidebar={OpenSidebar} onNotificationClick={handleNotificationMenuClick} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <div className="supplier-dashboard main-container">
        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              width: 320,
              borderRadius: '8px',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
              Recent Notifications
            </Typography>
          </Box>
          
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  onClick={handleNotificationMenuClose} 
                  className="notification-menu-item"
                >
                  <div className={`notification-icon notification-${notification.type}`}>
                    {notification.type === 'order' && <LocalShipping fontSize="small" />}
                    {notification.type === 'stock' && <Inventory fontSize="small" />}
                    {notification.type === 'payment' && <AttachMoney fontSize="small" />}
                    {notification.type === 'message' && <Message fontSize="small" />}
                  </div>
                  <div className="notification-content">
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                </MenuItem>
              ))}
              <Box sx={{ p: 1, borderTop: '1px solid rgba(0, 0, 0, 0.12)', textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small"
                  onClick={handleNotificationMenuClose}
                >
                  View All Notifications
                </Button>
              </Box>
            </>
          ) : (
            <MenuItem sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
                No new notifications
              </Typography>
            </MenuItem>
          )}
        </Menu>

      {/* Dashboard Content */}
      <div className="supplier-content">

        {/* Dashboard Cards - Only show when not on orders, products, or notifications tab */}
        {activeTab !== 'orders' && activeTab !== 'products' && activeTab !== 'notifications' && (
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Total Revenue</h3>
                  <p className="card-value">$245,890</p>
                  <span className="card-trend positive">
                    <TrendingUp fontSize="small" /> +12.5%
                  </span>
                </div>
                <div className="card-icon card-icon-revenue">
                  <AttachMoney sx={{ fontSize: 24 }} />
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Active Orders</h3>
                  <p className="card-value">32</p>
                  <span className="card-trend positive">
                    <TrendingUp fontSize="small" /> +5.2%
                  </span>
                </div>
                <div className="card-icon card-icon-orders">
                  <LocalShipping sx={{ fontSize: 24 }} />
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Products</h3>
                  <p className="card-value">128</p>
                  <span className="card-trend positive">
                    <TrendingUp fontSize="small" /> +3.7%
                  </span>
                </div>
                <div className="card-icon card-icon-products">
                  <Inventory sx={{ fontSize: 24 }} />
                </div>
              </div>
            </div>
            
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Low Stock Items</h3>
                  <p className="card-value" style={{ color: '#F44336' }}>
                    8
                  </p>
                  <span className="card-trend negative">
                    <TrendingDown fontSize="small" /> +2
                  </span>
                </div>
                <div className="card-icon card-icon-warning">
                  <Warning sx={{ fontSize: 24 }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section - Only show when not on orders, products, or notifications tab */}
        {activeTab !== 'orders' && activeTab !== 'products' && activeTab !== 'notifications' && (
          <div className="charts-container">



          </div>
        )}

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="overview-container">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Welcome to your Supplier Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Here you can manage your products, track orders, and view analytics about your business performance.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Use the sidebar menu to navigate between different sections of your dashboard.
            </Typography>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="data-grid-container">
            <div className="data-grid-card">
              <div className="data-grid-header">
                <h3 className="data-grid-title">Recent Orders</h3>
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small"
                  className="view-all-button"
                >
                  View All
                </Button>
              </div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id} className="data-row">
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(order.status)}
                            label={order.status}
                            color={getStatusColor(order.status) as "success" | "info" | "warning" | "error"}
                            size="small"
                            className="status-chip"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <div className="data-grid-container">
            <div className="data-grid-card">
              <div className="data-grid-header">
                <h3 className="data-grid-title">Low Stock Products</h3>
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small"
                  className="view-all-button"
                >
                  View All
                </Button>
              </div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Current Stock</TableCell>
                      <TableCell>Min Required</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockProducts.map((product) => (
                      <TableRow key={product.id} className="data-row">
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <span className="stock-warning">{product.currentStock}</span>
                        </TableCell>
                        <TableCell>{product.minRequired}</TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            className="restock-button"
                          >
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <div className="analytics-container">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Analytics Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              View detailed analytics about your sales, products, and customer behavior.
            </Typography>
            <div className="analytics-placeholder">
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Analytics content will be displayed here.
              </Typography>
            </div>
          </div>
        )}

        {/* Messages Tab Content */}
        {activeTab === 'messages' && (
          <div className="messages-container">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Messages
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Communicate with customers and manage your inquiries.
            </Typography>
            <div className="messages-placeholder">
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Messages will be displayed here.
              </Typography>
            </div>
          </div>
        )}

        {/* Notifications Tab Content */}
        {activeTab === 'notifications' && (
          <div className="notifications-container">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small"
                  startIcon={<FilterList />}
                  sx={{ mr: 1, borderRadius: '8px' }}
                >
                  Filter
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  sx={{ borderRadius: '8px' }}
                >
                  Mark All as Read
                </Button>
              </Box>
            </Box>
            
            <div className="notifications-list-container">
              <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                {notifications.length > 0 ? (
                  <div className="notifications-list">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="notification-item">
                        <div className={`notification-icon notification-${notification.type}`}>
                          {notification.type === 'order' && <LocalShipping fontSize="small" />}
                          {notification.type === 'stock' && <Inventory fontSize="small" />}
                          {notification.type === 'payment' && <AttachMoney fontSize="small" />}
                          {notification.type === 'message' && <Message fontSize="small" />}
                        </div>
                        <div className="notification-content">
                          <div className="notification-message">{notification.message}</div>
                          <div className="notification-time">{notification.time}</div>
                        </div>
                        <IconButton size="small">
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    py: 5
                  }}>
                    <Notifications sx={{ fontSize: 48, color: 'rgba(0, 0, 0, 0.2)', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You don't have any notifications at the moment
                    </Typography>
                  </Box>
                )}
              </Paper>
            </div>
          </div>
        )}

        {/* Order Status and Notifications - Only show when not on orders, products, or notifications tab */}
        {activeTab !== 'orders' && activeTab !== 'products' && activeTab !== 'notifications' && (
          <div className="side-panels-container">
            <div className="side-panel">
              <div className="side-panel-header">
                <h3 className="side-panel-title">Order Status</h3>
              </div>
              <div className="donut-chart-container">
                <Doughnut 
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          font: {
                            family: "'Cabin', sans-serif",
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleFont: {
                          family: "'Poppins', sans-serif",
                          size: 14
                        },
                        bodyFont: {
                          family: "'Cabin', sans-serif",
                          size: 13
                        }
                      }
                    },
                  }}
                />
              </div>
            </div>

            <div className="side-panel">
              <div className="side-panel-header">
                <h3 className="side-panel-title">Recent Notifications</h3>
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small"
                  className="view-all-button"
                >
                  View All
                </Button>
              </div>
              <div className="notifications-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <div className={`notification-icon notification-${notification.type}`}>
                      {notification.type === 'order' && <LocalShipping fontSize="small" />}
                      {notification.type === 'stock' && <Inventory fontSize="small" />}
                      {notification.type === 'payment' && <AttachMoney fontSize="small" />}
                      {notification.type === 'message' && <Message fontSize="small" />}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </Box>
  );
};

export default SupplierDashboard;