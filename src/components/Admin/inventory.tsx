import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Alert, Autocomplete, Box, Button, Card, CardContent, Chip,
  CircularProgress, Divider, Grid, IconButton, Modal, Paper,
  Snackbar, Stack, TextField, Tooltip, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import Swal from 'sweetalert2';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer,
  Cell
} from 'recharts';
 
// Components
import Header from '../Header';
import Sidebar from '../Sidebar';
 
// API
import {
  fetchCategoriesApi, showInventory, addInventory,
  updateInventoryApi, deleteInventory
} from "../Api/apiUrl";
 
// // Styles
import "../../styles/Admin.css";
import "../../styles/inventory.css";
 
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
 
// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
 
const Inventory: React.FC = () => {
  // State management
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>('');
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
 
  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
 
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
 
  // Dashboard metrics
  const totalProducts = useMemo(() => inventoryItems.length, [inventoryItems]);
  const totalStock = useMemo(() =>
    inventoryItems.reduce((sum, item) => sum + item.stockQuantity, 0),
    [inventoryItems]
  );
  const totalValue = useMemo(() =>
    inventoryItems.reduce((sum, item) => sum + (item.price * item.stockQuantity), 0).toFixed(2),
    [inventoryItems]
  );
  const lowStockItems = useMemo(() =>
    inventoryItems.filter(item => item.stockQuantity < 10).length,
    [inventoryItems]
  );
 
  // Chart data
  const categoryData = useMemo(() => {
    const data: { [key: string]: { name: string, value: number } } = {};
   
    inventoryItems.forEach(item => {
      const categoryName = categories.find(cat => Number(cat.id) === item.categoryId)?.categoryName || 'Unknown';
     
      if (!data[categoryName]) {
        data[categoryName] = { name: categoryName, value: 0 };
      }
     
      data[categoryName].value += 1;
    });
   
    return Object.values(data);
  }, [inventoryItems, categories]);
 
  const stockValueData = useMemo(() => {
    const data: { name: string, value: number }[] = [];
   
    inventoryItems.forEach(item => {
      if (item.stockQuantity > 0) {
        data.push({
          name: item.name,
          value: item.price * item.stockQuantity
        });
      }
    });
   
    // Sort by value and take top 5
    return data.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [inventoryItems]);
 
  // Handlers
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
 
  const handleAddProduct = () => {
    resetInventory();
    setOpenUserModal(true);
  };
 
  const handleCloseUserModal = () => {
    setOpenUserModal(false);
  };
 
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedItem(null);
  };
 
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
 
  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenEditModal(true);
 
    // Pre-fill the form with the selected item's data
    setInventoryValue("name", item.name || "");
    setInventoryValue("sku", item.sku || "");
    setInventoryValue("price", item.price || 0);
    setInventoryValue("stockQuantity", item.stockQuantity || 0);
    setInventoryValue("categoryId", item.categoryId || 1);
  };
 
  // API calls
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await showInventory();
      const data = response?.data;
      setInventoryItems(Array.isArray(data) ? data : []);
    }
    catch (error) {
      console.error("Error fetching inventory:", error);
      showNotification("Failed to fetch inventory", "error");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchCategories = async () => {
    try {
      const response = await fetchCategoriesApi();
      const data = response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showNotification("Failed to fetch categories", "error");
    }
  };
 
  const handleDeleteInventory = async (id: number) => {
    Swal.fire({
      title: 'Delete Product',
      html: '<div style="font-family: Cabin, sans-serif; font-size: 1rem; margin-top: 10px;">Are you sure you want to delete this product?<br><span style="color: #F44336; font-weight: 500;">This action cannot be undone.</span></div>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'DELETE',
      cancelButtonText: 'CANCEL',
      customClass: {
        popup: 'swal2-popup',
        title: 'swal2-title',
        htmlContainer: 'swal2-html-container',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        icon: 'swal2-icon'
      },
      buttonsStyling: true,
      reverseButtons: true,
      focusCancel: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteInventory(id);
          Swal.fire({
            title: 'Deleted Successfully!',
            html: '<div style="font-family: Cabin, sans-serif; font-size: 1rem; margin-top: 10px;">The product has been removed from inventory.</div>',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              popup: 'swal2-popup',
              title: 'swal2-title',
              htmlContainer: 'swal2-html-container',
              icon: 'swal2-icon'
            },
            iconColor: '#00C853'
          });
          fetchInventory();
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire({
            title: 'Operation Failed',
            text: 'There was a problem deleting the product. Please try again.',
            icon: 'error',
            customClass: {
              popup: 'swal2-popup',
              title: 'swal2-title',
              htmlContainer: 'swal2-html-container',
              confirmButton: 'swal2-confirm',
              icon: 'swal2-icon'
            }
          });
        }
      }
    });
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
        fetchInventory();
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
 
  const handleUpdateInventory: SubmitHandler<InventoryFormData> = async (data) => {
    if (!selectedItem) return;
   
    try {
      setLoading(true);
      const response = await updateInventoryApi(selectedItem.id, {
        ...data,
        price: parseFloat(data.price.toFixed(2)),
      });
 
      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Product Updated Successfully!',
          text: 'Your inventory has been updated with the latest product information.',
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
        handleCloseEditModal();
        fetchInventory();
      }
    } catch (error: any) {
      const message = error?.message || "Update failed";
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: message,
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          confirmButton: 'swal2-confirm',
          icon: 'swal2-icon'
        }
      });
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };
 
  // Helper functions
  const showNotification = (message: string, severity: "success" | "error" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
 
  // Filter inventory items by category
  const filteredInventoryItems = useMemo(() => {
    if (!selectedCategoryId) return inventoryItems;
    return inventoryItems.filter(item => String(item.categoryId) === String(selectedCategoryId));
  }, [inventoryItems, selectedCategoryId]);
 
  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: 'name',
      headerName: 'Product Name',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value || "N/A"}>
          <span style={{
            fontWeight: 500,
            color: '#2c3e50',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {params.value || "N/A"}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 130,
      renderCell: (params) => (
        <Tooltip title={params.value || "N/A"}>
          <span style={{
            fontFamily: 'monospace',
            color: '#6c757d',
            fontSize: '0.875rem'
          }}>
            {params.value || "N/A"}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'price',
      headerName: 'Price ($)',
      width: 120,
      renderCell: (params) => (
        <Tooltip title={`$${Number(params.value).toFixed(2)}`}>
          <span style={{
            fontWeight: 600,
            color: '#2196F3'
          }}>
            ${Number(params.value).toFixed(2) || "N/A"}
          </span>
        </Tooltip>
      ),
    },
    {
      field: 'stockQuantity',
      headerName: 'Stock',
      width: 120,
      renderCell: (params) => {
        const stockLevel = Number(params.value);
        let statusClass = 'status-high';
       
        if (stockLevel <= 5) statusClass = 'status-low';
        else if (stockLevel <= 20) statusClass = 'status-medium';
       
        return (
          <Tooltip title={`${stockLevel} units in stock`}>
            <span className={`status-badge ${statusClass}`}>
              {stockLevel}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: 'categoryId',
      headerName: 'Category',
      width: 180,
      renderCell: (params) => {
        const category = categories.find(cat => Number(cat.id) === params.value);
        return (
          <Tooltip title={category?.categoryName || "Unknown"}>
            <Chip
              label={category?.categoryName || "Unknown"}
              color="primary"
              size="small"
              variant="outlined"
              sx={{
                borderRadius: '16px',
                fontWeight: 500,
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
                '& .MuiChip-label': {
                  padding: '0 12px',
                }
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 180,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#2c3e50',
            fontSize: '0.8rem'
          }}
        >
          ACTIONS
        </Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', width: '100%' }}>
          <IconButton
            onClick={() => handleEditClick(params.row)}
            size="small"
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              color: '#2196F3',
              width: 35,
              height: 35,
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(33, 150, 243, 0.2)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteInventory(params.row.id)}
            size="small"
            sx={{
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              color: '#F44336',
              width: 35,
              height: 35,
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(244, 67, 54, 0.2)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    },
  ];
 
  // Effects
  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);
 
  // Render
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
 
      <div className="inventory-container">
        <div className="inventory-content">
          <div className="inventory-header">
            <h1 className="inventory-title" style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '1.85rem',
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
              color: '#2c3e50'
            }}>
              INVENTORY MANAGEMENT
            </h1>
            <TextField
              placeholder="Search products..."
              size="small"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: '#6c757d', mr: 1 }} />
                ),
                style: { fontFamily: 'Cabin, sans-serif' }
              }}
              sx={{
                width: { xs: '100%', sm: 250 },
                '.MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </div>
 
          {/* Dashboard Cards */}
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Total Products</h3>
                  <p className="card-value">{totalProducts}</p>
                </div>
                <div className="card-icon card-icon-products">
                  <InventoryIcon sx={{ fontSize: 24 }} />
                </div>
              </div>
            </div>
           
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Total Stock</h3>
                  <p className="card-value">{totalStock}</p>
                </div>
                <div className="card-icon card-icon-stock">
                  <CategoryIcon sx={{ fontSize: 28 }} />
                </div>
              </div>
            </div>
           
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Total Value</h3>
                  <p className="card-value">${totalValue}</p>
                </div>
                <div className="card-icon card-icon-value">
                  <AttachMoneyIcon sx={{ fontSize: 28 }} />
                </div>
              </div>
            </div>
           
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Low Stock Items</h3>
                  <p className="card-value" style={{ color: lowStockItems > 0 ? '#F44336' : 'inherit' }}>
                    {lowStockItems}
                  </p>
                </div>
                <div className="card-icon card-icon-warning">
                  <WarningAmberIcon sx={{ fontSize: 28 }} />
                </div>
              </div>
            </div>
          </div>
 
         
          Inventory List
          <div className="inventory-list-header">
            {/* <h2 className="list-title" style={{
              fontFamily: 'Poppins, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '1.25rem',
              fontWeight: 600
            }}>
              INVENTORY LIST
            </h2> */}
           
            <div className="filter-container">
              <TextField
                select
                label="Filter by Category"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                size="small"
                sx={{
                  width: 250,
                  '& .MuiInputLabel-root': {
                    fontFamily: 'Cabin, sans-serif'
                  },
                  '& .MuiSelect-select': {
                    fontFamily: 'Cabin, sans-serif'
                  }
                }}
                SelectProps={{ native: true }}
                InputProps={{
                  startAdornment: (
                    <FilterListIcon sx={{ color: '#6c757d', mr: 1, fontSize: 20 }} />
                  ),
                }}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </TextField>
 
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#00C853',
                  color: 'white',
                  '&:hover': { backgroundColor: '#00B34E' },
                  px: 2.5,
                  py: 1,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 200, 83, 0.2)',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleAddProduct}
                className="add-button"
              >
                Add Product
              </Button>
            </div>
          </div>
 
          <div className="inventory-table-container">
            {loading ? (
              <div className="loading-container">
                <CircularProgress />
              </div>
            ) : (
              <DataGrid
                rows={filteredInventoryItems}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                getRowHeight={() => 60}
                columnVisibilityModel={{
                  actions: true
                }}
                hideFooterSelectedRowCount
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f7fa',
                    borderRadius: '8px 8px 0 0',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#2c3e50',
                    fontSize: '0.8rem'
                  },
                  '& .MuiDataGrid-cellContent': {
                    fontFamily: 'Cabin, sans-serif',
                    fontWeight: 500,
                    color: '#3a3a3a'
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    fontFamily: 'Cabin, sans-serif',
                    borderTop: '1px solid #f0f0f0'
                  },
                  '& .MuiTablePagination-root': {
                    fontFamily: 'Cabin, sans-serif'
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    backgroundColor: '#ffffff'
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.04)'
                  },
                  '& .MuiDataGrid-cell--withRenderer': {
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  '& .MuiDataGrid-columnHeader[data-field="actions"]': {
                    backgroundColor: '#f0f4f8'
                  },
                  border: 'none',
                  height: 450
                }}
              />
            )}
          </div>
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
                label="SKU"
                {...registerInventory("sku")}
                error={!!inventoryErrors.sku}
                helperText={inventoryErrors.sku?.message}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </div>
           
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div className="form-group">
                  <TextField
                    fullWidth
                    label="Price"
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
              </Grid>
             
              <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>
           
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
                  boxShadow: '0 4px 12px rgba(0, 200, 83, 0.2)'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Product'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
 
      {/* Edit Product Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-product-modal"
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
              EDIT PRODUCT
            </h2>
            <button className="close-button" onClick={handleCloseEditModal}>
              <CloseIcon />
            </button>
          </div>
          <div className="form-divider"></div>
         
          <form onSubmit={handleInventorySubmit(handleUpdateInventory)}>
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
                label="SKU"
                {...registerInventory("sku")}
                error={!!inventoryErrors.sku}
                helperText={inventoryErrors.sku?.message}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />
            </div>
           
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div className="form-group">
                  <TextField
                    fullWidth
                    label="Price"
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
              </Grid>
             
              <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>
           
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
           
            <div className="form-actions">
              <Button
                variant="outlined"
                onClick={handleCloseEditModal}
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
                className="submit-button"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  minWidth: '150px',
                  fontFamily: 'Poppins, sans-serif',
                  letterSpacing: '0.5px',
                  fontSize: '0.85rem',
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976D2' },
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
 
      {/* Custom Notification instead of Snackbar */}
      {openSnackbar && (
        <div className={`notification ${snackbarSeverity === 'success' ? 'notification-success' : 'notification-error'}`}>
          {snackbarSeverity === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
          <span>{snackbarMessage}</span>
          <button onClick={handleCloseSnackbar} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '8px' }}>
            <CloseIcon fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
};
 
export default Inventory;