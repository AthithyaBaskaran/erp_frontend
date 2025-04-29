
import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Header from '../Header'; // adjust path if needed
import Sidebar from '../Sidebar'; // if you have one
import { Alert, Autocomplete, Box, Button, IconButton, Modal, Snackbar, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from '@mui/icons-material/Close';
import { showUsers, fetchUserForEdit, fetchCategoriesApi } from '../Api/apiUrl';
import { getRegisterSchema } from "../Validations/ValidationSchema";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { deleteUser, addInventory, showInventory, deleteInventory, updateInventoryApi } from "../Api/apiUrl";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Admin.css";

interface Users {
  name: string;
  sku: string;
  phone: string;
  address: string;
  roleName: string;
  departmentName: string;
}

interface InventoryFormData {
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  stockQuantity: number
}

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
}
interface Cateogory {
  id?: string;
  categoryName: string;
}

const Inventory: React.FC = () => {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [users, SetUsers] = useState<Users[]>([]);


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);


  const [user, setUser] = useState<Users | null>(null); // Single user, can be null initially
  const [openUserModal, setOpenUserModal] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  
  const [categories, setCategories] = useState<Cateogory[]>([]);
  const [openEditModal, setOpenEditModal] = useState(false);
const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>('');
const [searchText, setSearchText] = useState('');





  const navigate = useNavigate();
  const location = useLocation();
  const isProductsPage = location.pathname === '/products';

  console.log("inventoryItems", inventoryItems);




  const {
    register: registerInventory,
    handleSubmit: handleInventorySubmit,
    setValue: setInventoryValue,
    reset: resetInventory,
    control: controlCategory,
    formState: { errors: InventoryErrors, isSubmitting: isInventory },
  } = useForm<InventoryFormData>();


  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };


  const handleAddUser = () => {
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedItem(null);
  };
  const handleOpenEditModal = (item: any) => {
    setSelectedItem(item);
    setOpenEditModal(true);

    // Pre-fill the form with the selected item's data
    setInventoryValue("name", item.name || "");
    setInventoryValue("sku", item.sku || "");
    setInventoryValue("price", item.price || 0);
    setInventoryValue("stockQuantity", item.stockQuantity || 0);
    setInventoryValue("categoryId", item.categoryId || 1);
  };



  const fetchInventory = async (categoryId?: number | string) => {
    try {
      console.log("Fetching inventory with categoryId:", categoryId);
      const response = await showInventory(categoryId as number);
      const data = response?.data;
      setInventoryItems(Array.isArray(data) ? data : []);
      
      // If we're filtering by category, update the UI to show which category is selected
      if (categoryId) {
        const selectedCategory = categories.find(cat => cat.id === String(categoryId));
        if (selectedCategory) {
          setSnackbarMessage(`✅ Showing items from category: ${selectedCategory.categoryName}`);
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
        }
      } else {
        const message = response?.statusMessage || "All inventory items fetched successfully";
        const fullMessage = `✅ ${message}`;
        setSnackbarMessage(fullMessage);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      }
    }
    catch (error) {
      setSnackbarMessage("❌ Failed to fetch inventory");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    // Reset category filter and fetch all inventory items when component mounts
    setSelectedCategoryId('');
    fetchInventory();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchCategoriesApi();
      const data = response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbarMessage("❌ Failed to fetch categories");
      setSnackbarSeverity("error");
      console.error("Error fetching categories:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

const handleUserEditClick = async (userId: number) => {
    try {
      setSelectedUserId(userId);
      setOpenEdit(true);

      const response = await fetchUserForEdit(userId);
      const data = response?.data.data ?? null;
      setUser(data);
    } catch (error) {
      setSnackbarMessage("❌ Failed to fetch user");
      setSnackbarSeverity("error");
      console.error("Error fetching user:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };


  const handleDeleteInventory = async (id: number) => {
    try {
      const response = await deleteInventory(id);
      const message = response?.statusMessage || "Inventory deleted successfully!";
      setSnackbarMessage(`✅ ${message}`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        fetchInventory();
      }, 1000);
    }
    catch (error) {
      setSnackbarMessage("❌ Failed to delete user");
      setSnackbarSeverity("error");
      console.error("Error deleting user:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };
  const handleInventory: SubmitHandler<InventoryFormData> = async (data) => {
    try {
      const response = await addInventory({
        ...data,
        // price: parseFloat(data.price.toFixed(2)), // or data.price.toFixed(2) if you want to send as string
        price: parseFloat(data.price.toFixed(2)), // or data.price.toFixed(2) if you want to send as string
      });

      if (response.data) {
        const message = response?.statusMessage || "User Added successfully!";
        setSnackbarMessage(`✅ ${message}`);
        setSnackbarSeverity("success");
        resetInventory();
        handleCloseUserModal();
        fetchInventory();
      }

      return response.data;
    } catch (error: any) {
      const message = error?.message || "❌ Registration failed";
      setSnackbarMessage(`❌ ${message}`);
      setSnackbarSeverity("error");
      console.error("Error logging in:", error);
    } finally {
      setOpenSnackbar(true);
    }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    fetchInventory(value || undefined); // Call API with search or undefined if empty
  };
    
  const handleCategoryChange = (event: any, newValue: Cateogory | null) => {
    if (newValue) {
      setSelectedCategoryId(newValue.id || '');
      fetchInventory(newValue.id);
    } else {
      setSelectedCategoryId('');
      fetchInventory(); // Fetch all inventory when no category is selected
    }
  };
  
  const handleUpdateInventory: SubmitHandler<InventoryFormData> = async (data) => {
    if (!selectedItem) return;
    
    try {
      const response = await updateInventoryApi(selectedItem.id, {
        ...data,
        price: parseFloat(data.price.toFixed(2)),
      });

      if (response) {
        const message = response?.statusMessage || "Inventory updated successfully!";
        setSnackbarMessage(`✅ ${message}`);
        setSnackbarSeverity("success");
        resetInventory();
        handleCloseEditModal();
        fetchInventory();
      }

      return response;
    } catch (error: any) {
      const message = error?.message || "❌ Update failed";
      setSnackbarMessage(`❌ ${message}`);
      setSnackbarSeverity("error");
      console.error("Error updating inventory:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: 'name', headerName: 'Name', width: 130, renderCell: (params) => (
        <span title={params.value || "N/A"}>
          {params.value || "N/A"}
        </span>
      ),
    },
    {
      field: 'sku',
      
      width: 130,
      renderCell: (params) => (
        <span title={params.value || "N/A"}>
          {params.value || "N/A"}
        </span>
      ),
    },
    {
      field: 'price', headerName: 'price Number', width: 130, renderCell: (params) => (
        <span title={params.value || "N/A"}>
          {params.value || "N/A"}
        </span>
      ),
    },
    {
      field: 'stockQuantity', headerName: 'stockQuantity', width: 130, renderCell: (params) => (
        <span title={params.value || "N/A"}>
          {params.value || "N/A"}
        </span>
      ),
    },
    {
      field: 'categoryName', headerName: 'categoryName', width: 130, renderCell: (params) => (
        <span title={params.value || "N/A"}>
          {params.value || "N/A"}
        </span>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ ml: 1 }}
            startIcon={<DeleteIcon />}
            onClick={() => {
              console.log(params.row.id);
              handleDeleteInventory(params.row.id);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      {/* <div className="layout-container"> */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      <div className="main-container">
        <div className="main-container">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            mt={1}
            px={2}
            flexWrap="wrap"
          >
            {/* Left section: Title and filters */}
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {isProductsPage ? 'Products' : 'Inventory'} <Typography variant="caption" component="span" color="text.secondary"></Typography>
                </Typography>
              </Box>

              

            <TextField
              select
              // label="Filter by Category"
              value={selectedCategoryId}
              onChange={(e) => {
                const categoryId = e.target.value;
                setSelectedCategoryId(categoryId);
                fetchInventory(categoryId || undefined);
              }}
              size="small"
              sx={{ 
                width: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              SelectProps={{ native: true }}
            >
              <option value="">
                All Categories
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </TextField>
            </Box>

            {/* Right section: Add Button */}
            <Button
              variant="contained"
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
                boxShadow: 'none'
              }}
              onClick={handleAddUser}
            >
              + Add {isProductsPage ? 'Product' : 'Inventory Item'}
            </Button>
          </Box>
        </div>
        {/* Your existing Paper/DataGrid will go here */}





        <Paper sx={{ height: 500, width: '100%', p: 2 }}>

          <DataGrid
            rows={inventoryItems}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
              },
            }}
            sx={{ border: 0 }}
          />
        </Paper>
        {/* </div> */}
      </div>




      {/* Add product */}
      <Modal open={openUserModal} onClose={handleCloseUserModal}>
        <form onSubmit={handleInventorySubmit(handleInventory)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 450,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflowY: "auto",
            }}
          >
            <IconButton
              onClick={handleCloseUserModal}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" mb={2}>
              Add New {isProductsPage ? 'Product' : 'Inventory Item'}
            </Typography>
            <TextField
              placeholder={isProductsPage ? "Product Name" : "Inventory Item Name"}
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerInventory("name", { required: "name is required" })}
              error={!!InventoryErrors.name}
              helperText={InventoryErrors.name?.message}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                e.target.value = cleaned; // Update the input value
              }}
            />

            <TextField
              placeholder="Product Code"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerInventory("sku", { required: "sku is required" })}
              error={!!InventoryErrors.sku}
              helperText={InventoryErrors.sku?.message}
            />
            <TextField
              placeholder="price"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              inputProps={{ step: "0.01", min: "0" }} // Accept decimals, disallow negative
              {...registerInventory("price", {
                required: "price is required",
                valueAsNumber: true, // Convert string to number
                min: {
                  value: 0,
                  message: "Price must be positive",
                },
              })}
              error={!!InventoryErrors.price}
              helperText={InventoryErrors.price?.message}
              onBlur={(e) => {
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  e.target.value = value.toFixed(2); // Format to 2 decimals
                }
              }}
            />


            <Controller
              name="categoryId"
              control={controlCategory}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Autocomplete
                  options={categories}
                  getOptionLabel={(option) => option.categoryName || ''} // ✅ Avoid undefined
                  value={
                    field.value
                      ? categories.find((cat) => Number(cat.id) === field.value) || null
                      : null
                  }
                  onChange={(e, value) => field.onChange(value ? value.id : null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      margin="normal"
                      error={!!InventoryErrors.categoryId}
                      helperText={InventoryErrors.categoryId?.message}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            />



            <TextField
              placeholder="stockQuantity"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerInventory("stockQuantity", {
                required: "stockQuantity is required",
              })}
              error={!!InventoryErrors.stockQuantity}
              helperText={InventoryErrors.stockQuantity?.message}

            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                endIcon={<SendIcon />}
                disabled={isInventory}
              >
                {isInventory ? "Submitting..." : "Save"}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
  <form onSubmit={handleInventorySubmit(handleUpdateInventory)}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <IconButton
        onClick={handleCloseEditModal}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" mb={2}>
        Edit {isProductsPage ? 'Product' : 'Inventory Item'}
      </Typography>
      <TextField
        placeholder={isProductsPage ? "Product Name" : "Inventory Item Name"}
        variant="outlined"
        fullWidth
        margin="normal"
        {...registerInventory("name", { required: "Name is required" })}
        error={!!InventoryErrors.name}
        helperText={InventoryErrors.name?.message}
      />
      
      <TextField
        placeholder="Product Code (SKU)"
        variant="outlined"
        fullWidth
        margin="normal"
        {...registerInventory("sku", { required: "SKU is required" })}
        error={!!InventoryErrors.sku}
        helperText={InventoryErrors.sku?.message}
      />
      
      <TextField
        placeholder="Price"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        inputProps={{ step: "0.01", min: "0" }} // Accept decimals, disallow negative
        {...registerInventory("price", {
          required: "Price is required",
          valueAsNumber: true, // Convert string to number
          min: {
            value: 0,
            message: "Price must be positive",
          },
        })}
        error={!!InventoryErrors.price}
        helperText={InventoryErrors.price?.message}
      />
      
      <TextField
        placeholder="Stock Quantity"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        inputProps={{ min: "0", step: "1" }} // Only whole numbers, no negative
        {...registerInventory("stockQuantity", {
          required: "Stock quantity is required",
          valueAsNumber: true,
          min: {
            value: 0,
            message: "Stock quantity must be positive",
          },
        })}
        error={!!InventoryErrors.stockQuantity}
        helperText={InventoryErrors.stockQuantity?.message}
      />
      
      <Controller
        name="categoryId"
        control={controlCategory}
        defaultValue={1}
        rules={{ required: "Category is required" }}
        render={({ field }) => (
          <Autocomplete
            options={categories}
            getOptionLabel={(option) => option.categoryName || ""}
            onChange={(_, newValue) => field.onChange(newValue?.id || 1)}
            value={categories.find(cat => cat.id === String(field.value)) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Category"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!InventoryErrors.categoryId}
                helperText={InventoryErrors.categoryId?.message}
              />
            )}
          />
        )}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          disabled={isInventory}
          sx={{
            backgroundColor: '#2196F3',
            '&:hover': { backgroundColor: '#1976D2' },
          }}
        >
          {isInventory ? "Updating..." : "Update"}
        </Button>
      </Box>
    </Box>
  </form>
</Modal>




      {snackbarMessage !== "✅ Users fetched successfully" && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{
              width: "100%",
              color: snackbarMessage === "✅ User deleted successfully!" ? "red" : undefined
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}

    </div>
  )
}

export default Inventory;