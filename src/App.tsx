
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import ForgetPassword from './components/ForgetPassword';
import EmailForgetPassword from './components/emailTemplate/forgetEmail';
import AdminUsers from './components/Admin/users';
import { Alert, Box, Snackbar } from '@mui/material';
import { RefreshToken } from './components/Api/apiUrl';
import { useEffect, useState } from 'react';

const App = () => {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // const fetchRefreshToken = async (userId: number, token: string) => {
  //   try {
  //     const response = await RefreshToken(userId, token);
  //     const data = response.data;
  
  //     // Store the new token in localStorage
  //     localStorage.setItem('token', data.newToken);
  
  //     setSnackbarMessage("✅ Token refreshed successfully!");
  //     setSnackbarSeverity("success");
  
  //     return data;
  //   } catch (error) {
  //     setSnackbarMessage("❌ Failed to refresh token");
  //     setSnackbarSeverity("error");
  //     console.error("Error refreshing token:", error);
  //   } finally {
  //     setOpenSnackbar(true);
  //   }
  // };
  
  const fetchRefreshToken = async (userId: number, token: string) => {
    try {
      const response = await RefreshToken(userId, token);
      const data = response.data;
  
      // ✅ Store new token
      localStorage.setItem('token', data.newToken);
  
      setSnackbarMessage("✅ Token refreshed successfully!");
      setSnackbarSeverity("success");
  
      return data;
    } catch (error) {
      setSnackbarMessage("❌ Failed to refresh token");
      setSnackbarSeverity("error");
      console.error("Error refreshing token:", error);
    } finally {
      setOpenSnackbar(true);
    }
  };

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    const userId = localStorage.getItem("UserID");

    if (token && userId) {
      const numericUserId = parseInt(userId, 10);
      const timer = setTimeout(() => {
        fetchRefreshToken(numericUserId, token);
      }, 5000); // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
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
        <Route path="/admin_users" element={<AdminUsers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/email-forgot-password' element={<EmailForgetPassword />} />
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
