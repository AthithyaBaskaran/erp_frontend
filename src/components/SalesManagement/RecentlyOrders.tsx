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
  Stack,
  CircularProgress
} from '@mui/material';
import {
  BsSearch,
  BsFilter,
  BsThreeDots,
  BsDownload,
  BsPrinter,
  BsEye,
  BsPencil,
  BsTrash,
  BsChevronDown,
  BsCalendar3,
  BsArrowDownUp,
  BsFileEarmarkPdf
} from 'react-icons/bs';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { SalesApiUrl } from '../Api/BaseUrl';
// @ts-ignore
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Define the order type based on the API response
interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  productName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  deliveryDate: string;
  remarks: string;
  quantity: number;
}

const RecentlyOrders: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Using SalesApiUrl which already has the authentication interceptor
        const response = await SalesApiUrl.get('/sales-orders/getOrderByStatus');
        
        if (response.data.statusCode === 200) {
          setOrders(response.data.data);
        } else {
          setError('Failed to fetch orders: ' + response.data.statusMessage);
        }
      } catch (err) {
        setError('Error fetching orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    // Check if user is authenticated before fetching
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrders();
    } else {
      setError('You must be logged in to view orders.');
      setLoading(false);
    }
  }, []);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, orderNumber: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(orderNumber);
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

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { bg: '#e6f7ee', color: '#2e7d32' };
      case 'processing':
      case 'in transit':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'pending':
        return { bg: '#fff8e1', color: '#ed6c02' };
      case 'cancelled':
        return { bg: '#fce4ec', color: '#d32f2f' };
      default:
        return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Get order details for the selected order
  const selectedOrderDetails = orders.find((order) => order.orderNumber === selectedOrder);

  // Generate PDF function
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Recently Orders Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Define the columns for the table
    const tableColumn = ["Order #", "Customer", "Product", "Date", "Status", "Amount", "Quantity"];
    
    // Define the rows for the table
    const tableRows = filteredOrders.map((order) => [
      order.orderNumber,
      order.customerName,
      order.productName,
      formatDate(order.orderDate),
      order.status,
      formatCurrency(order.totalAmount),
      order.quantity
    ]);
    
    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      }
    });
    
    // Save the PDF
    doc.save('recently_orders.pdf');
  };

  // Print function
  const handlePrint = () => {
    const printContent = document.getElementById('orders-table');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print_' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'height=600,width=800');
    
    printWindow?.document.write('<html><head><title>Recently Orders</title>');
    printWindow?.document.write('<style>');
    printWindow?.document.write(`
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      .header { text-align: center; margin-bottom: 20px; }
      .header h1 { margin-bottom: 5px; }
      .header p { margin-top: 0; color: #666; }
    `);
    printWindow?.document.write('</style>');
    printWindow?.document.write('</head><body>');
    printWindow?.document.write('<div class="header">');
    printWindow?.document.write('<h1>Recently Orders Report</h1>');
    printWindow?.document.write(`<p>Generated on: ${new Date().toLocaleDateString()}</p>`);
    printWindow?.document.write('</div>');
    
    if (printContent) {
      printWindow?.document.write('<table>');
      printWindow?.document.write('<thead><tr>');
      printWindow?.document.write('<th>Order #</th>');
      printWindow?.document.write('<th>Customer</th>');
      printWindow?.document.write('<th>Product</th>');
      printWindow?.document.write('<th>Date</th>');
      printWindow?.document.write('<th>Status</th>');
      printWindow?.document.write('<th>Amount</th>');
      printWindow?.document.write('<th>Quantity</th>');
      printWindow?.document.write('</tr></thead>');
      printWindow?.document.write('<tbody>');
      
      filteredOrders.forEach(order => {
        printWindow?.document.write('<tr>');
        printWindow?.document.write(`<td>${order.orderNumber}</td>`);
        printWindow?.document.write(`<td>${order.customerName}</td>`);
        printWindow?.document.write(`<td>${order.productName}</td>`);
        printWindow?.document.write(`<td>${formatDate(order.orderDate)}</td>`);
        printWindow?.document.write(`<td>${order.status}</td>`);
        printWindow?.document.write(`<td>${formatCurrency(order.totalAmount)}</td>`);
        printWindow?.document.write(`<td>${order.quantity}</td>`);
        printWindow?.document.write('</tr>');
      });
      
      printWindow?.document.write('</tbody></table>');
    }
    
    printWindow?.document.write('</body></html>');
    printWindow?.document.close();
    printWindow?.focus();
    
    // Print after content is loaded
    printWindow?.addEventListener('load', () => {
      printWindow.print();
      printWindow.close();
    });
  };

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
                Recently Orders
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontFamily: '"Poppins", sans-serif',
                }}
              >
                View and manage your recent sales orders
              </Typography>
            </Box>
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
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="in transit">In Transit</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<BsFileEarmarkPdf />}
                onClick={generatePDF}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                }}
              >
                Export PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<BsPrinter />}
                onClick={handlePrint}
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
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
                <Typography variant="h6">{error}</Typography>
                {error === 'You must be logged in to view orders.' && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = '/login'}
                  >
                    Go to Login
                  </Button>
                )}
              </Box>
            ) : (
              <>
                <TableContainer id="orders-table">
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            Order #
                            <IconButton size="small">
                              <BsArrowDownUp size={12} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            Date
                            <IconButton size="small">
                              <BsArrowDownUp size={12} />
                            </IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredOrders
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell sx={{ fontWeight: 'medium' }}>{order.orderNumber}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{order.productName}</TableCell>
                            <TableCell>{formatDate(order.orderDate)}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                size="small"
                                sx={{
                                  backgroundColor: getStatusColor(order.status).bg,
                                  color: getStatusColor(order.status).color,
                                  fontWeight: 'medium',
                                  borderRadius: 1,
                                }}
                              />
                            </TableCell>
                            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                            <TableCell>{order.quantity}</TableCell>
                            <TableCell>{order.remarks}</TableCell>

                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, order.orderNumber)}
                              >
                                <BsThreeDots />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      {filteredOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                            <Typography variant="body1" color="text.secondary">
                              No orders found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
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
              </>
            )}
          </Paper>
        </Box>
      </main>

      {/* Order Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
            minWidth: 150,
          },
        }}
      >
        <MenuItem onClick={handleViewOrder} sx={{ gap: 1 }}>
          <BsEye size={14} /> View Details
        </MenuItem>
        <MenuItem onClick={handleEditOrder} sx={{ gap: 1 }}>
          <BsPencil size={14} /> Edit Order
        </MenuItem>
        <MenuItem onClick={handleDeleteOrder} sx={{ gap: 1, color: 'error.main' }}>
          <BsTrash size={14} /> Delete Order
        </MenuItem>
      </Menu>

      {/* Order Details Dialog */}
      {selectedOrderDetails && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Order Details
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  {selectedOrderDetails.orderNumber}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  {selectedOrderDetails.customerName}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Product
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  {selectedOrderDetails.productName}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Quantity
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  {selectedOrderDetails.quantity}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  {formatDate(selectedOrderDetails.orderDate)}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Delivery Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                  {formatDate(selectedOrderDetails.deliveryDate)}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={selectedOrderDetails.status}
                  size="small"
                  sx={{
                    backgroundColor: getStatusColor(selectedOrderDetails.status).bg,
                    color: getStatusColor(selectedOrderDetails.status).color,
                    fontWeight: 'medium',
                    borderRadius: 1,
                    mb: 2,
                    mt: 0.5,
                  }}
                />

                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>
                  {formatCurrency(selectedOrderDetails.totalAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Remarks
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {selectedOrderDetails.remarks || 'No remarks available'}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5e35b1 0%, #2575fc 100%)',
                },
              }}
            >
              Print Order
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default RecentlyOrders;