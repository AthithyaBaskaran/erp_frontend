import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { showInventory, fetchCategoriesApi } from '../Api/apiUrl';
import "../../styles/Admin.css";

interface InventoryItem {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

interface Category {
  id?: string;
  categoryName: string;
}

const Inventory: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const fetchInventory = async (categoryId?: number | string) => {
    try {
      const response = await showInventory(categoryId as number);
      const data = response?.data;
      setInventoryItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchCategoriesApi();
      const data = response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleBuyNowClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'price', headerName: 'Price', width: 130 },
    { field: 'categoryName', headerName: 'Category', width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleBuyNowClick(params.row)}
        >
          Buy Now
        </Button>
      ),
    },
  ];

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className="main-container">
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
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Order Placed</DialogTitle>
        <DialogContent>
          <Typography>
            {selectedItem ? `You have placed an order for ${selectedItem.name}.` : ''}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
