import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { 
  createCustomer, 
  getAllCustomers, 
  getCustomerById, 
  updateCustomer, 
  deleteCustomer,
  createSalesOrder,
  getAllSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  deleteSalesOrder,
  createInvoice,
  getInvoicesByOrderId,
  createPayment,
  getPaymentsByOrderId
}  from '../Api/apiUrl';
import '../../styles/salesManagement.css';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SalesOrder {
  orderId: number;
  customerId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  customerName?: string;
}

interface Invoice {
  invoiceId: number;
  orderId: number;
  invoiceDate: string;
  totalAmount: number;
}

interface Payment {
  paymentId: number;
  orderId: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
}

// Icons Component
const Icons = {
  Add: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Delete: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
  View: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  ArrowUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
  ),
  ArrowDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Order: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  ),
  Invoice: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Payment: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  )
};

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let badgeClass = 'sales-badge ';
  
  switch (status.toUpperCase()) {
    case 'NEW':
      badgeClass += 'sales-badge-primary';
      break;
    case 'PENDING':
      badgeClass += 'sales-badge-warning';
      break;
    case 'SHIPPED':
    case 'DELIVERED':
      badgeClass += 'sales-badge-success';
      break;
    case 'CANCELLED':
      badgeClass += 'sales-badge-danger';
      break;
    default:
      badgeClass += 'sales-badge-info';
  }
  
  return <span className={badgeClass}>{status}</span>;
};

