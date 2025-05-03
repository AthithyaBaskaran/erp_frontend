
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import ForgetPassword from './components/ForgetPassword';
import EmailForgetPassword from './components/emailTemplate/forgetEmail';
import AdminUsers from './components/Admin/users';
import Inventory from './components/Admin/inventory';
import Products from './components/Admin/products_new';
import SalesManagement from './components/Admin/SalesManagement';
import SupplierDashboard from './components/Supplier/SupplierDashboard';



import RootRedirect from './components/RootRedirect';
import { Alert, Box, Snackbar } from '@mui/material';
import { RefreshToken } from './components/Api/apiUrl';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // 

interface JwtPayload {
  sub?: string;
  iat?: number;
  exp?: number;
}


const App = () => {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

 
const fetchRefreshToken = async (userId: number, token: string) => {
  try {
    const response = await RefreshToken(userId, token); // Replace with your actual API
    const data = response.data;

    // ✅ Store new token
    localStorage.setItem('token', data.newToken);

    setSnackbarMessage("✅ Token refreshed successfully!");
    setSnackbarSeverity("success");

    // 🔁 Schedule next refresh
    scheduleTokenRefresh(data.newToken, userId);

    return data;
  } catch (error) {
    setSnackbarMessage("❌ Failed to refresh token");
    setSnackbarSeverity("error");
    console.error("Error refreshing token:", error);
  } finally {
    setOpenSnackbar(true);
  }
};

const scheduleTokenRefresh = (token: string, userId: number) => {
  const decoded = jwtDecode<JwtPayload>(token);

  if (decoded.exp) {
    const expTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeLeft = expTime - currentTime;

    console.log("⏱️ Expiration in:", Math.floor(timeLeft / 1000), "seconds");

    const refreshIn = timeLeft - 2 * 60 * 1000; // 2 minutes before exp

    if (refreshIn > 0) {
      console.log(`🔄 Token will be refreshed in ${Math.floor(refreshIn / 1000)} seconds`);
      setTimeout(() => {
        fetchRefreshToken(userId, token);
      }, refreshIn);
    } else {
      console.log("⚠️ Token is near or already expired. Refreshing now.");
      fetchRefreshToken(userId, token);
    }
  } else {
    console.warn("❗ Token does not contain 'exp'");
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("UserID");
  const role = localStorage.getItem("roles");

  if (token && userId) {
    const numericUserId = parseInt(userId, 10);
    scheduleTokenRefresh(token, numericUserId);
    
    // Log the user role for debugging
    console.log("Current user role:", role);
  }
}, []);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<RootRedirect />} />
        <Route path="/admin_users" element={<AdminUsers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<SalesManagement />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/email-forgot-password' element={<EmailForgetPassword />} />
        <Route path='/supplier-dashboard' element={<SupplierDashboard />} />
        {/* <Route path='/inventory-dashboard' element={<InventoryDashboard />} /> */}
        {/* <Route path='/salesman-dashboard' element={<SalesmanDashboard />} /> */}
        
      </Routes>
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
    </Box>
  );
};



export default App;
