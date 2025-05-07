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
  InputAdornment,
  Modal,
  Autocomplete,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
  Logout,
  ExpandMore
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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import Swal from 'sweetalert2';

// Ensure Chart.js is properly configured
import 'chart.js/auto';
// Import styles
import '../../styles/SupplierDashboard.css';
import '../../styles/inventory.css';

// API
import {
  fetchCategoriesApi, showInventory, addInventory, fetchSalesOrdersByStatus, updateOrderStatus
} from "../Api/apiUrl";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

// Interfaces
interface InventoryFormData {
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
}

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  categoryName?: string;
}

interface Category {
  id?: string;
  categoryName: string;
}

interface SalesOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  productName?: string;
  quantity?: number;
  remarks?: string;
  deliveryDate?: string;
}

// Validation schema
const inventorySchema = yup.object({
  name: yup.string().required('Product name is required'),
  sku: yup.string().required('SKU is required'),
  price: yup
    .number()
    .positive('Price must be positive')
    .test(
      'is-decimal',
      'Price can have up to 2 decimal places',
      (value) => {
        if (!value) return true;
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }
    )
    .required('Price is required'),
  categoryId: yup.number().required('Category is required'),
  stockQuantity: yup.number().integer('Quantity must be a whole number').min(0, 'Quantity cannot be negative').required('Stock quantity is required')
});

