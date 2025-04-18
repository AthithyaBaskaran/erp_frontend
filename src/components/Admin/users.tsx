
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
import { addRole, showDepartment, assignRoleAndDept, showUsers, AssignRole, fetchUserForEdit } from '../Api/apiUrl';
import { getRegisterSchema, getRoleSchema } from "../Validations/ValidationSchema";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDepartment, deleteUser, addUsers } from "../Api/apiUrl";
import { useNavigate } from "react-router-dom";
interface Users {
  name: string;
  email: string;
  phone: string;
  address: string;
  roleName: string;
  departmentName: string;
}
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}
interface Department {
  id?: string;
  name: string;
}

interface Role {
  id?: string;
  dept_id: number;
  roleName: string;
}
interface assignRoleAndDepartment {
  roleId: number;
  deptId: number;
  userId: number;
}

const Users: React.FC = () => {

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [users, SetUsers] = useState<Users[]>([]);
  const [department, SetDepartment] = useState<Department[]>([]);
  const [role, SetRole] = useState<Role[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openEdit, setOpenEdit] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [user, setUser] = useState<Users | null>(null); // Single user, can be null initially
  const [openUserModal, setOpenUserModal] = useState(false);


  const navigate = useNavigate();

  const {
    register: registerDepartment,
    handleSubmit: handleDepartmentSubmit,
    reset: resetDepartment,
    control: controlDepartment,
    formState: { errors: DepartmentErrors, isSubmitting: isDepartment },
  } = useForm<Department>();


  const {
    register: registerRole,
    handleSubmit: handleRoleSubmit,
    reset: resetRole,
    control: controlRole,
    formState: { errors: RoleErrors, isSubmitting: isRole },
  } = useForm<Role>({ resolver: yupResolver(getRoleSchema()) });

  const {
    register: registerRoleAndDept,
    handleSubmit: handleRoleAndDeptSubmit,
    reset: resetRoleAndDept,
    control: controlRoleAndDept,
    formState: { errors: RoleAndDeptErrors, isSubmitting: isRoleAndDept },
  } = useForm<assignRoleAndDepartment>();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    setValue: setRegisterValue,
    reset: resetRegister,
    formState: { errors: registerErrors, isSubmitting: isRegistering },
  } = useForm<RegisterFormData>({ resolver: yupResolver(getRegisterSchema()) });



  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const handleAddDepartmentClose = () => {
    setOpenDepartment(false);
  };
  const handleAddRoleClose = () => {
    setOpenRole(false);
  };

  const handleaddRole = () => {
    setOpenRole(true);
  };
  const handleaddDepartment = () => {
    setOpenDepartment(true);
  }

  const handleAddUser = () => {
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  const fetchUsers = async () => {
    try {
      const response = await showUsers();
      const data = response.data;
      SetUsers(Array.isArray(data) ? data : []);
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
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchDepartment = async () => {
    try {
      const response = await showDepartment();
      const data = response.data;
      SetDepartment(Array.isArray(data) ? data : []);
    }
    catch (error) {
      setSnackbarMessage("❌ Failed to add user");
      setSnackbarSeverity("error");
      console.error("Error adding user:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };
  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchAssignRole = async (departmentId: number) => {
    try {
      const response = await AssignRole(departmentId);
      const data = response.data;
      SetRole(Array.isArray(data) ? data : []);
    }
    catch (error) {
      setSnackbarMessage("❌ Failed to add user");
      setSnackbarSeverity("error");
      console.error("Error adding user:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };
  const handleEditClick = async (userId: number) => {
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




  const handleRoleAndDepartment: SubmitHandler<assignRoleAndDepartment> = async (data) => {
    if (!selectedUserId || !selectedRoleId || !selectedDeptId) {
      console.log(data.roleId, data.deptId);
      setSnackbarMessage("❌ Please select all fields");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await assignRoleAndDept(selectedUserId, selectedRoleId, selectedDeptId);
      if (response.data) {
        setSnackbarMessage("✅ Department and Role assigned successfully!");
        setSnackbarSeverity("success");
        resetRoleAndDept();
        handleCloseEdit();
      }

      return response.data;
    } catch (error) {
      setSnackbarMessage("❌ Submission failed");
      setSnackbarSeverity("error");
      console.error("Error submitting:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await deleteUser(userId);
      setSnackbarMessage("✅ User deleted successfully!");
      setSnackbarSeverity("success");
      fetchUsers();
    }
    catch (error) {
      setSnackbarMessage("❌ Failed to delete user");
      setSnackbarSeverity("error");
      console.error("Error deleting user:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleRegister: SubmitHandler<RegisterFormData> = async (data: RegisterFormData) => {
    try {
      const response = await addUsers({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      });

      if (response.data) {
        setSnackbarMessage("✅ User Added successfully!");
        setSnackbarSeverity("success");
        resetRegister();
        handleCloseUserModal();
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
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'department', headerName: 'Department', width: 130 },
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
            onClick={() => handleEditClick(params.row.id)}
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
              handleDeleteUser(params.row.id);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  const handleDepartment: SubmitHandler<Department> = async (data: Department) => {
    try {
      const response = await addDepartment(data.name);
      console.log(response.data.data);

      if (response.data) {
        setSnackbarMessage("✅ Add Department successfully!");
        setSnackbarSeverity("success");
        resetDepartment();
        handleAddDepartmentClose();
      }

      return response.data;
    } catch (error) {
      setSnackbarMessage("❌ Login failed");
      setSnackbarSeverity("error");
      console.error("Error logging in:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };
  const handleRole: SubmitHandler<Role> = async (data: Role) => {
    try {
      const response = await addRole(data.dept_id, data.roleName,);
      console.log(response.data.data);

      if (response.data) {
        setSnackbarMessage("✅ Add Role successfully!");
        setSnackbarSeverity("success");
        resetRole();
        handleAddRoleClose();
      }

      return response.data;
    } catch (error) {
      setSnackbarMessage("❌ Login failed");
      setSnackbarSeverity("error");
      console.error("Error logging in:", error);
    } finally {
      setOpenSnackbar(true);
    }
  }
  console.log("users", user);

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      {/* <div className="layout-container"> */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      <div className="main-container">
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={handleaddDepartment}
        >Add Department</Button>
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={handleaddRole}
        >Add Role</Button>
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={handleAddUser}
          style={{
            position: 'absolute',
            right: '100px',
            top: '80px',
          }}
        >
          Add User
        </Button>


        <Paper sx={{ height: 500, width: '100%', p: 2 }}>

          <DataGrid
            rows={users}
            columns={columns}
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
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <form className="sign-in-form" onSubmit={handleRoleAndDeptSubmit(handleRoleAndDepartment)}>
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
            {user && (
              <>
                <Box>
                  <span>Name: </span>
                  <Typography variant="subtitle2" component="span">
                    {user.name}
                  </Typography>
                </Box>

                <Box>
                  <span>Email: </span>
                  <Typography variant="subtitle2" component="span">
                    {user.email}
                  </Typography>
                </Box>

                <Box>
                  <span>Phone: </span>
                  <Typography variant="subtitle2" component="span">
                    {user.phone}
                  </Typography>
                </Box>

                <Box>
                  <span>Address: </span>
                  <Typography variant="subtitle2" component="span">
                    {user.address}
                  </Typography>
                </Box>

                {user?.departmentName && (
                  <Box>
                    <span>Department: </span>
                    <Typography variant="subtitle2" component="span">
                      {user.departmentName}
                    </Typography>
                  </Box>
                )}

                {user?.roleName && (
                  <Box>
                    <span>RoleName: </span>
                    <Typography variant="subtitle2" component="span">
                      {user.roleName}
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {user?.departmentName == null && (
              <>
                <Controller
                  name="deptId"
                  control={controlRoleAndDept}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      options={department}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, value) => {
                        const deptId = value?.id ? Number(value.id) : null;
                        setSelectedDeptId(deptId);
                        field.onChange(deptId);
                        if (deptId) fetchAssignRole(deptId);
                      }}

                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Department"
                          error={!!RoleAndDeptErrors.deptId}
                          helperText={RoleAndDeptErrors.deptId?.message}
                        />
                      )}
                    />
                  )}
                />
              </>
            )}
            {user?.roleName == null && (
              <>
                <Controller
                  name="roleId"
                  control={controlRoleAndDept}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      options={role}
                      getOptionLabel={(option) => option.roleName}
                      onChange={(e, value) => {
                        const roleId = value?.id ? Number(value.id) : null;
                        setSelectedRoleId(roleId);
                        field.onChange(roleId);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          error={!!RoleAndDeptErrors.roleId}
                          helperText={RoleAndDeptErrors.roleId?.message}
                        />
                      )}
                    />
                  )}
                />
              </>
            )}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                endIcon={<SendIcon />}
                disabled={isRoleAndDept}
              >
                {isRoleAndDept ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
      {/* Department Model */}
      <Modal open={openDepartment} onClose={handleAddDepartmentClose}>
        <form className="sign-in-form" onSubmit={handleDepartmentSubmit(handleDepartment)}>
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
              onClick={handleAddDepartmentClose}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" mb={2}>
              Add Department
            </Typography>
            <TextField
              placeholder="Department"
              variant="outlined"
              {...registerDepartment("name")}
              error={!!DepartmentErrors.name}
              helperText={DepartmentErrors.name?.message}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                endIcon={<SendIcon />}
                disabled={isDepartment}
              >
                {isDepartment ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>
      {/* Role Model */}
      <Modal open={openRole} onClose={handleAddRoleClose}>
        <form className="sign-in-form" onSubmit={handleRoleSubmit(handleRole)}>
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
              onClick={handleAddRoleClose}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" mb={2}>
              Add Role
            </Typography>

            <Controller
              name="dept_id"
              control={controlRole}
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <Autocomplete
                  options={department.map((item) => ({ id: Number(item.id), name: item.name }))}
                  getOptionLabel={(option) => option.name}
                  value={
                    field.value
                      ? {
                        id: field.value,
                        name: department.find(dept => Number(dept.id) === field.value)?.name || ""
                      }
                      : null
                  }

                  onChange={(e, value) => field.onChange(value ? value.id : null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department"
                      margin="normal"
                      error={!!RoleErrors.dept_id}
                      helperText={RoleErrors.dept_id?.message}
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            />
            <TextField
              placeholder="Role"
              variant="outlined"
              {...registerRole("roleName")}
              error={!!RoleErrors.roleName}
              helperText={RoleErrors.roleName?.message}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                endIcon={<SendIcon />}
                disabled={isRole}
              >
                {isRole ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </form>
      </Modal>

      {/* Add user */}
      <Modal open={openUserModal} onClose={handleCloseUserModal}>
        <form onSubmit={handleRegisterSubmit(handleRegister)}>
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
              onClick={handleCloseUserModal}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" mb={2}>
              Add User
            </Typography>
            <TextField
              placeholder="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerRegister("name", { required: "Name is required" })}
              error={!!registerErrors.name}
              helperText={registerErrors.name?.message}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                e.target.value = cleaned; // Update the input value
              }}
            />

            <TextField
              placeholder="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerRegister("email", { required: "Email is required" })}
              error={!!registerErrors.email}
              helperText={registerErrors.email?.message}
              onChange={(e) => {
                const cleaned = e.target.value
                  .toLowerCase() // Force lowercase
                  .replace(/[^a-z0-9@._-]/g, ""); // Allow only valid email characters
                e.target.value = cleaned; // Update the input value
              }}
            />


            <TextField
              placeholder="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerRegister("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be exactly 10 digits"
                }
              })}
              error={!!registerErrors.phone}
              helperText={registerErrors.phone?.message}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 10); // Remove non-numeric characters and limit to 10 digits
                e.target.value = cleaned; // Update the input value
              }}
            />

            <TextField
              placeholder="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              {...registerRegister("address", { required: "Address is required" })}
              error={!!registerErrors.address}
              helperText={registerErrors.address?.message}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Remove non-alphabetic characters
                e.target.value = cleaned; // Update the input value
              }}
            />


            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                endIcon={<SendIcon />}
                disabled={isRegistering}
              >
                {isRegistering ? "Submitting..." : "Save"}
              </Button>
            </Box>
          </Box>
        </form>
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

export default Users;