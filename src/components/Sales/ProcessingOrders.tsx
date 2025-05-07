import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { 
  fetchSalesOrdersByStatus, 
  createInvoice, 
  createPayment 
} from '../Api/apiUrl';
import { SalesOrder } from '../../models/SalesOrder';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  Payment as PaymentIcon, 
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import '../../styles/processingOrders.css';

const ProcessingOrders: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | string>('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [paymentDate, setPaymentDate] = useState<Date | null>(new Date());
  const [paymentStatus, setPaymentStatus] = useState('Completed');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [orderDetails, setOrderDetails] = useState<{
    open: boolean;
    order: SalesOrder | null;
  }>({
    open: false,
    order: null
  });

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchSalesOrdersByStatus('PROCESSING');
      console.log('Fetched processing orders:', data);
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
        console.warn('No orders found or invalid data format');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentDialog = (order: SalesOrder) => {
    setSelectedOrder(order);
    setPaymentAmount(order.totalAmount || 0);
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
    setSelectedOrder(null);
    setPaymentAmount('');
    setPaymentMethod('Credit Card');
    setPaymentDate(new Date());
    setPaymentStatus('Completed');
  };

  const handleSubmitPayment = async () => {
    if (!selectedOrder || !paymentAmount || !paymentDate) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Format the date as YYYY-MM-DD
      const formattedDate = format(paymentDate, 'yyyy-MM-dd');
      
      // Create payment payload
      const paymentData = {
        orderId: typeof selectedOrder.orderId === 'string' 
          ? parseInt(selectedOrder.orderId.replace('ORD-', ''), 10) || selectedOrder.orderId 
          : selectedOrder.orderId,
        paymentDate: formattedDate,
        amount: typeof paymentAmount === 'string' ? parseFloat(paymentAmount) : paymentAmount,
        paymentMethod: paymentMethod,
        status: paymentStatus
      };
      
      console.log('Submitting payment:', paymentData);
      
      // Submit payment
      const response = await createPayment(paymentData);
      console.log('Payment response:', response);
      
      // Show success message
      showSnackbar(
        response.statusMessage || 'Payment processed successfully', 
        'success'
      );
      
      // Close dialog and refresh orders
      handleClosePaymentDialog();
      fetchOrders();
      
    } catch (error: any) {
      console.error('Error processing payment:', error);
      showSnackbar(error.message || 'Failed to process payment', 'error');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleGenerateInvoice = async (order: SalesOrder) => {
    try {
      setLoading(true);
      
      // Get the order ID
      const orderId = typeof order.orderId === 'string' 
        ? order.orderId 
        : `ORD-${order.orderId}`;
      
      console.log(`Generating invoice for order: ${orderId}`);
      
      // Create invoice
      const response = await createInvoice(orderId);
      console.log('Invoice response:', response);
      
      // Show success message
      showSnackbar(
        response.statusMessage || 'Invoice generated successfully', 
        'success'
      );
      
      // Refresh orders
      fetchOrders();
      
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      showSnackbar(error.message || 'Failed to generate invoice', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order: SalesOrder) => {
    setOrderDetails({
      open: true,
      order: order
    });
  };

  const handleCloseOrderDetails = () => {
    setOrderDetails({
      open: false,
      order: null
    });
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const filteredOrders = orders.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (order.orderId && order.orderId.toString().toLowerCase().includes(searchTermLower)) ||
      (order.customer && order.customer.toLowerCase().includes(searchTermLower)) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTermLower)) ||
      (order.productName && order.productName.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <main className="main-container">
        <div className="main-title">
          <h3>Processing Orders</h3>
        </div>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ width: '300px' }}
          />
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
        
        {loading && orders.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={3} sx={{ overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.orderId} hover>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>{order.customer || order.customerName || 'N/A'}</TableCell>
                        <TableCell>{order.productName || 'N/A'}</TableCell>
                        <TableCell>  
                          {order.orderDate 
                            ? new Date(order.orderDate).toLocaleDateString() 
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status || 'PROCESSING'} 
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{order.quantity || 'N/A'}</TableCell>
                        <TableCell>
                          ${typeof order.totalAmount === 'number' 
                            ? order.totalAmount.toFixed(2) 
                            : (typeof order.amount === 'number' 
                              ? order.amount.toFixed(2) 
                              : '0.00')}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleViewOrderDetails(order)}
                              title="View Details"
                              size="small"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              color="secondary" 
                              onClick={() => handleGenerateInvoice(order)}
                              title="Generate Invoice"
                              size="small"
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<PaymentIcon />}
                              onClick={() => handleOpenPaymentDialog(order)}
                            >
                              Payment
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {searchTerm ? 'No matching orders found' : 'No processing orders available'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
        
        {/* Payment Dialog */}
        <Dialog 
          open={openPaymentDialog} 
          onClose={handleClosePaymentDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">Process Payment</Typography>
          </DialogTitle>
          <DialogContent>
            {selectedOrder ? (
              <Box sx={{ pt: 2 }}>
                <Card variant="outlined" sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                        <Typography variant="body1" fontWeight="medium">{selectedOrder.orderNumber}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                        <Typography variant="body1">{selectedOrder.customer || selectedOrder.customerName || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Product</Typography>
                        <Typography variant="body1">{selectedOrder.productName || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                        <Typography variant="body1" fontWeight="medium" color="primary">
                          ${typeof selectedOrder.totalAmount === 'number' 
                            ? selectedOrder.totalAmount.toFixed(2) 
                            : (typeof selectedOrder.amount === 'number' 
                              ? selectedOrder.amount.toFixed(2) 
                              : '0.00')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" sx={{ mb: 2 }}>Payment Details</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Payment Amount"
                      variant="outlined"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        label="Payment Method"
                        required
                      >
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                        <MenuItem value="Debit Card">Debit Card</MenuItem>
                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                        <MenuItem value="Cash">Cash</MenuItem>
                        <MenuItem value="Check">Check</MenuItem>
                        <MenuItem value="PayPal">PayPal</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Payment Date"
                        value={paymentDate}
                        onChange={(newDate) => setPaymentDate(newDate)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            variant: 'outlined',
                            required: true
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        label="Payment Status"
                        required
                      >
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                        <MenuItem value="Refunded">Refunded</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleClosePaymentDialog}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitPayment}
              variant="contained" 
              color="primary"
              disabled={processingPayment || !paymentAmount || !paymentDate}
              startIcon={processingPayment ? <CircularProgress size={20} /> : <PaymentIcon />}
            >
              {processingPayment ? 'Processing...' : 'Process Payment'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Order Details Dialog */}
        <Dialog 
          open={orderDetails.open} 
          onClose={handleCloseOrderDetails}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">Order Details</Typography>
          </DialogTitle>
          <DialogContent>
            {orderDetails.order ? (
              <Box sx={{ p: 2 }}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
                        <Typography variant="body1" fontWeight="medium">{orderDetails.order.orderNumber}</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                        <Typography variant="body1">
                          {orderDetails.order.orderDate 
                            ? new Date(orderDetails.order.orderDate).toLocaleDateString() 
                            : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <Chip 
                          label={orderDetails.order.status || 'PROCESSING'} 
                          color="warning"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                        <Typography variant="body1" fontWeight="medium" color="primary">
                          ${typeof orderDetails.order.totalAmount === 'number' 
                            ? orderDetails.order.totalAmount.toFixed(2) 
                            : (typeof orderDetails.order.amount === 'number' 
                              ? orderDetails.order.amount.toFixed(2) 
                              : '0.00')}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                        <Typography variant="body1">
                          {orderDetails.order.customer || orderDetails.order.customerName || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">Product</Typography>
                        <Typography variant="body1">{orderDetails.order.productName || 'N/A'}</Typography>
                      </Grid>
                      
                      {orderDetails.order.quantity && (
                        <Grid item xs={6} md={3}>
                          <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                          <Typography variant="body1">{orderDetails.order.quantity}</Typography>
                        </Grid>
                      )}
                      
                      {orderDetails.order.price_per_unit && (
                        <Grid item xs={6} md={3}>
                          <Typography variant="subtitle2" color="text.secondary">Price Per Unit</Typography>
                          <Typography variant="body1">
                            ${orderDetails.order.price_per_unit.toFixed(2)}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
                
                {orderDetails.order.items && orderDetails.order.items.length > 0 && (
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>Order Items</Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orderDetails.order.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell align="right">{item.quantity}</TableCell>
                              <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                              <TableCell align="right">${item.subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<ReceiptIcon />}
                    onClick={() => handleGenerateInvoice(orderDetails.order!)}
                  >
                    Generate Invoice
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PaymentIcon />}
                    onClick={() => {
                      handleCloseOrderDetails();
                      handleOpenPaymentDialog(orderDetails.order!);
                    }}
                  >
                    Process Payment
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOrderDetails}>Close</Button>
          </DialogActions>
        </Dialog>
        
        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
};

export default ProcessingOrders;