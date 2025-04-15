import React, { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Header from '../Header'; // adjust path if needed
import Sidebar from '../Sidebar'; // if you have one
import { Alert, Autocomplete, Box, Button, IconButton, Modal, Snackbar, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from "@mui/icons-material/Send";
import Roles from "../Autocomplete/Roles";
import CloseIcon from '@mui/icons-material/Close';
import { showUsers } from '../Api/apiUrl';
import { apiUrl } from '../Api/BaseUrl';

interface Users{
  name:string;
  email:string;
  phone:string;
  address:string;
}
const users = () => {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [users , SetUsers] = useState<Users[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openEdit, setOpenEdit] = useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleEditClick = () => {
    setOpenEdit(true);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
 
  
  const fetchUsers = async() => {
    try{
      const response = await showUsers();
      const data = response.data;
      SetUsers(Array.isArray(data) ? data :[]);
      setSnackbarMessage("✅ User added successfully!");
      setSnackbarSeverity("success");
    }
    catch (error) {
      setSnackbarMessage("❌ Failed to add user");
      setSnackbarSeverity("error");
      console.error("Error adding user:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };
  useEffect(()=>{
    fetchUsers();
  },[]);
 
 
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 80,
      renderCell: (params) => params.row.id,
    },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'phone', headerName: 'Phone Number', width: 130 },
    { field: 'address', headerName: 'Address', width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: { row: "any" }) => (
        <>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={handleEditClick}
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
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

 
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      {/* <div className="layout-container"> */}
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <div className="main-container">
          <Paper sx={{ height: 500, width: '100%', p: 2 }}>
            <DataGrid
              rows={users}
              columns={columns}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              sx={{ border: 0 }}
            />
          </Paper>
        {/* </div> */}
      </div>
      <Modal open={openEdit} onClose={handleCloseEdit}>
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
            onClick={handleCloseEdit}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2}>
            Edit User
          </Typography>

          <Box>
            <span>Name: </span>
            <Typography variant="subtitle2" component="span">
              Athithya
            </Typography>
          </Box>
          <Box>
            <span>Email: </span>
            <Typography variant="subtitle2" component="span">
              athithya@gmail.com
            </Typography>
          </Box><Box>
            <span>Phone: </span>
            <Typography variant="subtitle2" component="span">
              123456789
            </Typography>
          </Box><Box>
            <span>Address: </span>
            <Typography variant="subtitle2" component="span">
              Cuddalore
            </Typography>
          </Box>
          <Autocomplete
            fullWidth
            disablePortal
            options={Roles}
            sx={{ width: 340 }}
            renderInput={(params) => <TextField {...params} label="Department" />}
          />
          <Autocomplete
            fullWidth
            disablePortal
            options={Roles}
            sx={{ width: 340 }}
            renderInput={(params) => <TextField {...params} label="Role" />}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              endIcon={<SendIcon />}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default users;