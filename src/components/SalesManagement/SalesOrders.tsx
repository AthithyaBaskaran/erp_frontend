import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Divider,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import {
  BsSearch,
  BsFilter,
  BsThreeDots,
  BsDownload,
  BsPrinter,
  BsPlus,
  BsEye,
  BsPencil,
  BsTrash,
  BsChevronDown,
  BsCalendar3,
  BsArrowDownUp
} from 'react-icons/bs';
import Header from '../Header';
import Sidebar from '../Sidebar';

// Sample data for orders
const orders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    date: '2023-05-01',
    amount: 1200,
    status: 'Completed',
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    date: '2023-05-02',
    amount: 850,
    status: 'Processing',
    paymentStatus: 'Paid',
    shippingStatus: 'In Transit'
  },
  {
    id: 'ORD-003',
    customer: 'Robert Johnson',
    date: '2023-05-03',
    amount: 2300,
    status: 'Completed',
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ORD-004',
    customer: 'Emily Davis',
    date: '2023-05-04',
    amount: 1500,
    status: 'Pending',
    paymentStatus: 'Pending',
    shippingStatus: 'Pending'
  },
  {
    id: 'ORD-005',
    customer: 'Michael Brown',
    date: '2023-05-05',
    amount: 950,
    status: 'Completed',
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ORD-006',
    customer: 'Sarah Wilson',
    date: '2023-05-06',
    amount: 1750,
    status: 'Processing',
    paymentStatus: 'Paid',
    shippingStatus: 'Preparing'
  },
  {
    id: 'ORD-007',
    customer: 'David Miller',
    date: '2023-05-07',
    amount: 2100,
    status: 'Completed',
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
  {
    id: 'ORD-008',
    customer: 'Jennifer Taylor',
    date: '2023-05-08',
    amount: 1300,
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    shippingStatus: 'Cancelled'
  },
  {
    id: 'ORD-009',
    customer: 'Thomas Anderson',
    date: '2023-05-09',
    amount: 1850,
    status: 'Processing',
    paymentStatus: 'Paid',
    shippingStatus: 'In Transit'
  },
  {
    id: 'ORD-010',
    customer: 'Lisa Martinez',
    date: '2023-05-10',
    amount: 2250,
    status: 'Completed',
    paymentStatus: 'Paid',
    shippingStatus: 'Delivered'
  },
];