// Modal Component
const Modal: React.FC<{
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ show, onClose, title, children }) => {
  if (!show) return null;
  
  return (
    <div className="sales-modal-overlay" onClick={onClose}>
      <div className="sales-modal" onClick={e => e.stopPropagation()}>
        <div className="sales-modal-header">
          <h3 className="sales-modal-title">{title}</h3>
          <button className="sales-modal-close" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        <div className="sales-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main Component
const SalesManagement: React.FC = () => {
  // Sidebar state
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('customers');
  
  // Data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  // Form states
  const [customerForm, setCustomerForm] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [orderForm, setOrderForm] = useState<Omit<SalesOrder, 'orderId' | 'customerName'>>({
    customerId: 0,
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    status: 'NEW'
  });
  
  const [invoiceForm, setInvoiceForm] = useState<Omit<Invoice, 'invoiceId'>>({
    orderId: 0,
    invoiceDate: new Date().toISOString().split('T')[0],
    totalAmount: 0
  });
  
  const [paymentForm, setPaymentForm] = useState<Omit<Payment, 'paymentId'>>({
    orderId: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    paymentMethod: 'Credit Card'
  });
  
  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  
  // Edit states
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentCustomerId, setCurrentCustomerId] = useState<number | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  
  // Details view state
  const [detailsData, setDetailsData] = useState<any>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Loading and error states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data on component mount and tab change
  useEffect(() => {
    fetchData();
  }, [activeTab]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case 'customers':
          const customersData = await getAllCustomers();
          setCustomers(customersData || []);
          break;
        case 'orders':
          const ordersData = await getAllSalesOrders();
          
          // Fetch customer names for each order
          const ordersWithCustomers = await Promise.all(
            (ordersData || []).map(async (order: SalesOrder) => {
              try {
                const customerData = await getCustomerById(order.customerId);
                return {
                  ...order,
                  customerName: customerData?.name || 'Unknown Customer'
                };
              } catch (error) {
                return {
                  ...order,
                  customerName: 'Unknown Customer'
                };
              }
            })
          );
          
          setSalesOrders(ordersWithCustomers);
          break;
        default:
          break;
      }
    } catch (err: any) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Customer form handlers
  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      if (editMode && currentCustomerId) {
        response = await updateCustomer(currentCustomerId, customerForm);
      } else {
        response = await createCustomer(customerForm);
      }
      
      // Reset form and refresh data
      setCustomerForm({ name: '', email: '', phone: '', address: '' });
      setShowCustomerModal(false);
      setEditMode(false);
      setCurrentCustomerId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Order form handlers
  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({ 
      ...prev, 
      [name]: name === 'customerId' || name === 'totalAmount' ? Number(value) : value 
    }));
  };
  
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      if (editMode && currentOrderId) {
        response = await updateSalesOrder(currentOrderId, orderForm);
      } else {
        response = await createSalesOrder(orderForm);
      }
      
      // Reset form and refresh data
      setOrderForm({
        customerId: 0,
        orderDate: new Date().toISOString().split('T')[0],
        totalAmount: 0,
        status: 'NEW'
      });
      setShowOrderModal(false);
      setEditMode(false);
      setCurrentOrderId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to save order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Invoice form handlers
  const handleInvoiceFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInvoiceForm(prev => ({ 
      ...prev, 
      [name]: name === 'orderId' || name === 'totalAmount' ? Number(value) : value 
    }));
  };
  
  const handleInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createInvoice(invoiceForm);
      
      // Reset form and refresh data
      setInvoiceForm({
        orderId: 0,
        invoiceDate: new Date().toISOString().split('T')[0],
        totalAmount: 0
      });
      setShowInvoiceModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Payment form handlers
  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ 
      ...prev, 
      [name]: name === 'orderId' || name === 'amount' ? Number(value) : value 
    }));
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createPayment(paymentForm);
      
      // Reset form and refresh data
      setPaymentForm({
        orderId: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        amount: 0,
        paymentMethod: 'Credit Card'
      });
      setShowPaymentModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to create payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Edit handlers
  const handleEditCustomer = (customer: Customer) => {
    setCustomerForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setCurrentCustomerId(customer.id);
    setEditMode(true);
    setShowCustomerModal(true);
  };
  
  const handleEditOrder = (order: SalesOrder) => {
    setOrderForm({
      customerId: order.customerId,
      orderDate: order.orderDate,
      totalAmount: order.totalAmount,
      status: order.status
    });
    setCurrentOrderId(order.orderId);
    setEditMode(true);
    setShowOrderModal(true);
  };
  
  // Delete handlers
  const handleDeleteCustomer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setLoading(true);
      
      try {
        await deleteCustomer(id);
        fetchData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete customer. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleDeleteOrder = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setLoading(true);
      
      try {
        await deleteSalesOrder(id);
        fetchData();
      } catch (err: any) {
        setError(err.message || 'Failed to delete order. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // View details handlers
  const handleViewOrderDetails = async (orderId: number) => {
    setLoading(true);
    
    try {
      const orderData = await getSalesOrderById(orderId);
      const customerData = await getCustomerById(orderData.customerId);
      const invoicesData = await getInvoicesByOrderId(orderId);
      const paymentsData = await getPaymentsByOrderId(orderId);
      
      setDetailsData({
        order: orderData,
        customer: customerData,
        invoices: invoicesData || [],
        payments: paymentsData || []
      });
      
      setShowDetailsModal(true);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter functions
  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.orderId.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  // Render functions
  const renderCustomerForm = () => (
    <form className="sales-form" onSubmit={handleCustomerSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="name">Name</label>
        <input
          className="form-input"
          type="text"
          id="name"
          name="name"
          value={customerForm.name}
          onChange={handleCustomerFormChange}
          required
          placeholder="Enter customer name"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="email">Email</label>
        <input
          className="form-input"
          type="email"
          id="email"
          name="email"
          value={customerForm.email}
          onChange={handleCustomerFormChange}
          required
          placeholder="Enter customer email"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="phone">Phone</label>
        <input
          className="form-input"
          type="tel"
          id="phone"
          name="phone"
          value={customerForm.phone}
          onChange={handleCustomerFormChange}
          required
          placeholder="Enter customer phone"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="address">Address</label>
        <input
          className="form-input"
          type="text"
          id="address"
          name="address"
          value={customerForm.address}
          onChange={handleCustomerFormChange}
          required
          placeholder="Enter customer address"
        />
      </div>
      
      <div className="sales-modal-footer">
        <button 
          type="button" 
          className="sales-btn sales-btn-secondary"
          onClick={() => setShowCustomerModal(false)}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="sales-btn sales-btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : editMode ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>
    </form>
  );
  
  const renderOrderForm = () => (
    <form className="sales-form" onSubmit={handleOrderSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="customerId">Customer</label>
        <select
          className="form-select"
          id="customerId"
          name="customerId"
          value={orderForm.customerId}
          onChange={handleOrderFormChange}
          required
        >
          <option value="">Select a customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="orderDate">Order Date</label>
        <input
          className="form-input"
          type="date"
          id="orderDate"
          name="orderDate"
          value={orderForm.orderDate}
          onChange={handleOrderFormChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="totalAmount">Total Amount</label>
        <input
          className="form-input"
          type="number"
          id="totalAmount"
          name="totalAmount"
          value={orderForm.totalAmount}
          onChange={handleOrderFormChange}
          required
          min="0"
          step="0.01"
          placeholder="Enter total amount"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="status">Status</label>
        <select
          className="form-select"
          id="status"
          name="status"
          value={orderForm.status}
          onChange={handleOrderFormChange}
          required
        >
          <option value="NEW">New</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
      
      <div className="sales-modal-footer">
        <button 
          type="button" 
          className="sales-btn sales-btn-secondary"
          onClick={() => setShowOrderModal(false)}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="sales-btn sales-btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : editMode ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
  
  const renderInvoiceForm = () => (
    <form className="sales-form" onSubmit={handleInvoiceSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="orderId">Order</label>
        <select
          className="form-select"
          id="orderId"
          name="orderId"
          value={invoiceForm.orderId}
          onChange={handleInvoiceFormChange}
          required
        >
          <option value="">Select an order</option>
          {salesOrders.map(order => (
            <option key={order.orderId} value={order.orderId}>
              Order #{order.orderId} - {order.customerName}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="invoiceDate">Invoice Date</label>
        <input
          className="form-input"
          type="date"
          id="invoiceDate"
          name="invoiceDate"
          value={invoiceForm.invoiceDate}
          onChange={handleInvoiceFormChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="totalAmount">Total Amount</label>
        <input
          className="form-input"
          type="number"
          id="totalAmount"
          name="totalAmount"
          value={invoiceForm.totalAmount}
          onChange={handleInvoiceFormChange}
          required
          min="0"
          step="0.01"
          placeholder="Enter total amount"
        />
      </div>
      
      <div className="sales-modal-footer">
        <button 
          type="button" 
          className="sales-btn sales-btn-secondary"
          onClick={() => setShowInvoiceModal(false)}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="sales-btn sales-btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </div>
    </form>
  );
  
  const renderPaymentForm = () => (
    <form className="sales-form" onSubmit={handlePaymentSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="orderId">Order</label>
        <select
          className="form-select"
          id="orderId"
          name="orderId"
          value={paymentForm.orderId}
          onChange={handlePaymentFormChange}
          required
        >
          <option value="">Select an order</option>
          {salesOrders.map(order => (
            <option key={order.orderId} value={order.orderId}>
              Order #{order.orderId} - {order.customerName}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="paymentDate">Payment Date</label>
        <input
          className="form-input"
          type="date"
          id="paymentDate"
          name="paymentDate"
          value={paymentForm.paymentDate}
          onChange={handlePaymentFormChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="amount">Amount</label>
        <input
          className="form-input"
          type="number"
          id="amount"
          name="amount"
          value={paymentForm.amount}
          onChange={handlePaymentFormChange}
          required
          min="0"
          step="0.01"
          placeholder="Enter payment amount"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label" htmlFor="paymentMethod">Payment Method</label>
        <select
          className="form-select"
          id="paymentMethod"
          name="paymentMethod"
          value={paymentForm.paymentMethod}
          onChange={handlePaymentFormChange}
          required
        >
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
          <option value="PayPal">PayPal</option>
        </select>
      </div>
      
      <div className="sales-modal-footer">
        <button 
          type="button" 
          className="sales-btn sales-btn-secondary"
          onClick={() => setShowPaymentModal(false)}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="sales-btn sales-btn-primary"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Record Payment'}
        </button>
      </div>
    </form>
  );
  
  const renderOrderDetails = () => {
    if (!detailsData) return null;
    
    const { order, customer, invoices, payments } = detailsData;
    
    return (
      <div className="sales-details">
        <div className="sales-card">
          <h3 className="sales-subheading">Order Information</h3>
          <p><span className="sales-text-bold">Order ID:</span> {order.orderId}</p>
          <p><span className="sales-text-bold">Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p><span className="sales-text-bold">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
          <p><span className="sales-text-bold">Status:</span> <StatusBadge status={order.status} /></p>
        </div>
        
        <div className="sales-card">
          <h3 className="sales-subheading">Customer Information</h3>
          <p><span className="sales-text-bold">Name:</span> {customer.name}</p>
          <p><span className="sales-text-bold">Email:</span> {customer.email}</p>
          <p><span className="sales-text-bold">Phone:</span> {customer.phone}</p>
          <p><span className="sales-text-bold">Address:</span> {customer.address}</p>
        </div>
        
        {invoices.length > 0 && (
          <div className="sales-card">
            <h3 className="sales-subheading">Invoices</h3>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: Invoice) => (
                  <tr key={invoice.invoiceId}>
                    <td>{invoice.invoiceId}</td>
                    <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td>${invoice.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {payments.length > 0 && (
          <div className="sales-card">
            <h3 className="sales-subheading">Payments</h3>
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: Payment) => (
                  <tr key={payment.paymentId}>
                    <td>{payment.paymentId}</td>
                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>{payment.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="sales-modal-footer">
          <button 
            type="button" 
            className="sales-btn sales-btn-secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  
  const renderCustomersTab = () => (
    <div className="sales-content fade-in">
      <div className="sales-card-header">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
            <span className="search-icon"><Icons.Search /></span>
          </div>
          <button 
            className="sales-btn sales-btn-primary"
            onClick={() => {
              setEditMode(false);
              setCustomerForm({ name: '', email: '', phone: '', address: '' });
              setShowCustomerModal(true);
            }}
          >
            <Icons.Add /> Add Customer
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="sales-loading">Loading customers...</div>
      ) : error ? (
        <div className="sales-error">{error}</div>
      ) : filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icons.User /></div>
          <p className="empty-state-text">No customers found. Add your first customer to get started.</p>
        </div>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="slide-in">
                <td>{customer.id}</td>
                <td><span className="sales-text-bold">{customer.name}</span></td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>
                  <div className="btn-container">
                    <button 
                      className="sales-btn sales-btn-icon sales-btn-secondary"
                      onClick={() => handleEditCustomer(customer)}
                      title="Edit Customer"
                    >
                      <Icons.Edit />
                    </button>
                    <button 
                      className="sales-btn sales-btn-icon sales-btn-danger"
                      onClick={() => handleDeleteCustomer(customer.id)}
                      title="Delete Customer"
                    >
                      <Icons.Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  
  const renderOrdersTab = () => (
    <div className="sales-content fade-in">
      <div className="sales-card-header">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
            <span className="search-icon"><Icons.Search /></span>
          </div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            className="sales-btn sales-btn-primary"
            onClick={() => {
              setEditMode(false);
              setOrderForm({
                customerId: 0,
                orderDate: new Date().toISOString().split('T')[0],
                totalAmount: 0,
                status: 'NEW'
              });
              setShowOrderModal(true);
            }}
          >
            <Icons.Add /> Create Order
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="sales-loading">Loading orders...</div>
      ) : error ? (
        <div className="sales-error">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Icons.Order /></div>
          <p className="empty-state-text">No orders found. Create your first order to get started.</p>
        </div>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.orderId} className="slide-in">
                <td>{order.orderId}</td>
                <td><span className="sales-text-bold">{order.customerName}</span></td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>
                  <div className="btn-container">
                    <button 
                      className="sales-btn sales-btn-icon sales-btn-secondary"
                      onClick={() => handleViewOrderDetails(order.orderId)}
                      title="View Details"
                    >
                      <Icons.View />
                    </button>
                    <button 
                      className="sales-btn sales-btn-icon sales-btn-secondary"
                      onClick={() => handleEditOrder(order)}
                      title="Edit Order"
                    >
                      <Icons.Edit />
                    </button>
                    <button 
                      className="sales-btn sales-btn-icon sales-btn-danger"
                      onClick={() => handleDeleteOrder(order.orderId)}
                      title="Delete Order"
                    >
                      <Icons.Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  
  // Dashboard stats
  const renderDashboard = () => {
    const totalCustomers = customers.length;
    const totalOrders = salesOrders.length;
    const totalRevenue = salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = salesOrders.filter(order => order.status.toLowerCase() === 'pending').length;
    
    return (
      <div className="sales-content fade-in">
        <h2 className="sales-subheading">Sales Dashboard</h2>
        
        <div className="sales-dashboard">
          <div className="sales-stat-card">
            <div className="sales-stat-title">Total Customers</div>
            <div className="sales-stat-value">{totalCustomers}</div>
            <div className="sales-stat-change sales-stat-positive">
              <Icons.ArrowUp /> Growing
            </div>
          </div>
          
          <div className="sales-stat-card">
            <div className="sales-stat-title">Total Orders</div>
            <div className="sales-stat-value">{totalOrders}</div>
            <div className="sales-stat-change sales-stat-positive">
              <Icons.ArrowUp /> Active
            </div>
          </div>
          
          <div className="sales-stat-card">
            <div className="sales-stat-title">Total Revenue</div>
            <div className="sales-stat-value">${totalRevenue.toFixed(2)}</div>
            <div className="sales-stat-change sales-stat-positive">
              <Icons.ArrowUp /> Increasing
            </div>
          </div>
          
          <div className="sales-stat-card">
            <div className="sales-stat-title">Pending Orders</div>
            <div className="sales-stat-value">{pendingOrders}</div>
            <div className="sales-stat-change">
              Needs Attention
            </div>
          </div>
        </div>
        
        <div className="sales-card">
          <h3 className="sales-card-title">Recent Orders</h3>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesOrders.slice(0, 5).map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      <div className="sales-container">
        <h1 className="sales-heading">Sales Management</h1>
        
        <div className="sales-tabs">
          <div 
            className={`sales-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </div>
          <div 
            className={`sales-tab ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </div>
          <div 
            className={`sales-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </div>
          <div 
            className={`sales-tab ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('invoices');
              setShowInvoiceModal(true);
            }}
          >
            Create Invoice
          </div>
          <div 
            className={`sales-tab ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('payments');
              setShowPaymentModal(true);
            }}
          >
            Record Payment
          </div>
        </div>
        
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'customers' && renderCustomersTab()}
        {activeTab === 'orders' && renderOrdersTab()}
        
        {/* Modals */}
        <Modal 
          show={showCustomerModal} 
          onClose={() => setShowCustomerModal(false)}
          title={editMode ? 'Edit Customer' : 'Add New Customer'}
        >
          {renderCustomerForm()}
        </Modal>
        
        <Modal 
          show={showOrderModal} 
          onClose={() => setShowOrderModal(false)}
          title={editMode ? 'Edit Order' : 'Create New Order'}
        >
          {renderOrderForm()}
        </Modal>
        
        <Modal 
          show={showInvoiceModal} 
          onClose={() => setShowInvoiceModal(false)}
          title="Create Invoice"
        >
          {renderInvoiceForm()}
        </Modal>
        
        <Modal 
          show={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          title="Record Payment"
        >
          {renderPaymentForm()}
        </Modal>
        
        <Modal 
          show={showDetailsModal} 
          onClose={() => setShowDetailsModal(false)}
          title="Order Details"
        >
          {renderOrderDetails()}
        </Modal>
      </div>
    </div>
  );
};

export default SalesManagement;