      import React, { useState, useEffect } from 'react';
import '../../styles/simpleBookOrder.css';
import '../../styles/buttonStyles.css';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { 
showInventory, 
  fetchCategoriesApi, 
  createSalesOrder,
  showUsers
} from '../Api/apiUrl';

// Types  
interface Customer {
  id: number;
  name: string;
}

interface Category {
  id: number;
  categoryName: string; // Updated to match API response field name
}

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  stockQuantity: number; // Added stock quantity field
}

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

const SimpleBookOrder: React.FC = () => {
  // State for sidebar
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
  // State for form data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerNameError, setCustomerNameError] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // State for order items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // State for UI
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Sidebar toggle handler
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  // Fetch initial data
  useEffect(() => {
    fetchCustomers();
    fetchCategories();
    fetchProducts();
  }, []);

  // This effect is no longer needed as we're fetching products by category directly
  // from the API in the category selection handlers
  useEffect(() => {
    // Keep this empty useEffect for now in case we need to add additional logic later
  }, [selectedCategory, products]);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Using showUsers with empty search string to get all users as customers
      const response = await showUsers('');
      if (response && response.data) {
        // Map users to customer format if needed
        const customerData = response.data.map((user: any) => ({
          id: user.id,
          name: user.name
        }));
        setCustomers(customerData);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showSnackbar('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCategoriesApi();
      console.log('Categories API response:', response);
      
      // Handle the response based on the actual API structure
      if (response && response.statusCode === 200 && response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Unexpected category data format:', response);
        showSnackbar('Invalid category data format', 'error');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showSnackbar('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async (categoryId?: number) => {
    try {
      setLoading(true);
      const response = await showInventory(categoryId);
      
      console.log("API Response:", response);
      console.log("Response data structure:", response.data);
      
      if (response && response.data) {
        // Check if response.data is an array or has a data property that is an array
        let productsArray = Array.isArray(response.data) ? response.data : 
                           (response.data.data && Array.isArray(response.data.data) ? response.data.data : []);
        
        // Map the API response to include stock quantity
        const productsWithStock = productsArray.map((product: any) => ({
          ...product,
          stockQuantity: Math.floor(Math.random() * 100) + 1 // Simulating stock quantity (replace with actual data)
        }));
        
        console.log("Processed products:", productsWithStock);
        setProducts(productsWithStock);
        setFilteredProducts(productsWithStock);
        // Reset selected product when category changes
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showSnackbar('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add item to order and submit
  const addItemToOrder = () => {
    if (!customerName.trim()) {
      showSnackbar('Please enter a customer name', 'error');
      return;
    }

    if (customerNameError) {
      showSnackbar('Please correct the customer name (letters only)', 'error');
      return;
    }
    
    if (!selectedProduct) {
      showSnackbar('Please select a product', 'error');
      return;
    }

    if (quantity <= 0) {
      showSnackbar('Quantity must be greater than 0', 'error');
      return;
    }

    // Submit the order directly without adding to orderItems
    // This prevents duplicate items since submitOrder also adds the item
    submitOrder();
  };

  // Remove item from order
  const removeItem = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  // Calculate order total
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  // Submit order
  const submitOrder = async () => {
    if (!customerName.trim()) {
      showSnackbar('Please enter a customer name', 'error');
      return;
    }

    if (customerNameError) {
      showSnackbar('Please correct the customer name (letters only)', 'error');
      return;
    }

    if (!selectedProduct) {
      showSnackbar('Please select a product', 'error');
      return;
    }

    if (quantity <= 0) {
      showSnackbar('Quantity must be greater than 0', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Create current item
      const currentItem = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantity,
        price: selectedProduct.price,
        total: quantity * selectedProduct.price
      };
      
      // Add to order items
      const updatedItems = [...orderItems, currentItem];
      setOrderItems(updatedItems);
      
      // Calculate total amount
      const totalAmount = currentItem.price * currentItem.quantity;
      
      // Prepare order data according to the API requirements
      const orderData = {
        customer: customerName, // Use the entered customer name
        categoryId: selectedCategory ? selectedCategory.id : selectedProduct.categoryId, // Use selected category or product's category
        productName: selectedProduct.name,
        price_per_unit: selectedProduct.price,
        quantity: quantity,
        amount: totalAmount
      };

      console.log('Submitting order data:', orderData);
      const response = await createSalesOrder(orderData);
      
      if (response && response.statusCode === 200) {
        showSnackbar(response.statusMessage || 'Order created successfully!', 'success');
        console.log('Order created:', response.data);
        
        // Reset form after successful order
        setCustomerName('');
        setCustomerNameError('');
        setSelectedCategory(null);
        setSelectedProduct(null);
        setQuantity(1);
        setOrderItems([]);
      } else {
        showSnackbar(response?.statusMessage || 'Failed to create order', 'error');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      showSnackbar(error.message || 'Failed to create order', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Validate customer name (letters only)
  const validateCustomerName = (name: string) => {
    setCustomerName(name);
    
    if (name.trim() === '') {
      setCustomerNameError('');
      return;
    }
    
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;
    if (!lettersOnlyRegex.test(name)) {
      setCustomerNameError('Customer name should contain only letters');
    } else {
      setCustomerNameError('');
    }
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <main className="main-container">
        <Box sx={{ p: 3 }} className="book-order-container">
          <Box 
            sx={{ 
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
              boxShadow: '0 10px 20px rgba(106, 17, 203, 0.2)',
              padding: '30px 20px',
              textAlign: 'center'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle, #ffffff 10%, transparent 10%), radial-gradient(circle, #ffffff 10%, transparent 10%)',
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px'
              }}
            />
            
            <Stack 
              direction="row" 
              spacing={3} 
              alignItems="center" 
              justifyContent="center"
            >
              <Box 
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 45, color: '#ffffff' }} />
              </Box>
              
              <Box>
                <Typography 
                  variant="h3" 
                  align="center"
                  sx={{ 
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: '800',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    mb: 1
                  }}
                >
                  Book Order
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontFamily: '"Poppins", sans-serif',
                      color: '#ffffff',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      fontStyle: 'italic',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      padding: '6px 16px',
                      borderRadius: '30px',
                      display: 'inline-block',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(5px)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                        transform: 'translateX(-100%)',
                        animation: 'shimmer 2s infinite'
                      }
                    }}
                  >
                    Create and manage your sales orders efficiently
                  </Typography>
                </Box>

              </Box>
            </Stack>
            
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: '-15px',
                right: '-15px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }}
            />
          </Box>
          
          <Paper 
            elevation={3} 
            className="order-form"
          >
            <Box className="two-column-layout">
              <Box className="form-column">
                <Box className="form-section">
                  <Typography 
                    variant="subtitle1" 
                    className="form-label"
                    sx={{ 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    Customer Name
                  </Typography>
                  <TextField
                    placeholder="Enter Customer Name (letters only)"
                    variant="outlined"
                    fullWidth
                    required
                    value={customerName}
                    onChange={(e) => validateCustomerName(e.target.value)}
                    error={!!customerNameError}
                    helperText={customerNameError}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: customerNameError ? '#f44336' : '#e0e0e0'
                        }
                      }
                    }}
                  />
                </Box>
                
                <Box className="form-section">
                  <Typography 
                    variant="subtitle1" 
                    className="form-label"
                    sx={{ 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    Category
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedCategory?.id || ''}
                      displayEmpty
                      onChange={(e) => {
                        const categoryId = e.target.value as number;
                        const category = categories.find(cat => cat.id === categoryId) || null;
                        setSelectedCategory(category);
                        
                        // Fetch products for the selected category
                        if (categoryId) {
                          fetchProducts(categoryId);
                        } else {
                          // If "All Categories" is selected, fetch all products
                          fetchProducts();
                        }
                      }}
                      sx={{
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 'medium',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>All Categories</em>;
                        }
                        const category = categories.find(cat => cat.id === selected);
                        return category ? category.categoryName : '';
                      }}
                    >
                      <MenuItem value="">
                        <em>All Categories</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box className="form-section">
                  <Typography 
                    variant="subtitle1" 
                    className="form-label"
                    sx={{ 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    Product Name
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl fullWidth>
                      <Select
                        value={selectedProduct?.id || ''}
                        displayEmpty
                        onChange={(e) => {
                          const productId = e.target.value as number;
                          const product = products.find(prod => prod.id === productId) || null;
                          setSelectedProduct(product);
                        }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Select Product</em>;
                          }
                          const product = products.find(prod => prod.id === selected);
                          return product ? product.name : '';
                        }}
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          fontWeight: 'medium'
                        }}
                      >
                        <MenuItem value="">Select Product</MenuItem>
                        {filteredProducts.map((product) => (
                          <MenuItem 
                            key={product.id} 
                            value={product.id}
                            sx={{ fontFamily: '"Poppins", sans-serif' }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <InventoryIcon fontSize="small" />
                              <span>{product.name}</span>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {selectedProduct && (
                      <Box 
                        sx={{ 
                          bgcolor: '#e3f2fd', 
                          p: 1, 
                          borderRadius: 1,
                          minWidth: '100px',
                          textAlign: 'center',
                          border: '1px solid #90caf9'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#1976d2', 
                            fontFamily: '"Poppins", sans-serif',
                            fontWeight: 'bold'
                          }}
                        >
                          Stock: {selectedProduct.stockQuantity || 0}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Box className="form-column">
                <Box className="form-section">
                  <Typography 
                    variant="subtitle1" 
                    className="form-label"
                    sx={{ 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    Unit Price
                  </Typography>
                  <TextField
                    value={selectedProduct ? `$${selectedProduct.price.toFixed(2)}` : ''}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    placeholder="Unit Price"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 'medium'
                      }
                    }}
                  />
                </Box>
                
                <Box className="form-section">
                  <Typography 
                    variant="subtitle1" 
                    className="form-label"
                    sx={{ 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    Quantity
                  </Typography>
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    inputProps={{ min: 1 }}
                    fullWidth
                    placeholder="Enter Quantity"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 'medium'
                      }
                    }}
                  />
                </Box>
                
                <Box className="form-section">
                  <Typography 
                    variant="subtitle1" 
                    className="form-label"
                    sx={{ 
                      fontFamily: '"Poppins", sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                     Total Amount 
                  </Typography>
                  <TextField
                    value={selectedProduct ? `$${(selectedProduct.price * quantity).toFixed(2)}` : ''}
                    fullWidth
                    inputProps={{ readOnly: true }}
                    placeholder="Amount"
                    className="total-field"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 'bold',
                        color: '#1976d2'
                      }
                    }}
                  />
                </Box>
              </Box>
              
              {/* Book Order Button */}
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? null : <ShoppingCartIcon />}
                  onClick={addItemToOrder}
                  disabled={loading || !selectedProduct || !customerName.trim() || !!customerNameError}
                  className="book-order-button"
                  sx={{
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    borderRadius: '50px',
                    padding: '12px 30px',
                    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                    boxShadow: '0 10px 20px rgba(106, 17, 203, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5e35b1 0%, #2575fc 100%)',
                      boxShadow: '0 15px 30px rgba(106, 17, 203, 0.4)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Book Order'}
                </Button>
              </Box>
            </Box>
          </Paper>
          
          {/* Total Amount */}
          {orderItems.length > 0 && (
            <Paper elevation={3} className="order-form">
              <Box className="total-amount">
                <Typography variant="h6">
                  Total Amount: ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          )}
          
          {/* Alternative Button Styles Demo
          <Paper elevation={3} className="order-form" sx={{ mt: 4 }}>
            <Typography variant="h6" className="form-label" sx={{ mb: 3 }}>
              Alternative Button Styles
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              <Button className="flat-button">
                Flat Button
              </Button>
              
              <Button className="outlined-button">
                Outlined
              </Button>
              
              <Button className="text-button">
                Text Button
              </Button>
            </Box>
          </Paper>
           */}

        </Box>
      </main>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SimpleBookOrder;