const SupplierDashboard: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [openOrdersModal, setOpenOrdersModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [remarks, setRemarks] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [productTabValue, setProductTabValue] = useState(0);
  const [orderTabValue, setOrderTabValue] = useState(0);
  
  // Form handling
  const {
    register: registerInventory,
    handleSubmit: handleInventorySubmit,
    setValue: setInventoryValue,
    reset: resetInventory,
    control: controlCategory,
    formState: { errors: inventoryErrors, isSubmitting: isInventorySubmitting },
  } = useForm<InventoryFormData>({
    resolver: yupResolver(inventorySchema)
  });

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
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  
  // API calls
  const fetchCategories = async () => {
    try {
      const response = await fetchCategoriesApi();
      const data = response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  const fetchInventory = async () => {
    setIsProductsLoading(true);
    try {
      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const responsePromise = showInventory();
      // Properly type the response using type assertion
      const response = await Promise.race([responsePromise, timeoutPromise]) as any;
      
      // Debug the response structure
      console.log("API Response:", response);
      
      // Check if response exists
      if (response) {
        // The API might return the data directly or in a data property
        let processedData;
        
        if (response.data) {
          // If response has a data property (standard Axios response)
          processedData = response.data;
          console.log("Response data:", processedData);
        } else {
          // If response is the data itself (some APIs return this way)
          processedData = response;
          console.log("Direct response:", processedData);
        }
        
        // Check if we have an array in data.data (nested data structure)
        if (processedData && processedData.data && Array.isArray(processedData.data)) {
          console.log("Setting inventory items from data.data:", processedData.data);
          setInventoryItems(processedData.data);
        } 
        // Check if the data itself is an array
        else if (Array.isArray(processedData)) {
          console.log("Setting inventory items from array data:", processedData);
          setInventoryItems(processedData);
        }
        // If data is not in expected format, set empty array
        else {
          console.warn("Unexpected data format:", processedData);
          setInventoryItems([]);
          throw new Error('Unexpected data format received from server');
        }
      } else {
        throw new Error('No response received from server');
      }
    }
    catch (error: any) {
      console.error("Error fetching inventory:", error);
      
      // More detailed error message based on the error type
      let errorMessage = 'There was an error loading the product list. Please try again.';
      
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 500) {
          errorMessage = 'Server error occurred. Please contact the administrator.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        // Something else caused the error
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Products',
        text: errorMessage,
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          confirmButton: 'swal2-confirm',
          icon: 'swal2-icon'
        }
      });
    } finally {
      setIsProductsLoading(false);
    }
  };
  
  const handleViewAllProducts = (tabIndex: number = 0) => {
    fetchInventory();
    setProductTabValue(tabIndex);
    setOpenProductsModal(true);
  };
  
  const handleCloseProductsModal = () => {
    setOpenProductsModal(false);
  };
  
  const handleProductTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setProductTabValue(newValue);
  };
  
  const fetchSalesOrders = async (status: string = 'PENDING') => {
    setIsOrdersLoading(true);
    try {
      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const responsePromise = fetchSalesOrdersByStatus(status);
      // Properly type the response using type assertion
      const response = await Promise.race([responsePromise, timeoutPromise]) as any;
      
      // Debug the response structure
      console.log("Sales Orders API Response:", response);
      
      // Check if response exists
      if (response) {
        // The API might return the data directly or in a data property
        let processedData;
        
        if (response.data) {
          // If response has a data property (standard Axios response)
          processedData = response.data;
          console.log("Response data:", processedData);
        } else {
          // If response is the data itself (some APIs return this way)
          processedData = response;
          console.log("Direct response:", processedData);
        }
        
        // Check if we have an array in data.data (nested data structure)
        if (processedData && Array.isArray(processedData)) {
          console.log("Setting sales orders from array data:", processedData);
          setSalesOrders(processedData);
        } 
        // If data is not in expected format, set empty array
        else {
          console.warn("Unexpected data format:", processedData);
          setSalesOrders([]);
          throw new Error('Unexpected data format received from server');
        }
      } else {
        throw new Error('No response received from server');
      }
    }
    catch (error: any) {
      console.error("Error fetching sales orders:", error);
      
      // More detailed error message based on the error type
      let errorMessage = 'There was an error loading the orders list. Please try again.';
      
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 500) {
          errorMessage = 'Server error occurred. Please contact the administrator.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        // Something else caused the error
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Orders',
        text: errorMessage,
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          confirmButton: 'swal2-confirm',
          icon: 'swal2-icon'
        }
      });
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const handleViewAllOrders = (tabIndex: number = 0) => {
    // Fetch orders based on tab index
    let status;
    switch(tabIndex) {
      case 0:
        status = 'PENDING';
        break;
      case 1:
        status = 'PROCESSING';
        break;
      case 2:
        status = 'DELIVERED';
        break;
      default:
        status = 'PENDING';
    }
    fetchSalesOrders(status);
    
    setOrderTabValue(tabIndex);
    setOpenOrdersModal(true);
  };
  
  const handleCloseOrdersModal = () => {
    setOpenOrdersModal(false);
  };
  
  const handleOrderTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setOrderTabValue(newValue);
    // Fetch orders based on new tab value
    let status;
    switch(newValue) {
      case 0:
        status = 'PENDING';
        break;
      case 1:
        status = 'PROCESSING';
        break;
      case 2:
        status = 'DELIVERED';
        break;
      default:
        status = 'PENDING';
    }
    fetchSalesOrders(status);
  };
  
  const handleOpenApproveModal = (order: SalesOrder) => {
    setSelectedOrder(order);
    setRemarks('');
    setDeliveryDate('');
    setOpenApproveModal(true);
  };
  
  const handleCloseApproveModal = () => {
    setOpenApproveModal(false);
    setSelectedOrder(null);
  };
  
  const handleApproveOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setIsApproving(true);
      
      // Format delivery date as YYYY-MM-DD if provided
      const formattedDeliveryDate = deliveryDate ? 
        new Date(deliveryDate).toISOString().split('T')[0] : undefined;
      
      await updateOrderStatus(
        selectedOrder.id,
        'PROCESSING',
        remarks || undefined,
        formattedDeliveryDate
      );
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Order Approved',
        text: `Order ${selectedOrder.orderNumber || selectedOrder.id} has been approved and moved to processing.`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          icon: 'swal2-icon'
        }
      });
      
      // Close the modal
      handleCloseApproveModal();
      
      // Refresh the orders list
      fetchSalesOrders(orderTabValue === 0 ? 'PENDING' : 'PROCESSING');
    } catch (error: any) {
      console.error('Error approving order:', error);
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Failed to Approve Order',
        text: error.message || 'An error occurred while approving the order.',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          confirmButton: 'swal2-confirm',
          icon: 'swal2-icon'
        }
      });
    } finally {
      setIsApproving(false);
    }
  };
  
  const handleInventory: SubmitHandler<InventoryFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await addInventory({
        ...data,
        price: parseFloat(data.price.toFixed(2)),
      });

      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Product Added Successfully!',
          text: 'The new product has been added to your inventory.',
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: 'swal2-popup',
            title: 'swal2-title',
            htmlContainer: 'swal2-html-container',
            icon: 'swal2-icon'
          }
        });
        resetInventory();
        handleCloseUserModal();
      }
    } catch (error: any) {
      const message = error?.message || "Failed to add product";
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: message,
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          confirmButton: 'swal2-confirm',
          icon: 'swal2-icon'
        }
      });
      console.error("Error adding product:", error);
    } finally {
      setLoading(false);
    }
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
    { id: "ORD-7829", customerName: "TechCorp Ltd", date: "Oct 12, 2023", amount: 12500, status: "Delivered" },
    { id: "ORD-7830", customerName: "Global Industries", date: "Oct 10, 2023", amount: 8750, status: "Processing" },
    { id: "ORD-7831", customerName: "Innovate Solutions", date: "Oct 8, 2023", amount: 5200, status: "Pending" },
    { id: "ORD-7832", customerName: "Prime Retailers", date: "Oct 5, 2023", amount: 9300, status: "Delivered" },
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
  
  // Product modal handlers
  const handleAddProduct = () => {
    resetInventory();
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'success';
      case 'PROCESSING':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle fontSize="small" />;
      case 'PROCESSING':
        return <Inventory fontSize="small" />;
      case 'PENDING':
        return <Warning fontSize="small" />;
      case 'CANCELLED':
        return <ErrorOutline fontSize="small" />;
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

          {notifications.length > 0 ? 
            [
              // Map notifications to MenuItems
              ...notifications.map((notification) => (
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
              )),
              // Add "View All" button as a MenuItem
              <MenuItem key="view-all" sx={{ p: 0, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={handleNotificationMenuClose}
                  sx={{ py: 1 }}
                >
                  View All Notifications
                </Button>
              </MenuItem>
            ]
          : (
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
                  <h3 className="data-grid-title">Orders Management</h3>
                </div>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center'
                }}>
                  <img 
                    src="/assets/images/orders-icon.png" 
                    alt="Orders" 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      marginBottom: '24px',
                      opacity: 0.8
                    }}
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    color: '#333', 
                    mb: 2,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Manage Your Orders
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: '#666', 
                    mb: 4, 
                    maxWidth: '500px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    View and manage all your orders. Approve pending orders, track processing orders, and review delivered orders.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => handleViewAllOrders(0)}
                    startIcon={<LocalShipping />}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      backgroundColor: '#00C853',
                      padding: '10px 24px',
                      '&:hover': {
                        backgroundColor: '#00B34A'
                      }
                    }}
                  >
                    View All Orders
                  </Button>
                </Box>
              </div>
            </div>
          )}
          
          {/* Products Tab Content */}
          {activeTab === 'products' && (
            <div className="data-grid-container">
              <div className="data-grid-card">
                <div className="data-grid-header">
                  <h3 className="data-grid-title">Products Management</h3>
                </div>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '40px 20px',
                  textAlign: 'center'
                }}>
                  <img 
                    src="/assets/images/products-icon.png" 
                    alt="Products" 
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      marginBottom: '24px',
                      opacity: 0.8
                    }}
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    color: '#333', 
                    mb: 2,
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    Manage Your Products
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    color: '#666', 
                    mb: 4, 
                    maxWidth: '500px',
                    fontFamily: 'Poppins, sans-serif'
                  }}>
                    View all your products, add new products, and manage your inventory efficiently.
                  </Typography>
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => handleViewAllProducts(0)}
                      startIcon={<Inventory />}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        backgroundColor: '#2196F3',
                        padding: '10px 24px',
                        '&:hover': {
                          backgroundColor: '#1976D2'
                        }
                      }}
                    >
                      View All Products
                    </Button>
                    
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddProduct()}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        backgroundColor: '#00C853',
                        padding: '10px 24px',
                        '&:hover': {
                          backgroundColor: '#00B34A'
                        }
                      }}
                    >
                      Add New Product
                    </Button>
                  </div>
                </Box>
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
      
      {/* Add Product Modal */}
      <Modal
        open={openUserModal}
        onClose={handleCloseUserModal}
        aria-labelledby="add-product-modal"
        className="inventory-modal"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ADD NEW PRODUCT
            </h2>
            <button className="close-button" onClick={handleCloseUserModal}>
              <CloseIcon />
            </button>
          </div>
          <div className="form-divider"></div>
         
          <form onSubmit={handleInventorySubmit(handleInventory)}>
            <div className="form-group">
              <Controller
                name="categoryId"
                control={controlCategory}
                defaultValue={1}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Autocomplete
                    options={categories}
                    getOptionLabel={(option) => option.categoryName || ''}
                    value={
                      field.value
                        ? categories.find((cat) => Number(cat.id) === field.value) || null
                        : null
                    }
                    onChange={(e, value) => field.onChange(value ? Number(value.id) : null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        error={!!inventoryErrors.categoryId}
                        helperText={inventoryErrors.categoryId?.message}
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                          }
                        }}
                      />
                    )}
                  />
                )}
              />
            </div>
            
            <div className="form-group">
              <TextField
                fullWidth
                label="Product Name"
                {...registerInventory("name")}
                error={!!inventoryErrors.name}
                helperText={inventoryErrors.name?.message}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </div>
           
            <div className="form-group">
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                {...registerInventory("stockQuantity")}
                error={!!inventoryErrors.stockQuantity}
                helperText={inventoryErrors.stockQuantity?.message}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </div>
            
            <div className="form-group">
              <TextField
                fullWidth
                label="Price per Unit"
                type="number"
                inputProps={{ step: "0.01" }}
                {...registerInventory("price")}
                error={!!inventoryErrors.price}
                helperText={inventoryErrors.price?.message}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </div>
            
            <div className="form-group" style={{ display: 'none' }}>
              <TextField
                fullWidth
                label="SKU"
                {...registerInventory("sku")}
                error={!!inventoryErrors.sku}
                helperText={inventoryErrors.sku?.message}
                variant="outlined"
                defaultValue="AUTO-GENERATED"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </div>
           
            <div className="form-actions">
              <Button
                variant="outlined"
                onClick={handleCloseUserModal}
                className="cancel-button"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  minWidth: '120px',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.5px',
                  fontSize: '0.85rem'
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isInventorySubmitting || loading}
                className="submit-button green"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  minWidth: '150px',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.5px',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 12px rgba(0, 200, 83, 0.2)',
                  backgroundColor: '#00C853',
                  '&:hover': { backgroundColor: '#00B34E' }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Product'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      
      {/* View All Products Modal */}
      <Modal
        open={openProductsModal}
        onClose={handleCloseProductsModal}
        aria-labelledby="view-products-modal"
        className="inventory-modal products-modal"
      >
        <div className="modal-content" style={{
          backgroundColor: '#f8f9ff',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(230, 230, 250, 0.7)',
          position: 'relative'
        }}>
          <div className="modal-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            position: 'sticky',
            top: 0,
            backgroundColor: '#f8f9ff',
            zIndex: 10,
            padding: '0 0 16px 0',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}>
            <div>
              <h2 className="modal-title" style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#2c3e50',
                margin: 0,
                background: 'linear-gradient(45deg, #00C853, #2196F3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}>
                All Products
              </h2>
              <p style={{
                margin: '5px 0 0',
                fontSize: '0.85rem',
                color: '#7f8c8d',
                fontFamily: 'Poppins, sans-serif'
              }}>Manage your product inventory</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TextField
                placeholder="Search products..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#7f8c8d', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '250px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    height: '40px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }
                }}
              />
              <IconButton 
                onClick={handleCloseProductsModal}
                sx={{
                  color: '#95a5a6',
                  '&:hover': { 
                    color: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          
          {/* Product Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, mt: 2 }}>
            <Tabs 
              value={productTabValue} 
              onChange={handleProductTabChange}
              aria-label="product tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#00C853',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  minWidth: 100,
                  '&.Mui-selected': {
                    color: '#00C853',
                  },
                },
              }}
            >
              <Tab label="All Products" />
              <Tab label="In Stock" />
              <Tab label="Low Stock" />
            </Tabs>
          </Box>
          
          <div className="products-table-container" style={{ position: 'relative', minHeight: '300px' }}>
            {isProductsLoading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '300px',
                width: '100%'
              }}>
                <CircularProgress sx={{ color: '#00C853' }} />
                <Typography variant="body1" sx={{ ml: 2, fontFamily: 'Poppins, sans-serif' }}>
                  Loading products...
                </Typography>
              </div>
            ) : inventoryItems.length > 0 ? (
              <div>
                {/* Tab content based on selected tab */}
                {productTabValue === 0 && (
                  <TableContainer component={Paper} sx={{ 
                    boxShadow: 'none', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden'
              }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <TableRow>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#34495e',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem'
                      }}>ID</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#34495e',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem'
                      }}>Product Name</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#34495e',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem'
                      }}>Category</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#34495e',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem'
                      }}>SKU</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#34495e',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem'
                      }}>Price</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#34495e',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem'
                      }}>Stock</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 600, 
                        color: '#34495e',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.9rem'
                      }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow 
                        key={item.id}
                        sx={{ 
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.01)' },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.85rem',
                          color: '#7f8c8d'
                        }}>{item.id}</TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: '#2c3e50'
                        }}>{item.name}</TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.85rem'
                        }}>{item.categoryName || 'Unknown'}</TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.85rem',
                          color: '#7f8c8d'
                        }}>{item.sku}</TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}>${item.price.toFixed(2)}</TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.85rem'
                        }}>{item.stockQuantity}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.stockQuantity > 10 ? "In Stock" : "Low Stock"} 
                            size="small"
                            sx={{
                              backgroundColor: item.stockQuantity > 10 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                              color: item.stockQuantity > 10 ? '#00C853' : '#FFC107',
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              borderRadius: '4px',
                              '& .MuiChip-label': {
                                padding: '0 8px'
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
                )}
                
                {/* In Stock Tab */}
                {productTabValue === 1 && (
                  <TableContainer component={Paper} sx={{ 
                    boxShadow: 'none', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden'
              }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Stock</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryItems.filter(item => item.stockQuantity > 10).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>{item.id}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>{item.categoryName || 'Unknown'}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#7f8c8d' }}>{item.sku}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>${item.price.toFixed(2)}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>{item.stockQuantity}</TableCell>
                        <TableCell>
                          <Chip 
                            label="In Stock" 
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(0, 200, 83, 0.1)',
                              color: '#00C853',
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              borderRadius: '4px',
                              '& .MuiChip-label': { padding: '0 8px' }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
                )}
                
                {/* Low Stock Tab */}
                {productTabValue === 2 && (
                  <TableContainer component={Paper} sx={{ 
                    boxShadow: 'none', 
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden'
              }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Stock</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#34495e', fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryItems.filter(item => item.stockQuantity <= 10).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>{item.id}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>{item.categoryName || 'Unknown'}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: '#7f8c8d' }}>{item.sku}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 500 }}>${item.price.toFixed(2)}</TableCell>
                        <TableCell sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>{item.stockQuantity}</TableCell>
                        <TableCell>
                          <Chip 
                            label="Low Stock" 
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 193, 7, 0.1)',
                              color: '#FFC107',
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              borderRadius: '4px',
                              '& .MuiChip-label': { padding: '0 8px' }
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
                )}
              </div>
            ) : (
              <div>
                {/* Empty state for each tab */}
                {(productTabValue === 0 || 
                  (productTabValue === 1 && !inventoryItems.some(item => item.stockQuantity > 10)) || 
                  (productTabValue === 2 && !inventoryItems.some(item => item.stockQuantity <= 10))) && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '300px',
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.01)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(0,0,0,0.1)'
                }}>
                  <Inventory sx={{ fontSize: 48, color: '#bdc3c7', mb: 2 }} />
                  <Typography variant="h6" sx={{ 
                    color: '#7f8c8d', 
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500
                  }}>
                    {productTabValue === 0 ? "No products found" : 
                     productTabValue === 1 ? "No in-stock products found" : 
                     "No low-stock products found"}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#95a5a6', 
                    fontFamily: 'Poppins, sans-serif',
                    mt: 1
                  }}>
                    {productTabValue === 0 ? "Add your first product to get started" : 
                     productTabValue === 1 ? "Add products with stock > 10 to see them here" : 
                     "Products with stock ≤ 10 will appear here"}
                  </Typography>
                  {productTabValue === 0 && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        handleCloseProductsModal();
                        handleAddProduct();
                      }}
                      sx={{
                        mt: 3,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontFamily: 'Poppins, sans-serif',
                        backgroundColor: '#00C853',
                        '&:hover': { backgroundColor: '#00B34E' },
                        boxShadow: '0 4px 12px rgba(0, 200, 83, 0.2)',
                      }}
                    >
                      Add Product
                    </Button>
                  )}
                </div>
              )}
              </div>
            )}
          </div>
          
          {inventoryItems.length > 0 ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '24px',
              padding: '16px 0 0',
              borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
              <Typography variant="body2" sx={{ 
                color: '#7f8c8d', 
                fontFamily: 'Poppins, sans-serif'
              }}>
                Showing {inventoryItems.length} products
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  handleCloseProductsModal();
                  handleAddProduct();
                }}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: '#00C853',
                  '&:hover': { backgroundColor: '#00B34E' },
                  boxShadow: '0 4px 12px rgba(0, 200, 83, 0.2)',
                }}
              >
                Add New Product
              </Button>
            </div>
          ) : null}
        </div>
      </Modal>

      {/* View All Orders Modal */}
      <Modal
        open={openOrdersModal}
        onClose={handleCloseOrdersModal}
        aria-labelledby="view-orders-modal"
        className="inventory-modal orders-modal"
      >
        <div className="modal-content" style={{
          backgroundColor: '#f8f9ff',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(230, 230, 250, 0.7)',
          position: 'relative'
        }}>
          <div className="modal-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            position: 'sticky',
            top: 0,
            backgroundColor: '#f8f9ff',
            zIndex: 10,
            padding: '0 0 16px 0',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}>
            <div>
              <h2 className="modal-title" style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#2c3e50',
                margin: 0,
                background: 'linear-gradient(45deg, #00C853, #2196F3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}>
                All Orders
              </h2>
              <p style={{
                margin: '5px 0 0',
                fontSize: '0.85rem',
                color: '#7f8c8d',
                fontFamily: 'Poppins, sans-serif'
              }}>Manage your customer orders</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <TextField
                placeholder="Search orders..."
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#7f8c8d', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '250px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    height: '40px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  }
                }}
              />
              <IconButton 
                onClick={handleCloseOrdersModal}
                sx={{
                  color: '#95a5a6',
                  '&:hover': { 
                    color: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          
          {/* Order Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, mt: 2 }}>
            <Tabs 
              value={orderTabValue} 
              onChange={handleOrderTabChange}
              aria-label="order tabs"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#00C853',
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  minWidth: 100,
                  '&.Mui-selected': {
                    color: '#00C853',
                  },
                },
              }}
            >
              <Tab label="New Orders" />
              <Tab label="Processing Orders" />
              <Tab label="Delivered Orders" />
            </Tabs>
          </Box>
          
          <div className="orders-table-container" style={{ position: 'relative', minHeight: '300px' }}>
            {/* New Orders Tab (Pending) */}
            {orderTabValue === 0 && (
              <TableContainer component={Paper} sx={{ 
                boxShadow: 'none', 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isOrdersLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={40} />
                          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Loading orders...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : salesOrders.length > 0 ? (
                      salesOrders.map((order) => (
                        <TableRow key={order.id} className="data-row">
                          <TableCell>{order.orderNumber || `ORD-${order.id}`}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.productName || 'Multiple items'}</TableCell>
                          <TableCell>{order.quantity?.toLocaleString()}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell>{order.totalAmount.toLocaleString()}</TableCell>
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
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={() => handleOpenApproveModal(order)}
                              sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                backgroundColor: '#00C853',
                                '&:hover': {
                                  backgroundColor: '#00B34A'
                                }
                              }}
                            >
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No pending orders found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Processing Orders Tab */}
            {orderTabValue === 1 && (
              <TableContainer component={Paper} sx={{ 
                boxShadow: 'none', 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflowX: 'auto', // ✅ Fixed this
                maxWidth: '100%',  // ✅ Allows full scroll

              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Delivery Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isOrdersLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={40} />
                          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Loading orders...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : salesOrders.length > 0 ? (
                      salesOrders.map((order) => (
                        <TableRow key={order.id} className="data-row">
                          <TableCell>{order.orderNumber || `ORD-${order.id}`}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.productName || 'Multiple items'}</TableCell>
                          <TableCell>{order.quantity?.toLocaleString()}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell>{order.totalAmount.toLocaleString()}</TableCell>
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
                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Not set'}
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No processing orders found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Delivered Orders Tab */}
            {orderTabValue === 2 && (
              <TableContainer component={Paper} sx={{ 
                boxShadow: 'none', 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isOrdersLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={40} />
                          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                            Loading orders...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : salesOrders.length > 0 ? (
                      salesOrders.map((order) => (
                        <TableRow key={order.id} className="data-row">
                          <TableCell>{order.orderNumber || `ORD-${order.id}`}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.productName || 'Multiple items'}</TableCell>
                          <TableCell>{order.quantity?.toLocaleString()}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell>{order.totalAmount.toLocaleString()}</TableCell>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No delivered orders found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Empty state if no orders */}
            {!isOrdersLoading && salesOrders.length === 0 && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                height: '300px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <LocalShipping sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                <Typography variant="h6" sx={{ 
                  color: '#7f8c8d', 
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500
                }}>
                  {orderTabValue === 0 ? "No new orders found" : 
                   orderTabValue === 1 ? "No processing orders found" : 
                   "No delivered orders found"}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#95a5a6', 
                  fontFamily: 'Poppins, sans-serif',
                  mt: 1
                }}>
                  {orderTabValue === 0 ? "New orders will appear here" : 
                   orderTabValue === 1 ? "Processing orders will appear here" : 
                   "Delivered orders will appear here"}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Approve Order Modal */}
      <Modal
        open={openApproveModal}
        onClose={handleCloseApproveModal}
        aria-labelledby="approve-order-modal"
        className="inventory-modal approve-modal"
      >
        <div className="modal-content" style={{
          backgroundColor: '#f8f9ff',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(230, 230, 250, 0.7)',
          position: 'relative'
        }}>
          <div className="modal-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            position: 'sticky',
            top: 0,
            backgroundColor: '#f8f9ff',
            zIndex: 10,
            padding: '0 0 16px 0',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}>
            <div>
              <h2 className="modal-title" style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#2c3e50',
                margin: 0,
                background: 'linear-gradient(45deg, #00C853, #2196F3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}>
                Approve Order
              </h2>
              <p style={{
                margin: '5px 0 0',
                fontSize: '0.85rem',
                color: '#7f8c8d',
                fontFamily: 'Poppins, sans-serif'
              }}>
                {selectedOrder ? `Order #${selectedOrder.orderNumber || selectedOrder.id}` : 'Order details'}
              </p>
            </div>
            <IconButton 
              onClick={handleCloseApproveModal}
              sx={{
                color: '#95a5a6',
                '&:hover': { 
                  color: '#e74c3c',
                  backgroundColor: 'rgba(231, 76, 60, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className="approve-form" style={{ marginTop: '20px' }}>
            <TextField
              label="Remarks"
              multiline
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Add any notes or special instructions for this order"
              sx={{ mb: 3 }}
            />

            <TextField
              label="Delivery Date"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 4 }}
              inputProps={{
                min: new Date().toISOString().split('T')[0] // Set min date to today
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button
                variant="outlined"
                onClick={handleCloseApproveModal}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  color: '#7f8c8d',
                  borderColor: '#bdc3c7',
                  '&:hover': {
                    borderColor: '#95a5a6',
                    backgroundColor: 'rgba(0,0,0,0.01)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleApproveOrder}
                disabled={isApproving}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  backgroundColor: '#00C853',
                  '&:hover': {
                    backgroundColor: '#00B34A'
                  }
                }}
              >
                {isApproving ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Processing...
                  </>
                ) : 'Approve Order'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Box>
  );
};

export default SupplierDashboard;