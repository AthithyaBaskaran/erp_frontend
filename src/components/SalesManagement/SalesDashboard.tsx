import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Button,
  IconButton,
  Chip,
  Stack,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  Tooltip as MuiTooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  BsCart3,
  BsGraphUp,
  BsCalendar3,
  BsCurrencyDollar,
  BsArrowUp,
  BsArrowDown,
  BsPeople,
  BsBoxSeam,
  BsThreeDots,
  BsChevronRight,
  BsFilter,
  BsDownload,
  BsMoonStars,
  BsSun,
  BsGear
} from 'react-icons/bs';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Sample data for charts
const salesData = [
  { name: 'Jan', sales: 4000, target: 4500 },
  { name: 'Feb', sales: 3000, target: 3500 },
  { name: 'Mar', sales: 5000, target: 4500 },
  { name: 'Apr', sales: 2780, target: 3000 },
  { name: 'May', sales: 1890, target: 2000 },
  { name: 'Jun', sales: 2390, target: 2200 },
  { name: 'Jul', sales: 3490, target: 3000 },
];

const productPerformance = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Home Goods', value: 20 },
  { name: 'Books', value: 10 },
  { name: 'Other', value: 10 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 1200, status: 'Completed', date: '2023-05-01' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 850, status: 'Processing', date: '2023-05-02' },
  { id: 'ORD-003', customer: 'Robert Johnson', amount: 2300, status: 'Completed', date: '2023-05-03' },
  { id: 'ORD-004', customer: 'Emily Davis', amount: 1500, status: 'Pending', date: '2023-05-04' },
  { id: 'ORD-005', customer: 'Michael Brown', amount: 950, status: 'Completed', date: '2023-05-05' },
];

const topCustomers = [
  { name: 'John Doe', orders: 12, spent: 15000 },
  { name: 'Jane Smith', orders: 8, spent: 12000 },
  { name: 'Robert Johnson', orders: 10, spent: 9500 },
  { name: 'Emily Davis', orders: 6, spent: 8200 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Enhanced color palette
const ENHANCED_COLORS = {
  primary: {
    main: '#6366F1',
    light: '#818CF8',
    dark: '#4F46E5',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#EC4899',
    light: '#F472B6',
    dark: '#DB2777',
    contrastText: '#FFFFFF'
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF'
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#FFFFFF'
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF'
  },
  info: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrastText: '#FFFFFF'
  }
};

// Enhanced gradient backgrounds
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', // Purple-Indigo
  'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)', // Amber-Pink
  'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)', // Emerald-Blue
  'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)'  // Indigo-Pink
];

