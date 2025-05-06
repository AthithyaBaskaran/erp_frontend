import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { showInventory } from '../Api/apiUrl';
import '../../styles/inventoryProducts.css';

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
}

const InventoryProducts: React.FC = () => {
  // State for sidebar
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
  // State for data
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  
  // State for pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for add/edit product dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stockQuantity: 0,
    categoryId: '',
    sku: ''
  });

  // Sidebar toggle handler
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Fetch data
  useEffect(() => {
    fetchInventoryData();
  }, []);
  
  // Filter products when search or filter changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, stockFilter, products]);

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
        setFilteredProducts(productData);
        
        // Process categories
        const categoryMap = new Map<number, Category>();
        productData.forEach((product: Product) => {
          if (product.categoryId !== null && product.categoryName) {
            if (!categoryMap.has(product.categoryId)) {
              categoryMap.set(product.categoryId, {
                id: product.categoryId,
                categoryName: product.categoryName
              });
            }
          }
        });
        
        setCategories(Array.from(categoryMap.values()));
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and filters
  const filterProducts = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.categoryName === categoryFilter
      );
    }
    
    // Apply stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(product => product.stockQuantity < 20);
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(product => product.stockQuantity === 0);
    }
    
    setFilteredProducts(filtered);
  };

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle category filter change
  const handleCategoryFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCategoryFilter(event.target.value as string);
  };
  
  // Handle stock filter change
  const handleStockFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStockFilter(event.target.value as string);
  };
  
  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // Handle dialog open for add
  const handleAddProduct = () => {
    setEditProduct(null);
    setNewProduct({
      name: '',
      price: 0,
      stockQuantity: 0,
      categoryId: '',
      sku: ''
    });
    setOpenDialog(true);
  };
  
  // Handle dialog open for edit
  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categoryId: product.categoryId ? product.categoryId.toString() : '',
      sku: product.sku
    });
    setOpenDialog(true);
  };
  
  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle form input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };
  
  // Handle form select change
  const handleSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as string;
    const value = event.target.value as string;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };
  
  // Handle form submit
  const handleSubmit = () => {
    // Here you would typically call an API to save the product
    console.log('Saving product:', newProduct);
    
    // For demo purposes, we'll just update the local state
    if (editProduct) {
      // Update existing product
      const updatedProducts = products.map(product => 
        product.id === editProduct.id 
          ? { 
              ...product, 
              name: newProduct.name,
              price: Number(newProduct.price),
              stockQuantity: Number(newProduct.stockQuantity),
              categoryId: newProduct.categoryId ? Number(newProduct.categoryId) : null,
              sku: newProduct.sku
            } 
          : product
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newId = Math.max(...products.map(p => p.id)) + 1;
      const categoryObj = categories.find(c => c.id.toString() === newProduct.categoryId);
      const newProductObj: Product = {
        id: newId,
        name: newProduct.name,
        price: Number(newProduct.price),
        stockQuantity: Number(newProduct.stockQuantity),
        categoryId: newProduct.categoryId ? Number(newProduct.categoryId) : null,
        categoryName: categoryObj ? categoryObj.categoryName : '',
        sku: newProduct.sku
      };
      setProducts([...products, newProductObj]);
    }
    
    setOpenDialog(false);
  };
  
  // Handle delete product
  const handleDeleteProduct = (id: number) => {
    // Here you would typically call an API to delete the product
    console.log('Deleting product with ID:', id);
    
    // For demo purposes, we'll just update the local state
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Critical';
    if (quantity < 20) return 'Low';
    return 'In Stock';
  };
  
  // Get stock status color
  const getStockStatusColor = (quantity: number) => {
    if (quantity === 0) return 'error';
    if (quantity < 10) return 'error';
    if (quantity < 20) return 'warning';
    return 'success';
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <main className="main-container">
        <div className="inventory-products">
          {/* Products Header */}
          <Box className="products-header">
            <Typography variant="h4" className="products-title">
              Inventory Products
            </Typography>
            <Box className="header-actions">
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                className="add-product-button"
                onClick={handleAddProduct}
              >
                Add Product
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
                Loading products...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Filters */}
              <Paper className="filters-container">
                <Box className="search-box">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    className="search-input"
                  />
                </Box>
                
                <Box className="filter-options">
                  <FormControl variant="outlined" className="filter-select">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={handleCategoryFilterChange}
                      label="Category"
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.categoryName}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl variant="outlined" className="filter-select">
                    <InputLabel>Stock Status</InputLabel>
                    <Select
                      value={stockFilter}
                      onChange={handleStockFilterChange}
                      label="Stock Status"
                    >
                      <MenuItem value="all">All Stock</MenuItem>
                      <MenuItem value="low">Low Stock</MenuItem>
                      <MenuItem value="out">Out of Stock</MenuItem>
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
              
              {/* Products Table */}
              <Paper className="products-table-container">
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Stock</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts
                        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                        .map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  {product.name.charAt(0)}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {product.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{product.sku}</TableCell>
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
                            <TableCell align="center">
                              <Chip 
                                label={getStockStatus(product.stockQuantity)} 
                                size="small" 
                                color={getStockStatusColor(product.stockQuantity) as any}
                                className={`status-chip ${getStockStatus(product.stockQuantity).toLowerCase().replace(' ', '-')}`}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Box className="action-buttons">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditProduct(product)}
                                  className="edit-button"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="delete-button"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      
                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Box className="empty-state">
                              <InventoryIcon className="empty-icon" />
                              <Typography variant="h6">No products found</Typography>
                              <Typography variant="body2">
                                Try adjusting your search or filter to find what you're looking for.
                              </Typography>
                              <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                className="add-product-button"
                                onClick={handleAddProduct}
                                sx={{ mt: 2 }}
                              >
                                Add Product
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {filteredProducts.length > 0 && (
                  <Box className="pagination-container">
                    <Pagination 
                      count={Math.ceil(filteredProducts.length / rowsPerPage)} 
                      page={page} 
                      onChange={handlePageChange}
                      color="primary"
                      className="pagination"
                    />
                  </Box>
                )}
              </Paper>
            </>
          )}
          
          {/* Add/Edit Product Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogContent>
              <Box className="dialog-form">
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  required
                />
                
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={newProduct.sku}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  required
                />
                
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={handleSelectChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stockQuantity"
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={handleInputChange}
                  margin="normal"
                  variant="outlined"
                  required
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                {editProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default InventoryProducts;