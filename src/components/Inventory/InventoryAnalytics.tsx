import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { showInventory } from '../Api/apiUrl';
import '../../styles/inventoryAnalytics.css';

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
  value?: number;
  color?: string;
}

interface SalesData {
  month: string;
  sales: number;
  profit: number;
}

interface StockData {
  name: string;
  value: number;
  color: string;
}

const InventoryAnalytics: React.FC = () => {
  // State for sidebar
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
  // State for data
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  
  // State for filters
  const [timeRange, setTimeRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Chart colors
  const CHART_COLORS = [
    '#4b89dc', // Blue
    '#5a7baa', // Dark Blue
    '#F44336', // Red
    '#FF9800', // Orange
    '#4CAF50', // Green
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FFEB3B', // Yellow
    '#795548', // Brown
    '#607D8B'  // Gray
  ];

  // Sidebar toggle handler
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Fetch data
  useEffect(() => {
    fetchInventoryData();
    generateMockData();
  }, []);

  // Fetch inventory data
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await showInventory();
      
      if (response && response.data) {
        console.log('Inventory data:', response.data);
        
        // Process products
        const productData = response.data;
        setProducts(productData);
        
        // Process categories
        const categoryMap = new Map<number, Category>();
        productData.forEach((product: Product) => {
          if (product.categoryId !== null && product.categoryName) {
            if (!categoryMap.has(product.categoryId)) {
              categoryMap.set(product.categoryId, {
                id: product.categoryId,
                categoryName: product.categoryName,
                productCount: 1,
                value: product.price * product.stockQuantity,
                color: CHART_COLORS[Math.floor(Math.random() * CHART_COLORS.length)]
              });
            } else {
              const category = categoryMap.get(product.categoryId);
              if (category) {
                category.productCount = (category.productCount || 0) + 1;
                category.value = (category.value || 0) + (product.price * product.stockQuantity);
              }
            }
          } else if (product.categoryName && !product.categoryId) {
            // Handle products with categoryName but no categoryId
            const existingCategory = Array.from(categoryMap.values()).find(
              cat => cat.categoryName.toLowerCase() === product.categoryName.toLowerCase()
            );
            
            if (existingCategory) {
              existingCategory.productCount = (existingCategory.productCount || 0) + 1;
              existingCategory.value = (existingCategory.value || 0) + (product.price * product.stockQuantity);
            } else {
              // Create a temporary ID for this category
              const tempId = -1 * (categoryMap.size + 1);
              categoryMap.set(tempId, {
                id: tempId,
                categoryName: product.categoryName,
                productCount: 1,
                value: product.price * product.stockQuantity,
                color: CHART_COLORS[Math.floor(Math.random() * CHART_COLORS.length)]
              });
            }
          }
        });
        
        setCategories(Array.from(categoryMap.values()));
        
        // Generate stock data
        const stockStatusData = [
          { 
            name: 'Good Stock', 
            value: productData.filter((p: Product) => p.stockQuantity > 20).length,
            color: '#4CAF50'
          },
          { 
            name: 'Low Stock', 
            value: productData.filter((p: Product) => p.stockQuantity <= 20 && p.stockQuantity > 10).length,
            color: '#FF9800'
          },
          { 
            name: 'Critical Stock', 
            value: productData.filter((p: Product) => p.stockQuantity <= 10).length,
            color: '#F44336'
          }
        ];
        
        setStockData(stockStatusData);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for demo purposes
  const generateMockData = () => {
    // Mock sales data
    const mockSalesData = [
      { month: 'Jan', sales: 4000, profit: 2400 },
      { month: 'Feb', sales: 3000, profit: 1800 },
      { month: 'Mar', sales: 5000, profit: 3100 },
      { month: 'Apr', sales: 2780, profit: 1908 },
      { month: 'May', sales: 1890, profit: 1200 },
      { month: 'Jun', sales: 2390, profit: 1600 },
      { month: 'Jul', sales: 3490, profit: 2300 },
      { month: 'Aug', sales: 4000, profit: 2800 },
      { month: 'Sep', sales: 2500, profit: 1700 },
      { month: 'Oct', sales: 1500, profit: 900 },
      { month: 'Nov', sales: 2000, profit: 1300 },
      { month: 'Dec', sales: 5000, profit: 3500 }
    ];
    setSalesData(mockSalesData);
  };

  // Handle time range change
  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
  };
  
  // Handle category filter change
  const handleCategoryFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(event.target.value as string);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Calculate total inventory value
  const calculateTotalInventoryValue = () => {
    return products.reduce((total, product) => total + (product.price * product.stockQuantity), 0);
  };
  
  // Calculate average product price
  const calculateAveragePrice = () => {
    if (products.length === 0) return 0;
    const totalPrice = products.reduce((total, product) => total + product.price, 0);
    return totalPrice / products.length;
  };
  
  // Calculate total stock quantity
  const calculateTotalStock = () => {
    return products.reduce((total, product) => total + product.stockQuantity, 0);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <main className="main-container">
        <div className="inventory-analytics">
          {/* Analytics Header */}
          <Box className="analytics-header">
            <Typography variant="h4" className="analytics-title">
              Inventory Analytics
            </Typography>
            <Box className="header-actions">
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                className="download-button"
              >
                Export Report
              </Button>
              <IconButton 
                onClick={fetchInventoryData} 
                className="refresh-button"
                aria-label="refresh"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
          
          {loading ? (
            <Box className="loading-container">
              <CircularProgress size={60} className="loading-spinner" />
              <Typography variant="h6" className="loading-text">
                Loading analytics data...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Filters */}
              <Paper className="filters-container">
                <Box className="filter-options">
                  <FormControl variant="outlined" className="filter-select">
                    <InputLabel>Time Range</InputLabel>
                    <Select
                      value={timeRange}
                      onChange={handleTimeRangeChange}
                      label="Time Range"
                    >
                      <MenuItem value="week">Last Week</MenuItem>
                      <MenuItem value="month">Last Month</MenuItem>
                      <MenuItem value="quarter">Last Quarter</MenuItem>
                      <MenuItem value="year">Last Year</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl variant="outlined" className="filter-select">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={handleCategoryFilterChange}
                      label="Category"
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id.toString()}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<FilterListIcon />}
                    className="filter-button"
                  >
                    More Filters
                  </Button>
                </Box>
              </Paper>
              
              {/* Summary Cards */}
              <Grid container spacing={3} className="summary-cards">
                <Grid item xs={12} sm={6} md={4}>
                  <Paper className="summary-card">
                    <Box className="card-content">
                      <Box className="card-icon-container value">
                        <TrendingUpIcon className="card-icon" />
                      </Box>
                      <Box className="card-text">
                        <Typography variant="body2" className="card-label">
                          Total Inventory Value
                        </Typography>
                        <Typography variant="h4" className="card-value">
                          {formatCurrency(calculateTotalInventoryValue())}
                        </Typography>
                        <Typography variant="caption" className="card-subtitle">
                          Based on current stock levels
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Paper className="summary-card">
                    <Box className="card-content">
                      <Box className="card-icon-container price">
                        <BarChartIcon className="card-icon" />
                      </Box>
                      <Box className="card-text">
                        <Typography variant="body2" className="card-label">
                          Average Product Price
                        </Typography>
                        <Typography variant="h4" className="card-value">
                          {formatCurrency(calculateAveragePrice())}
                        </Typography>
                        <Typography variant="caption" className="card-subtitle">
                          Across {products.length} products
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Paper className="summary-card">
                    <Box className="card-content">
                      <Box className="card-icon-container stock">
                        <PieChartIcon className="card-icon" />
                      </Box>
                      <Box className="card-text">
                        <Typography variant="body2" className="card-label">
                          Total Stock Quantity
                        </Typography>
                        <Typography variant="h4" className="card-value">
                          {calculateTotalStock()}
                        </Typography>
                        <Typography variant="caption" className="card-subtitle">
                          Items in inventory
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              {/* Charts */}
              <Grid container spacing={3} className="charts-container">
                {/* Sales Trend Chart */}
                <Grid item xs={12} lg={8}>
                  <Paper className="chart-card">
                    <Box className="chart-header">
                      <Typography className="chart-title">
                        <TimelineIcon className="chart-title-icon" />
                        Sales & Inventory Trends
                      </Typography>
                      <Box className="chart-actions">
                        <Button 
                          variant="outlined" 
                          size="small" 
                          className="time-filter-button active"
                        >
                          Monthly
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          className="time-filter-button"
                        >
                          Quarterly
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          className="time-filter-button"
                        >
                          Yearly
                        </Button>
                      </Box>
                    </Box>
                    <Box className="chart-container">
                      <ResponsiveContainer width="100%" height={350}>
                        <AreaChart
                          data={salesData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value as number), '']}
                            contentStyle={{ 
                              borderRadius: '4px', 
                              border: 'none', 
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="sales" 
                            name="Sales" 
                            stroke="#4b89dc" 
                            fill="rgba(75, 137, 220, 0.2)" 
                            activeDot={{ r: 8 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="profit" 
                            name="Profit" 
                            stroke="#4CAF50" 
                            fill="rgba(76, 175, 80, 0.2)" 
                            activeDot={{ r: 8 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Category Distribution Chart */}
                <Grid item xs={12} md={6} lg={4}>
                  <Paper className="chart-card">
                    <Box className="chart-header">
                      <Typography className="chart-title">
                        <PieChartIcon className="chart-title-icon" />
                        Category Distribution
                      </Typography>
                    </Box>
                    <Box className="chart-container">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categories}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="categoryName"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {categories.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value as number), 'Value']}
                            contentStyle={{ 
                              borderRadius: '4px', 
                              border: 'none', 
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <Box className="chart-legend">
                        {categories.slice(0, 5).map((category, index) => (
                          <Box key={category.id} className="legend-item">
                            <Box 
                              className="legend-color" 
                              sx={{ backgroundColor: category.color || CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <Typography variant="body2" className="legend-label">
                              {category.categoryName}
                            </Typography>
                            <Typography variant="body2" className="legend-value">
                              {formatCurrency(category.value || 0)}
                            </Typography>
                          </Box>
                        ))}
                        {categories.length > 5 && (
                          <Button 
                            variant="text" 
                            className="view-more-button"
                          >
                            View All Categories
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Stock Status Chart */}
                <Grid item xs={12} md={6} lg={4}>
                  <Paper className="chart-card">
                    <Box className="chart-header">
                      <Typography className="chart-title">
                        <PieChartIcon className="chart-title-icon" />
                        Stock Status
                      </Typography>
                    </Box>
                    <Box className="chart-container">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stockData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {stockData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value} products`, '']}
                            contentStyle={{ 
                              borderRadius: '4px', 
                              border: 'none', 
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <Box className="chart-legend">
                        {stockData.map((item, index) => (
                          <Box key={index} className="legend-item">
                            <Box 
                              className="legend-color" 
                              sx={{ backgroundColor: item.color }}
                            />
                            <Typography variant="body2" className="legend-label">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" className="legend-value">
                              {item.value} products
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Category Performance Chart */}
                <Grid item xs={12} md={6} lg={8}>
                  <Paper className="chart-card">
                    <Box className="chart-header">
                      <Typography className="chart-title">
                        <BarChartIcon className="chart-title-icon" />
                        Category Performance
                      </Typography>
                    </Box>
                    <Box className="chart-container">
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                          data={categories}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="categoryName" 
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis 
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value as number), 'Value']}
                            contentStyle={{ 
                              borderRadius: '4px', 
                              border: 'none', 
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            }}
                          />
                          <Legend />
                          <Bar 
                            dataKey="value" 
                            name="Inventory Value" 
                            fill="#4b89dc" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
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

export default InventoryAnalytics;