const SalesOrders: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, orderId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewOrder = () => {
    console.log('View order:', selectedOrder);
    handleMenuClose();
    setOpenDialog(true);
  };

  const handleEditOrder = () => {
    console.log('Edit order:', selectedOrder);
    handleMenuClose();
  };

  const handleDeleteOrder = () => {
    console.log('Delete order:', selectedOrder);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { bg: '#e6f7ee', color: '#2e7d32' };
      case 'processing':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'pending':
        return { bg: '#fff8e1', color: '#ed6c02' };
      case 'cancelled':
        return { bg: '#fce4ec', color: '#d32f2f' };
      default:
        return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  // Payment status color mapping
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return { bg: '#e6f7ee', color: '#2e7d32' };
      case 'pending':
        return { bg: '#fff8e1', color: '#ed6c02' };
      case 'refunded':
        return { bg: '#e8eaf6', color: '#3f51b5' };
      default:
        return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  // Shipping status color mapping
  const getShippingStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { bg: '#e6f7ee', color: '#2e7d32' };
      case 'in transit':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'preparing':
        return { bg: '#fff8e1', color: '#ed6c02' };
      case 'pending':
        return { bg: '#f3e5f5', color: '#9c27b0' };
      case 'cancelled':
        return { bg: '#fce4ec', color: '#d32f2f' };
      default:
        return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Get order details for the selected order
  const selectedOrderDetails = orders.find((order) => order.id === selectedOrder);

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      <main className="main-container">
        <Box sx={{ p: 3 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                Sales Orders
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                Manage and track all your sales orders
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<BsPlus />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1.2,
                px: 3,
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5e35b1 0%, #2575fc 100%)',
                  boxShadow: '0 8px 16px rgba(106, 17, 203, 0.3)',
                },
              }}
            >
              Create Order
            </Button>
          </Box>

          {/* Filters and Search */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
              <TextField
                placeholder="Search orders..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  minWidth: 240,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BsSearch />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="date-filter-label">Date</InputLabel>
                <Select
                  labelId="date-filter-label"
                  id="date-filter"
                  value={dateFilter}
                  label="Date"
                  onChange={(e) => setDateFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  startAdornment={<BsCalendar3 style={{ marginRight: 8 }} />}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<BsDownload />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<BsPrinter />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                }}
              >
                Print
              </Button>
            </Box>
          </Paper>

          {/* Orders Table */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        Order ID
                        <IconButton size="small">
                          <BsArrowDownUp size={12} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        Customer
                        <IconButton size="small">
                          <BsArrowDownUp size={12} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        Date
                        <IconButton size="small">
                          <BsArrowDownUp size={12} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        Amount
                        <IconButton size="small">
                          <BsArrowDownUp size={12} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Shipping</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow
                        key={order.id}
                        sx={{
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.03) },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'medium' }}>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell sx={{ fontWeight: 'medium' }}>${order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(order.status).bg,
                              color: getStatusColor(order.status).color,
                              fontWeight: 'medium',
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.paymentStatus}
                            size="small"
                            sx={{
                              bgcolor: getPaymentStatusColor(order.paymentStatus).bg,
                              color: getPaymentStatusColor(order.paymentStatus).color,
                              fontWeight: 'medium',
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.shippingStatus}
                            size="small"
                            sx={{
                              bgcolor: getShippingStatusColor(order.shippingStatus).bg,
                              color: getShippingStatusColor(order.shippingStatus).color,
                              fontWeight: 'medium',
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(event) => handleMenuOpen(event, order.id)}
                            aria-label="more options"
                          >
                            <BsThreeDots />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          {/* Actions Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                borderRadius: 2,
                minWidth: 150,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <MenuItem onClick={handleViewOrder} sx={{ gap: 1 }}>
              <BsEye size={16} />
              View Details
            </MenuItem>
            <MenuItem onClick={handleEditOrder} sx={{ gap: 1 }}>
              <BsPencil size={16} />
              Edit Order
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteOrder} sx={{ color: 'error.main', gap: 1 }}>
              <BsTrash size={16} />
              Delete Order
            </MenuItem>
          </Menu>

          {/* Order Details Dialog */}
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 'bold', fontFamily: '"Poppins", sans-serif' }}>
              Order Details - {selectedOrderDetails?.id}
            </DialogTitle>
            <DialogContent dividers>
              {selectedOrderDetails && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Order Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Order ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {selectedOrderDetails.id}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1">{selectedOrderDetails.date}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={selectedOrderDetails.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(selectedOrderDetails.status).bg,
                          color: getStatusColor(selectedOrderDetails.status).color,
                          fontWeight: 'medium',
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Customer Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Customer Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {selectedOrderDetails.customer}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">customer@example.com</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">+1 (555) 123-4567</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Order Items
                    </Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ mb: 3 }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Sample order items */}
                          <TableRow>
                            <TableCell>Product 1</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell>$250.00</TableCell>
                            <TableCell>$500.00</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Product 2</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>$350.00</TableCell>
                            <TableCell>$350.00</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Product 3</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>$100.00</TableCell>
                            <TableCell>$300.00</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Payment Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Status
                      </Typography>
                      <Chip
                        label={selectedOrderDetails.paymentStatus}
                        size="small"
                        sx={{
                          bgcolor: getPaymentStatusColor(selectedOrderDetails.paymentStatus).bg,
                          color: getPaymentStatusColor(selectedOrderDetails.paymentStatus).color,
                          fontWeight: 'medium',
                          mt: 0.5,
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Method
                      </Typography>
                      <Typography variant="body1">Credit Card</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Transaction ID
                      </Typography>
                      <Typography variant="body1">TXN-12345678</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Shipping Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Shipping Status
                      </Typography>
                      <Chip
                        label={selectedOrderDetails.shippingStatus}
                        size="small"
                        sx={{
                          bgcolor: getShippingStatusColor(selectedOrderDetails.shippingStatus).bg,
                          color: getShippingStatusColor(selectedOrderDetails.shippingStatus).color,
                          fontWeight: 'medium',
                          mt: 0.5,
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Shipping Address
                      </Typography>
                      <Typography variant="body1">
                        123 Main St, Apt 4B
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tracking Number
                      </Typography>
                      <Typography variant="body1">TRK-87654321</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                          <Typography variant="body1">Subtotal:</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            ${(selectedOrderDetails.amount * 0.9).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                          <Typography variant="body1">Tax (10%):</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            ${(selectedOrderDetails.amount * 0.1).toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                          <Typography variant="body1">Shipping:</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            $0.00
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Total:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            ${selectedOrderDetails.amount.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCloseDialog}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'medium' }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                }}
              >
                Update Order
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </main>
    </div>
  );
};

export default SalesOrders;