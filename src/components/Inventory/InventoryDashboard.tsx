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
  Badge,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ShoppingCart as ShoppingCartIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  AttachMoney as AttachMoneyIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { showInventory } from '../Api/apiUrl';
import '../../styles/inventoryDashboard.css';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  ChartTooltip,
  ChartLegend
);

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
  categoryId: number | null;
  categoryName: string;
  sku: string;
}

interface Category {
  id: number;
  categoryName: string;
  productCount?: number;
  color?: string;
}

const InventoryDashboard: React.FC = () => {
  // State for sidebar
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
  // State for data
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Sidebar toggle handler
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Fetch data
  useEffect(() => {
    fetchInventoryData();
    generateMockData(); // For demo purposes
  }, []);

  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null); // Reset any previous errors
      console.log('Fetching inventory data...');
      
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await showInventory();
      console.log('Raw API response:', response);
      
      if (response && response.data) {
        console.log('Inventory data:', response.data);
        
        // Process products - handle both array and object responses
        let productData = response.data;
        
        // If the API returns an object with a data property, use that
        if (response.data.data && Array.isArray(response.data.data)) {
          productData = response.data.data;
          console.log('Using nested data array:', productData);
        }
        
        // Ensure productData is an array
        if (!Array.isArray(productData)) {
          console.error('Product data is not an array:', productData);
          productData = [];
          
          // Use mock data if API returns invalid format
          productData = [
            { id: 1, name: "Dairy Milk", price: 5.0, stockQuantity: 50, categoryId: 1, categoryName: "Chocolate", sku: "PC0001" },
            { id: 2, name: "Snickers", price: 4.0, stockQuantity: 65, categoryId: 1, categoryName: "Chocolate", sku: "PC0002" },
            { id: 3, name: "Kitkat", price: 4.5, stockQuantity: 75, categoryId: 1, categoryName: "Chocolate", sku: "PC0003" },
            { id: 4, name: "Lays Classic", price: 3.5, stockQuantity: 100, categoryId: 2, categoryName: "Chips", sku: "PC0004" },
            { id: 5, name: "Milky biscuit", price: 9.98, stockQuantity: 150, categoryId: 3, categoryName: "Biscuit", sku: "PC0005" }
          ];
        }
        
        setProducts(productData);
        
        // Set low stock products (less than 20 items)
        const lowStock = productData.filter((product: Product) => product.stockQuantity < 20);
        setLowStockProducts(lowStock);
        
        // Process categories
        const categoryMap = new Map<number, Category>();
        productData.forEach((product: Product) => {
          if (product.categoryId !== null && product.categoryName) {
            if (!categoryMap.has(product.categoryId)) {
              categoryMap.set(product.categoryId, {
                id: product.categoryId,
                categoryName: product.categoryName,
                productCount: 1
              });
            } else {
              const category = categoryMap.get(product.categoryId);
              if (category) {
                category.productCount = (category.productCount || 0) + 1;
              }
            }
          } else if (product.categoryName && !product.categoryId) {
            // Handle products with categoryName but no categoryId
            const existingCategory = Array.from(categoryMap.values()).find(
              cat => cat.categoryName.toLowerCase() === product.categoryName.toLowerCase()
            );
            
            if (existingCategory) {
              existingCategory.productCount = (existingCategory.productCount || 0) + 1;
            } else {
              // Create a temporary ID for this category
              const tempId = -1 * (categoryMap.size + 1);
              categoryMap.set(tempId, {
                id: tempId,
                categoryName: product.categoryName,
                productCount: 1
              });
            }
          }
        });
        
        setCategories(Array.from(categoryMap.values()));
      } else {
        console.error('No data returned from API');
        setError('No data returned from server. Using sample data instead.');
        
        // Use mock data if API returns no data
        const mockProducts = [
          { id: 1, name: "Dairy Milk", price: 5.0, stockQuantity: 50, categoryId: 1, categoryName: "Chocolate", sku: "PC0001" },
          { id: 2, name: "Snickers", price: 4.0, stockQuantity: 65, categoryId: 1, categoryName: "Chocolate", sku: "PC0002" },
          { id: 3, name: "Kitkat", price: 4.5, stockQuantity: 75, categoryId: 1, categoryName: "Chocolate", sku: "PC0003" },
          { id: 4, name: "Lays Classic", price: 3.5, stockQuantity: 100, categoryId: 2, categoryName: "Chips", sku: "PC0004" },
          { id: 5, name: "Milky biscuit", price: 9.98, stockQuantity: 150, categoryId: 3, categoryName: "Biscuit", sku: "PC0005" }
        ];
        
        setProducts(mockProducts);
        const lowStock = mockProducts.filter(product => product.stockQuantity < 20);
        setLowStockProducts(lowStock);
        
        // Create mock categories
        const categories = [
          { id: 1, categoryName: "Chocolate", productCount: 3 },
          { id: 2, categoryName: "Chips", productCount: 1 },
          { id: 3, categoryName: "Biscuit", productCount: 1 }
        ];
        setCategories(categories);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        setError(`Error loading data: ${error.message}. Using sample data instead.`);
      } else {
        setError('An unknown error occurred. Using sample data instead.');
      }
      
      // Use mock data in case of error
      const mockProducts = [
        { id: 1, name: "Dairy Milk", price: 5.0, stockQuantity: 50, categoryId: 1, categoryName: "Chocolate", sku: "PC0001" },
        { id: 2, name: "Snickers", price: 4.0, stockQuantity: 65, categoryId: 1, categoryName: "Chocolate", sku: "PC0002" },
        { id: 3, name: "Kitkat", price: 4.5, stockQuantity: 75, categoryId: 1, categoryName: "Chocolate", sku: "PC0003" },
        { id: 4, name: "Lays Classic", price: 3.5, stockQuantity: 100, categoryId: 2, categoryName: "Chips", sku: "PC0004" },
        { id: 5, name: "Milky biscuit", price: 9.98, stockQuantity: 150, categoryId: 3, categoryName: "Biscuit", sku: "PC0005" }
      ];
      
      setProducts(mockProducts);
      const lowStock = mockProducts.filter(product => product.stockQuantity < 20);
      setLowStockProducts(lowStock);
      
      // Create mock categories
      const categories = [
        { id: 1, categoryName: "Chocolate", productCount: 3 },
        { id: 2, categoryName: "Chips", productCount: 1 },
        { id: 3, categoryName: "Biscuit", productCount: 1 }
      ];
      setCategories(categories);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for demo purposes
  const generateMockData = () => {
    // Mock popular products (would normally come from sales data)
    const mockPopularProducts = [
      { id: 1, name: "Dairy Milk", price: 5.0, stockQuantity: 50, categoryId: null, categoryName: "Chocolate", sku: "PC0001" },
      { id: 5, name: "Milky biscuit", price: 9.98, stockQuantity: 150, categoryId: null, categoryName: "Biscuit", sku: "PC0005" },
      { id: 3, name: "Kitkat", price: 4.5, stockQuantity: 75, categoryId: null, categoryName: "Chocolate", sku: "PC0003" },
      { id: 7, name: "Oreo", price: 3.99, stockQuantity: 120, categoryId: null, categoryName: "Biscuit", sku: "PC0007" },
      { id: 2, name: "Snickers", price: 4.0, stockQuantity: 65, categoryId: null, categoryName: "Chocolate", sku: "PC0002" }
    ];
    setPopularProducts(mockPopularProducts);
  };

  // Calculate total stock
  const calculateTotalStock = () => {
    return products.reduce((total, product) => total + product.stockQuantity, 0);
  };

  // Calculate total product count
  const getTotalProductCount = () => {
    return products.length;
  };

  // Calculate total category count
  const getTotalCategoryCount = () => {
    return categories.length;
  };

  // Calculate low stock percentage
  const getLowStockPercentage = () => {
    if (products.length === 0) return 0;
    return Math.round((lowStockProducts.length / products.length) * 100);
  };

  // Calculate inventory value
  const calculateInventoryValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stockQuantity), 0);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Refresh data
  const handleRefresh = () => {
    fetchInventoryData();
  };

  // Prepare chart data
  const categoryChartData = {
    labels: categories.map(cat => cat.categoryName),
    datasets: [
      {
        label: 'Products by Category',
        data: categories.map(cat => cat.productCount),
        backgroundColor: [
          'rgba(75, 137, 220, 0.7)',
          'rgba(244, 67, 54, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(156, 39, 176, 0.7)',
          'rgba(0, 188, 212, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(121, 85, 72, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const stockStatusData = {
    labels: ['Good Stock', 'Low Stock', 'Critical Stock'],
    datasets: [
      {
        label: 'Stock Status',
        data: [
          products.filter(p => p.stockQuantity > 20).length,
          products.filter(p => p.stockQuantity <= 20 && p.stockQuantity > 10).length,
          products.filter(p => p.stockQuantity <= 10).length
        ],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 152, 0, 0.7)',
          'rgba(244, 67, 54, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };



  // Check if we have a valid token
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('roles');
  
  // Debug information
  console.log('Rendering InventoryDashboard component');
  console.log('Token exists:', !!token);
  console.log('User role:', userRole);
  console.log('Products count:', products.length);
  console.log('Categories count:', categories.length);
  
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <main className="main-container">
        <div className="inventory-dashboard">
          {/* Dashboard Header */}
          <Box className="inventory-header">
            <Typography variant="h4" className="inventory-title">
              Inventory Dashboard
            </Typography>
            <Box className="header-actions">
              <Badge badgeContent={lowStockProducts.length} color="error" className="notification-badge">
                <IconButton className="header-icon-button">
                  <NotificationsIcon />
                </IconButton>
              </Badge>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                className="add-product-button"
              >
                Add Product
              </Button>
              <IconButton 
                onClick={handleRefresh} 
                className="refresh-button"
                aria-label="refresh"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          {!token ? (
            <Box className="loading-container">
              <Typography variant="h6" color="error">
                Authentication error. Please log in again.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => window.location.href = '/'}
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </Box>
          ) : loading ? (
            <Box className="loading-container">
              <CircularProgress size={60} className="loading-spinner" />
              <Typography variant="h6" className="loading-text">
                Loading inventory data...
              </Typography>
            </Box>
          ) : error ? (
            <Box className="loading-container">
              <Typography variant="h6" color="warning.main" sx={{ mb: 2 }}>
                {error}
              </Typography>
              {products.length > 0 ? (
                <Typography variant="body1" color="text.secondary">
                  Showing available data below.
                </Typography>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRefresh}
                  startIcon={<RefreshIcon />}
                  sx={{ mt: 2 }}
                >
                  Try Again
                </Button>
              )}
            </Box>
          ) : (
            <>
              {/* Overview Container */}
              <Box className="overview-container">
                <Typography variant="h5">Inventory Overview</Typography>
                <Typography variant="body1">
                  Welcome to your inventory dashboard. Here you can monitor your stock levels, 
                  track product performance, and manage your inventory efficiently.
                </Typography>
              </Box>

                  {/* Summary Cards */}
                  <Grid container spacing={3} className="dashboard-cards">
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className="dashboard-card">
                        <Box className="card-header">
                          <Box>
                            <Typography className="card-title">
                              Total Inventory
                            </Typography>
                            <Typography className="card-value">
                              {calculateTotalStock()}
                            </Typography>
                            <Box className="card-trend positive">
                              <ArrowUpwardIcon fontSize="small" />
                              <Typography variant="caption">
                                5% from last month
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="card-icon card-icon-products">
                            <InventoryIcon />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className="dashboard-card">
                        <Box className="card-header">
                          <Box>
                            <Typography className="card-title">
                              Low Stock Items
                            </Typography>
                            <Typography className="card-value">
                              {lowStockProducts.length}
                            </Typography>
                            <Box className="card-trend negative">
                              <ArrowDownwardIcon fontSize="small" />
                              <Typography variant="caption">
                                {getLowStockPercentage()}% of total products
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="card-icon card-icon-warning">
                            <WarningIcon />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className="dashboard-card">
                        <Box className="card-header">
                          <Box>
                            <Typography className="card-title">
                              Total Products
                            </Typography>
                            <Typography className="card-value">
                              {getTotalProductCount()}
                            </Typography>
                            <Box className="card-trend positive">
                              <ArrowUpwardIcon fontSize="small" />
                              <Typography variant="caption">
                                3 new this month
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="card-icon card-icon-orders">
                            <ShoppingCartIcon />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper className="dashboard-card">
                        <Box className="card-header">
                          <Box>
                            <Typography className="card-title">
                              Inventory Value
                            </Typography>
                            <Typography className="card-value">
                              {formatCurrency(calculateInventoryValue())}
                            </Typography>
                            <Box className="card-trend positive">
                              <ArrowUpwardIcon fontSize="small" />
                              <Typography variant="caption">
                                8% increase
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="card-icon card-icon-revenue">
                            <AttachMoneyIcon />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  {/* Charts Section */}
                  <Grid container spacing={3} className="charts-container">
                    <Grid item xs={12} md={6}>
                      <Paper className="chart-card">
                        <Box className="chart-header">
                          <Typography className="chart-title">
                            Category Distribution
                          </Typography>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box className="chart-container">
                          <Doughnut 
                            data={categoryChartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    font: {
                                      family: "'Quicksand', sans-serif",
                                      size: 12
                                    },
                                    padding: 20
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      const label = context.label || '';
                                      const value = context.raw || 0;
                                      return `${label}: ${value} products`;
                                    }
                                  }
                                }
                              },
                              cutout: '60%'
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper className="chart-card">
                        <Box className="chart-header">
                          <Typography className="chart-title">
                            Stock Status
                          </Typography>
                          <IconButton size="small">
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box className="chart-container">
                          <Doughnut 
                            data={stockStatusData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    font: {
                                      family: "'Quicksand', sans-serif",
                                      size: 12
                                    },
                                    padding: 20
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      const label = context.label || '';
                                      const value = context.raw || 0;
                                      return `${label}: ${value} products`;
                                    }
                                  }
                                }
                              },
                              cutout: '60%'
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  {/* Data Grid Section */}
                  <Grid container spacing={3} className="data-grid-container">
                    <Grid item xs={12} md={6}>
                      <Paper className="data-grid-card">
                        <Box className="data-grid-header">
                          <Typography className="data-grid-title">
                            Low Stock Products
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="small" 
                            className="view-all-button"
                          >
                            View All
                          </Button>
                        </Box>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell align="right">Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {lowStockProducts.slice(0, 5).map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                        {product.name.charAt(0)}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {product.name}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                          SKU: {product.sku}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={product.categoryName} 
                                      size="small" 
                                      className="category-chip"
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    {product.stockQuantity}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Chip 
                                      label={product.stockQuantity <= 10 ? "Critical" : "Low"} 
                                      size="small" 
                                      className={product.stockQuantity <= 10 ? "status-chip critical" : "status-chip warning"}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                              {lowStockProducts.length === 0 && (
                                <TableRow>
                                  <TableCell colSpan={4} align="center">
                                    <Box sx={{ py: 3 }}>
                                      <Typography variant="body2" color="textSecondary">
                                        No low stock products found
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper className="data-grid-card">
                        <Box className="data-grid-header">
                          <Typography className="data-grid-title">
                            Popular Products
                          </Typography>
                          <Button 
                            variant="contained" 
                            size="small" 
                            className="view-all-button"
                          >
                            View All
                          </Button>
                        </Box>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Stock</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {popularProducts.slice(0, 5).map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                        {product.name.charAt(0)}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {product.name}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                          SKU: {product.sku}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={product.categoryName} 
                                      size="small" 
                                      className="category-chip"
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    {formatCurrency(product.price)}
                                  </TableCell>
                                  <TableCell align="right">
                                    {product.stockQuantity}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                  </Grid>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;