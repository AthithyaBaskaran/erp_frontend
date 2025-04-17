
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import ForgetPassword from './components/ForgetPassword';
import EmailForgetPassword from './components/emailTemplate/forgetEmail';
import AdminUsers from './components/Admin/users';
import { Box } from '@mui/material';

const App = () => {
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
    </Box>
  );
};



export default App;