const SalesDashboard: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter);
    handleMenuClose();
  };

  // Calculate total sales and growth
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const lastMonthSales = salesData[salesData.length - 2]?.sales || 0;
  const currentMonthSales = salesData[salesData.length - 1]?.sales || 0;
  const salesGrowth = ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;

  // Status color mapping with enhanced colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: alpha(ENHANCED_COLORS.success.main, 0.15), color: ENHANCED_COLORS.success.main };
      case 'processing':
        return { bg: alpha(ENHANCED_COLORS.info.main, 0.15), color: ENHANCED_COLORS.info.main };
      case 'pending':
        return { bg: alpha(ENHANCED_COLORS.warning.main, 0.15), color: ENHANCED_COLORS.warning.main };
      default:
        return { bg: alpha(theme.palette.text.secondary, 0.1), color: theme.palette.text.secondary };
    }
  };

  return (
    <div className="grid-container" style={{ backgroundColor: darkMode ? '#111827' : '#F9FAFB' }}>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      <main className="main-container" style={{ backgroundColor: darkMode ? '#111827' : '#F9FAFB' }}>
        <Box sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          transition: 'all 0.3s ease',
          minHeight: '100vh'
        }}>
          {/* Dashboard Header with Controls */}
          <Box sx={{ 
            mb: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2
          }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                  mb: 1,
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  letterSpacing: '-0.01em',
                  transition: 'color 0.3s ease'
                }}
              >
                Sales Management Dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: darkMode ? '#D1D5DB' : theme.palette.text.secondary,
                  fontFamily: '"Poppins", sans-serif',
                  transition: 'color 0.3s ease'
                }}
              >
                Welcome back! Here's an overview of your sales performance
              </Typography>
            </Box>
            
            {/* Dashboard Controls */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {/* Time Period Filter */}
              <Button
                variant="outlined"
                startIcon={<BsFilter />}
                onClick={handleMenuOpen}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                  color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderColor: darkMode ? '#6B7280' : '#D1D5DB',
                  }
                }}
              >
                {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
              </Button>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: '10px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                <MenuItem onClick={() => handleTimeFilterChange('daily')}>Daily</MenuItem>
                <MenuItem onClick={() => handleTimeFilterChange('weekly')}>Weekly</MenuItem>
                <MenuItem onClick={() => handleTimeFilterChange('monthly')}>Monthly</MenuItem>
                <MenuItem onClick={() => handleTimeFilterChange('yearly')}>Yearly</MenuItem>
              </Menu>
              
              {/* Export Button */}
              <MuiTooltip title="Export data">
                <IconButton 
                  sx={{ 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: '10px',
                    color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <BsDownload />
                </IconButton>
              </MuiTooltip>
              
              {/* Settings Button */}
              <MuiTooltip title="Dashboard settings">
                <IconButton 
                  sx={{ 
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: '10px',
                    color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <BsGear />
                </IconButton>
              </MuiTooltip>
              
              {/* Dark Mode Toggle */}
              <FormControlLabel
                control={
                  <Switch 
                    checked={darkMode} 
                    onChange={handleDarkModeToggle} 
                    icon={<BsSun size={16} />}
                    checkedIcon={<BsMoonStars size={16} />}
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        color: '#F59E0B',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#6366F1',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4F46E5',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>
          </Box>

          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Total Sales */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: '100%',
                  borderRadius: '16px',
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 0.8) 100%)' 
                    : CARD_GRADIENTS[0],
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: darkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                    : '0 10px 20px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: darkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                      : '0 20px 25px rgba(99, 102, 241, 0.4)',
                  }
                }}
              >
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    zIndex: 0,
                  }}
                />
                
                {/* Content */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
                        mr: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <BsCurrencyDollar size={28} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, width: '100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9, 
                          fontSize: '0.95rem', 
                          fontWeight: 500,
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        Total Sales
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: { xs: '1.5rem', md: '1.8rem' }, 
                          letterSpacing: '-0.02em',
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        ${totalSales.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Growth indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      icon={salesGrowth >= 0 ? <BsArrowUp /> : <BsArrowDown />}
                      label={`${Math.abs(salesGrowth).toFixed(1)}%`}
                      size="small"
                      sx={{
                        bgcolor: salesGrowth >= 0 ? 'rgba(46, 125, 50, 0.25)' : 'rgba(211, 47, 47, 0.25)',
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 1,
                        mb: 0.5,
                        padding: '4px 0',
                        borderRadius: '8px',
                        '& .MuiChip-icon': {
                          color: 'white',
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9, 
                        fontWeight: 500,
                        whiteSpace: 'normal',
                        overflow: 'visible'
                      }}
                    >
                      vs last month
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: '100%',
                  borderRadius: '16px',
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)' 
                    : CARD_GRADIENTS[1],
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: darkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                    : '0 10px 20px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: darkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                      : '0 20px 25px rgba(245, 158, 11, 0.4)',
                  }
                }}
              >
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    zIndex: 0,
                  }}
                />
                
                {/* Content */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
                        mr: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <BsCart3 size={24} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, width: '100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9, 
                          fontSize: '0.95rem', 
                          fontWeight: 500,
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        Total Orders
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: { xs: '1.5rem', md: '1.8rem' }, 
                          letterSpacing: '-0.02em',
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        1,254
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Growth indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      icon={<BsArrowUp />}
                      label="12.5%"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(46, 125, 50, 0.25)',
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 1,
                        mb: 0.5,
                        padding: '4px 0',
                        borderRadius: '8px',
                        '& .MuiChip-icon': {
                          color: 'white',
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9, 
                        fontWeight: 500,
                        whiteSpace: 'normal',
                        overflow: 'visible'
                      }}
                    >
                      vs last month
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Categories */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: '100%',
                  borderRadius: '16px',
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%)' 
                    : CARD_GRADIENTS[2],
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: darkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                    : '0 10px 20px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: darkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                      : '0 20px 25px rgba(16, 185, 129, 0.4)',
                  }
                }}
              >
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 0,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    zIndex: 0,
                  }}
                />
                
                {/* Content */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
                        mr: 2,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <BsPeople size={24} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, width: '100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9, 
                          fontSize: '0.95rem', 
                          fontWeight: 500,
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        Categories
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700, 
                          fontSize: { xs: '1.5rem', md: '1.8rem' }, 
                          letterSpacing: '-0.02em',
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        845
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Growth indicator */}
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      icon={<BsArrowUp />}
                      label="8.2%"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(46, 125, 50, 0.25)',
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 1,
                        mb: 0.5,
                        padding: '4px 0',
                        borderRadius: '8px',
                        '& .MuiChip-icon': {
                          color: 'white',
                        }
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.9, 
                        fontWeight: 500,
                        whiteSpace: 'normal',
                        overflow: 'visible'
                      }}
                    >
                      vs last month
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Products */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: '100%',
                  borderRadius: '16px',
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)' 
                    : CARD_GRADIENTS[3],
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: darkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                    : '0 10px 20px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: darkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                      : '0 20px 25px rgba(99, 102, 241, 0.4)',
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 0,
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      <BsBoxSeam size={24} />
                    </Avatar>
                    <Box sx={{ minWidth: 0, width: '100%' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.8,
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        Products
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          whiteSpace: 'normal',
                          overflow: 'visible'
                        }}
                      >
                        3,156
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      icon={<BsArrowUp />}
                      label="15.3%"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(46, 125, 50, 0.2)',
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 1,
                        mb: 0.5
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        whiteSpace: 'normal',
                        overflow: 'visible'
                      }}
                    >
                      vs last month
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          </Box>

          {/* Charts Section */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              {/* Sales Performance Chart */} 
              <Grid item xs={12} lg={8}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: '16px',
                    boxShadow: darkMode 
                      ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                      : '0 10px 20px rgba(0, 0, 0, 0.05)',
                    height: '100%',
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: darkMode 
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                        : '0 20px 25px rgba(0, 0, 0, 0.08)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        fontFamily: '"Poppins", sans-serif',
                        color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                        fontSize: { xs: '1.1rem', md: '1.25rem' }
                      }}
                    >
                      Sales Performance
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label="Monthly"
                        size="small"
                        sx={{
                          bgcolor: timeFilter === 'monthly' ? ENHANCED_COLORS.primary.main : (darkMode ? 'rgba(255, 255, 255, 0.1)' : alpha(ENHANCED_COLORS.primary.main, 0.1)),
                          color: timeFilter === 'monthly' ? '#FFFFFF' : (darkMode ? '#F9FAFB' : ENHANCED_COLORS.primary.main),
                          fontWeight: 500,
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: timeFilter === 'monthly' ? ENHANCED_COLORS.primary.dark : (darkMode ? 'rgba(255, 255, 255, 0.15)' : alpha(ENHANCED_COLORS.primary.main, 0.15)),
                          }
                        }}
                        onClick={() => setTimeFilter('monthly')}
                      />
                      <Chip
                        label="Weekly"
                        size="small"
                        sx={{
                          bgcolor: timeFilter === 'weekly' ? ENHANCED_COLORS.primary.main : (darkMode ? 'rgba(255, 255, 255, 0.1)' : alpha(ENHANCED_COLORS.primary.main, 0.1)),
                          color: timeFilter === 'weekly' ? '#FFFFFF' : (darkMode ? '#F9FAFB' : ENHANCED_COLORS.primary.main),
                          fontWeight: 500,
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: timeFilter === 'weekly' ? ENHANCED_COLORS.primary.dark : (darkMode ? 'rgba(255, 255, 255, 0.15)' : alpha(ENHANCED_COLORS.primary.main, 0.15)),
                          }
                        }}
                        onClick={() => setTimeFilter('weekly')}
                      />
                      <Chip
                        label="Daily"
                        size="small"
                        sx={{
                          bgcolor: timeFilter === 'daily' ? ENHANCED_COLORS.primary.main : (darkMode ? 'rgba(255, 255, 255, 0.1)' : alpha(ENHANCED_COLORS.primary.main, 0.1)),
                          color: timeFilter === 'daily' ? '#FFFFFF' : (darkMode ? '#F9FAFB' : ENHANCED_COLORS.primary.main),
                          fontWeight: 500,
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: timeFilter === 'daily' ? ENHANCED_COLORS.primary.dark : (darkMode ? 'rgba(255, 255, 255, 0.15)' : alpha(ENHANCED_COLORS.primary.main, 0.15)),
                          }
                        }}
                        onClick={() => setTimeFilter('daily')}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ height: 350, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {timeFilter === 'monthly' ? (
                        <BarChart
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: darkMode ? '#D1D5DB' : theme.palette.text.secondary }} 
                            axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                          />
                          <YAxis 
                            tick={{ fill: darkMode ? '#D1D5DB' : theme.palette.text.secondary }} 
                            axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                              borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              color: darkMode ? '#F9FAFB' : theme.palette.text.primary
                            }} 
                          />
                          <Legend 
                            wrapperStyle={{ 
                              paddingTop: '10px',
                              color: darkMode ? '#D1D5DB' : theme.palette.text.secondary
                            }} 
                          />
                          <Bar 
                            dataKey="sales" 
                            name="Sales" 
                            fill={ENHANCED_COLORS.primary.main} 
                            radius={[4, 4, 0, 0]} 
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                          />
                          <Bar 
                            dataKey="target" 
                            name="Target" 
                            fill={ENHANCED_COLORS.secondary.main} 
                            radius={[4, 4, 0, 0]} 
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                            animationBegin={300}
                          />
                        </BarChart>
                      ) : timeFilter === 'weekly' ? (
                        <LineChart
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: darkMode ? '#D1D5DB' : theme.palette.text.secondary }} 
                            axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                          />
                          <YAxis 
                            tick={{ fill: darkMode ? '#D1D5DB' : theme.palette.text.secondary }} 
                            axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                              borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              color: darkMode ? '#F9FAFB' : theme.palette.text.primary
                            }} 
                          />
                          <Legend 
                            wrapperStyle={{ 
                              paddingTop: '10px',
                              color: darkMode ? '#D1D5DB' : theme.palette.text.secondary
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            name="Sales" 
                            stroke={ENHANCED_COLORS.primary.main} 
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="target" 
                            name="Target" 
                            stroke={ENHANCED_COLORS.secondary.main} 
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                            animationBegin={300}
                          />
                        </LineChart>
                      ) : (
                        <AreaChart
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: darkMode ? '#D1D5DB' : theme.palette.text.secondary }} 
                            axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                          />
                          <YAxis 
                            tick={{ fill: darkMode ? '#D1D5DB' : theme.palette.text.secondary }} 
                            axisLine={{ stroke: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                              borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              color: darkMode ? '#F9FAFB' : theme.palette.text.primary
                            }} 
                          />
                          <Legend 
                            wrapperStyle={{ 
                              paddingTop: '10px',
                              color: darkMode ? '#D1D5DB' : theme.palette.text.secondary
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            name="Sales" 
                            stroke={ENHANCED_COLORS.primary.main} 
                            fill={`url(#colorSales)`} 
                            strokeWidth={2}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="target" 
                            name="Target" 
                            stroke={ENHANCED_COLORS.secondary.main} 
                            fill={`url(#colorTarget)`} 
                            strokeWidth={2}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                            animationBegin={300}
                          />
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={ENHANCED_COLORS.primary.main} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={ENHANCED_COLORS.primary.main} stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={ENHANCED_COLORS.secondary.main} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={ENHANCED_COLORS.secondary.main} stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Product Performance */}
              <Grid item xs={12} lg={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: '20px',
                    boxShadow: darkMode 
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)' 
                      : '0 10px 25px rgba(0, 0, 0, 0.06)',
                    height: '100%',
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-7px) scale(1.01)',
                      boxShadow: darkMode 
                        ? '0 25px 30px -12px rgba(0, 0, 0, 0.4), 0 18px 20px -15px rgba(0, 0, 0, 0.2)' 
                        : '0 25px 30px rgba(0, 0, 0, 0.1)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #0088FE, #00C49F, #FFBB28, #FF8042)',
                      borderTopLeftRadius: '20px',
                      borderTopRightRadius: '20px',
                      opacity: 0.8
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    pb: 1.5,
                    borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
                  }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #0088FE, #00C49F)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                    >
                      <BsGraphUp size={14} color="#FFFFFF" />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        fontFamily: '"Poppins", sans-serif', 
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                        color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                        letterSpacing: '-0.01em'
                      }}
                    >
                      Product Categories
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: 'auto',
                    position: 'relative'
                  }}>
                    {/* Enhanced Pie Chart with Compact Design */}
                    <Box sx={{ 
                      position: 'relative',
                      height: 280,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1
                    }}>
                      {/* Center Summary Circle */}
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                      }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 700, 
                            color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                            fontSize: '1.5rem'
                          }}
                        >
                          {productPerformance.length}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: darkMode ? '#D1D5DB' : theme.palette.text.secondary,
                            fontSize: '0.75rem'
                          }}
                        >
                          Categories
                        </Typography>
                      </Box>

                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productPerformance}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110}
                            innerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={3}
                            label={({ percent }) => `${Math.round(percent * 100)}%`}
                            animationDuration={1500}
                            animationEasing="ease-out"
                          >
                            {productPerformance.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={darkMode ? `${COLORS[index % COLORS.length]}E6` : COLORS[index % COLORS.length]} 
                                stroke={darkMode ? '#1F2937' : '#FFFFFF'}
                                strokeWidth={3}

                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                              borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                              color: darkMode ? '#F9FAFB' : theme.palette.text.primary
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>

                    {/* Simplified Legend */}
                    <Box sx={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      mt: 2
                    }}>
                      {productPerformance.map((item, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            p: 1,
                            borderRadius: '8px',
                            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                            minWidth: '110px',
                            flexGrow: 1
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '3px',
                              bgcolor: COLORS[index % COLORS.length],
                              mr: 1.5
                            }}
                          />
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                                fontSize: '0.8rem'
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 700,
                                color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                                fontSize: '0.9rem'
                              }}
                            >
                              {item.value}%
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          {/* Tables Section */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: '16px',
                  boxShadow: darkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                    : '0 10px 20px rgba(0, 0, 0, 0.05)',
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: darkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                      : '0 20px 25px rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      fontFamily: '"Poppins", sans-serif',
                      color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    Recent Orders
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<BsChevronRight />}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? '#F9FAFB' : ENHANCED_COLORS.primary.main,
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : alpha(ENHANCED_COLORS.primary.main, 0.05),
                        borderColor: darkMode ? '#6B7280' : ENHANCED_COLORS.primary.main,
                      }
                    }}
                  >
                    View All
                  </Button>
                </Box>
                <Box>
                  {recentOrders.map((order, index) => (
                    <Box
                      key={order.id}
                      sx={{
                        p: { xs: 1.5, md: 2 },
                        borderRadius: '12px',
                        mb: 2,
                        bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : alpha(ENHANCED_COLORS.primary.main, 0.03),
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : alpha(ENHANCED_COLORS.primary.main, 0.06),
                          transform: 'translateX(5px)',
                        },
                      }}
                    >
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={12} sm={3}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700,
                              color: darkMode ? '#F9FAFB' : theme.palette.text.primary
                            }}
                          >
                            {order.id}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: darkMode ? '#9CA3AF' : theme.palette.text.secondary,
                              fontSize: '0.8rem'
                            }}
                          >
                            {order.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: darkMode ? '#D1D5DB' : theme.palette.text.primary,
                              fontWeight: 500
                            }}
                          >
                            {order.customer}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700,
                              color: darkMode ? ENHANCED_COLORS.primary.light : ENHANCED_COLORS.primary.main
                            }}
                          >
                            ${order.amount.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(order.status).bg,
                              color: getStatusColor(order.status).color,
                              fontWeight: 600,
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              height: '24px'
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: darkMode ? '#9CA3AF' : theme.palette.text.secondary,
                              '&:hover': {
                                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.1)' : alpha(theme.palette.primary.main, 0.1),
                                color: darkMode ? '#F9FAFB' : ENHANCED_COLORS.primary.main
                              }
                            }}
                          >
                            <BsThreeDots />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Top Customers */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: '16px',
                  boxShadow: darkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                    : '0 10px 20px rgba(0, 0, 0, 0.05)',
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: darkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                      : '0 20px 25px rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      fontFamily: '"Poppins", sans-serif',
                      color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                      fontSize: { xs: '1.1rem', md: '1.25rem' }
                    }}
                  >
                    Top Customers
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<BsChevronRight />}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 500,
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      color: darkMode ? '#F9FAFB' : ENHANCED_COLORS.primary.main,
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : alpha(ENHANCED_COLORS.primary.main, 0.05),
                        borderColor: darkMode ? '#6B7280' : ENHANCED_COLORS.primary.main,
                      }
                    }}
                  >
                    View All
                  </Button>
                </Box>
                <List sx={{ width: '100%' }}>
                  {topCustomers.map((customer, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: '12px',
                        mb: 1.5,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(255, 255, 255, 0.08)' : alpha(ENHANCED_COLORS.primary.main, 0.06),
                          transform: 'translateX(5px)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: darkMode 
                              ? `${COLORS[index % COLORS.length]}40` 
                              : `${COLORS[index % COLORS.length]}20`,
                            color: COLORS[index % COLORS.length],
                            fontWeight: 'bold',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          {customer.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700,
                              color: darkMode ? '#F9FAFB' : theme.palette.text.primary,
                              fontSize: '0.95rem'
                            }}
                          >
                            {customer.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }} component="span">
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: darkMode ? '#9CA3AF' : theme.palette.text.secondary,
                                fontSize: '0.8rem'
                              }} 
                              component="span"
                            >
                              {customer.orders} orders
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ 
                                fontWeight: 700, 
                                color: darkMode ? ENHANCED_COLORS.primary.light : ENHANCED_COLORS.primary.main, 
                                ml: 1,
                                fontSize: '0.85rem'
                              }}
                              component="span"
                            >
                              ${customer.spent.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            </Grid>
    
        </Box>
      </main>
    </div>
  );
};

export default SalesDashboard;