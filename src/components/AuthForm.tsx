import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import HomeIcon from '@mui/icons-material/Home';
import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { yupResolver } from "@hookform/resolvers/yup";
import { getRegisterSchema, getLoginSchema } from "./Validations/ValidationSchema";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginForm, addUsers } from "./Api/apiUrl";
import Cookies from "js-cookie";
import '../styles/Admin.css';
import { useThemeContext } from "./ThemeContext";
 
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}
 
interface LoginFormData {
  password: string;
  email: string;
}
 
const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isStrongPassword, setIsStrongPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // login button loading
  const [pageLoading, setPageLoading] = useState(true); // page initial loading
  const [rememberMe, setRememberMe] = useState(false);
 
  const { mode, resetTheme } = useThemeContext();
  const isDarkMode = mode === 'dark';
 
  // Reset theme to light mode when on login page
  useEffect(() => {
    // Reset to light mode when on login page
    resetTheme();
  }, []);
 
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    setValue: setRegisterValue,
    reset: resetRegister,
    formState: { errors: registerErrors, isSubmitting: isRegistering },
  } = useForm<RegisterFormData>({ resolver: yupResolver(getRegisterSchema()) });
 
  const validationSchema = getLoginSchema(isStrongPassword);
 
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    reset: resetLogin,
    formState: { errors: loginErrors, isSubmitting: isLoggingIn },
  } = useForm<LoginFormData>({ resolver: yupResolver(validationSchema) });
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800); // Simulate page loading delay
    return () => clearTimeout(timer);
  }, []);
 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
 
  const socialIcons = [
    { icon: <FaFacebookF />, link: "https://www.facebook.com/login" },
    { icon: <FaTwitter />, link: "https://twitter.com/login" },
    { icon: <FaGoogle />, link: "https://accounts.google.com/signin" },
    { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/login" },
  ];
 
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
 
  const handleLogin: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const response = await LoginForm(data.email, data.password);
      const userId = response?.data?.userId;
 
      if (response?.data) {
        // Save auth info
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("roles", response.data.role);
        localStorage.setItem("UserID", userId);
        localStorage.setItem("department", response.data.department);
        localStorage.setItem("UserName", response.data.name);
 
        // Remember Me
        if (rememberMe) {
          Cookies.set("rememberMe", "true", { expires: 7 }); // stores cookie for 7 days
          Cookies.set("email", data.email);
          Cookies.set("password", data.password);
        } else {
          Cookies.remove("rememberMe"); // or simply remove it
          Cookies.remove("email");
          Cookies.remove("password");
        }
        setSnackbarMessage("✅ Login successfully!");
        setSnackbarSeverity("success");
        resetLogin();
        navigate("/dashboard");
      }
 
      return response.data;
    } catch (error:any) {
      setSnackbarSeverity("error");
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };
 
  useEffect(() => {
    const savedRememberMe = Cookies.get("rememberMe") === "true";
    const savedEmail = Cookies.get("email") || "";
    const savedPassword = Cookies.get("password") || "";
 
    if (savedRememberMe) {
      setLoginValue("email", savedEmail);
      setLoginValue("password", savedPassword);
    }
 
    setRememberMe(savedRememberMe);
  }, []);
 
  // Common text field styles for both login and register forms
  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px',
      padding: '1px 40px',
      height: '55px',
      backgroundColor: isDarkMode ? '#263043' : '#f0f0f0',
      color: isDarkMode ? '#ffffff' : '#333333',
      '& fieldset': {
        border: isDarkMode ? '1px solid #3a4659' : 'none',
      },
      '&:hover fieldset': {
        border: '1px solid #87CEEB', /* Sky blue color */
        transition: 'border 0.3s ease',
      },
      '&.Mui-focused fieldset': {
        border: isDarkMode ? '1px solid #90caf9' : 'none',
      },
      '& .MuiInputAdornment-root .MuiSvgIcon-root': {
        color: isDarkMode ? '#9e9ea4' : '#757575',
      },
      '& input': {
        color: isDarkMode ? '#ffffff' : '#333333',
        fontSize: '16px',
        fontWeight: '500',
      },
      '& input::placeholder': {
        color: isDarkMode ? '#9e9ea4' : '#aaaaaa',
        opacity: 1,
      },
    },
    '& .MuiFormHelperText-root': {
      color: isDarkMode ? '#ff6b6b' : '#f44336',
      marginLeft: '16px',
    },
    width: '100%',
    maxWidth: '380px',
  };
 
  const textFieldProps = {
    sx: commonTextFieldStyles,
  };
 
  const LogintextFieldProps = {
    sx: commonTextFieldStyles,
  };
 
  if (pageLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }
 
  return (
    <div className="signin-signup">
      {/* Sign In Form */}
      <form className="sign-in-form" onSubmit={handleLoginSubmit(handleLogin)}>
        <h2 className="title" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Sign In</h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
            <TextField
              placeholder="Email"
              variant="outlined"
              fullWidth
              {...registerLogin("email")}
              onChange={(e) => {
                const cleaned = e.target.value
                  .toLowerCase() // force lowercase
                  .replace(/[^a-z0-9@.]/g, ""); // strip unwanted chars
                setLoginValue("email", cleaned);
              }}
              error={!!loginErrors.email}
              helperText={loginErrors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                ...commonTextFieldStyles,
                '& .MuiOutlinedInput-root': {
                  ...commonTextFieldStyles['& .MuiOutlinedInput-root'],
                  '&:hover fieldset': {
                    border: '1px solid #87CEEB', /* Sky blue color */
                    transition: 'border 0.3s ease',
                  },
                }
              }}
            />
          </Box>
         
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Forgot Password - Upper Right */}
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              mb: 0.5
            }}>
              <Link
                to="/forgot-password"
                className="forgot-password"
                style={{
                  color: isDarkMode ? '#90caf9' : '#4481eb',
                  textDecoration: "none",
                  fontSize: "14px"
                }}
              >
                Forgot Password?
              </Link>
            </Box>
           
            <Box sx={{ display: "flex", alignItems: "center", position: "relative" }}>
              <TextField
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                variant="outlined"
                fullWidth
                {...registerLogin("password")}
                error={!!loginErrors.password}
                helperText={loginErrors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...commonTextFieldStyles,
                  '& .MuiOutlinedInput-root': {
                    ...commonTextFieldStyles['& .MuiOutlinedInput-root'],
                    '&:hover fieldset': {
                      border: '1px solid #87CEEB', /* Sky blue color */
                      transition: 'border 0.3s ease',
                    },
                  }
                }}
              />
            </Box>
           
            {/* Strong Password Validation and Remember Me on same line */}
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mt: 1
            }}>
              {/* Strong Password Validation - Left Side */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={isStrongPassword}
                  onChange={() => setIsStrongPassword(!isStrongPassword)}
                  style={{
                    accentColor: isDarkMode ? '#90caf9' : '#4481eb',
                    marginRight: "8px"
                  }}
                />
                <Typography variant="body2" sx={{
                  fontSize: "11px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500
                }}>
                  Use Strong Password Validation
                </Typography>
              </Box>
             
              {/* Remember Me - Right Side */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    accentColor: isDarkMode ? '#90caf9' : '#4481eb',
                    marginRight: "8px"
                  }}
                />
                <Typography variant="body2" sx={{
                  fontSize: "11px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500
                }}>
                  Remember Me
                </Typography>
              </Box>
            </Box>
           
            {/* Login Button - Center */}
            <Box sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 2
            }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '50px',
                  padding: '10px 30px',
                  textTransform: 'none',
                  fontSize: '16px',
                  backgroundColor: isDarkMode ? '#90caf9' : '#4481eb',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#70a9e6' : '#3470d8',
                  },
                  width: '200px',
                  height: '45px'
                }}
                endIcon={!isLoggingIn && <ArrowForwardIcon style={{ fontSize: '20px' }} />}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? <CircularProgress size={20} /> : "Login"}
              </Button>
            </Box>
          </Box>
        </Box>
 
        <p className="social-text" style={{
          color: isDarkMode ? '#ffffff' : '#444',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500
        }}>Or Sign up with social platforms</p>
        <div className="social-media">
          {socialIcons.map((item, idx) => (
            <a key={idx} href={item.link} className="social-icon" target="_blank"
              rel="noopener noreferrer">
              {item.icon}
            </a>
          ))}
        </div>
      </form>
 
      {/* Register Sign Up Form */}
      <form className="sign-up-form" onSubmit={handleRegisterSubmit(handleRegister)}>
        <h2 className="title" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Sign up</h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
            <TextField
              placeholder="Username"
              variant="outlined"
              fullWidth
              {...registerRegister("name")}
              error={!!registerErrors.name}
              helperText={registerErrors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              {...textFieldProps}
            />
          </Box>
 
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
            <TextField
              placeholder="Email"
              variant="outlined"
              fullWidth
              {...registerRegister("email")}
              onChange={(e) => {
                const cleaned = e.target.value
                  .toLowerCase() // force lowercase
                  .replace(/[^a-z0-9@.]/g, ""); // strip unwanted chars
                setRegisterValue("email", cleaned);
              }}
              error={!!registerErrors.email}
              helperText={registerErrors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              {...textFieldProps}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
            <TextField
              placeholder="Phone"
              variant="outlined"
              fullWidth
              {...registerRegister("phone")}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 10); // remove anything that's not a digit
                setRegisterValue("phone", cleaned); // set cleaned value to the form
              }}
              error={!!registerErrors.phone}
              helperText={registerErrors.phone?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalPhoneIcon />
                  </InputAdornment>
                ),
              }}
              {...textFieldProps}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
            <TextField
              placeholder="Address"
              variant="outlined"
              fullWidth
              {...registerRegister("address", { required: "Address is Required" })}
              error={!!registerErrors.address}
              helperText={registerErrors.address?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon />
                  </InputAdornment>
                ),
              }}
              {...textFieldProps}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: '50px',
                padding: '10px 30px',
                textTransform: 'none',
                fontSize: '16px',
                backgroundColor: isDarkMode ? '#90caf9' : '#4481eb',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#70a9e6' : '#3470d8',
                },
                width: '200px',
                height: '45px'
              }}
              endIcon={!isRegistering && <ArrowForwardIcon style={{ fontSize: '20px' }} />}
              disabled={isRegistering}
            >
              {isRegistering ? <CircularProgress size={20} /> : "Sign Up"}
            </Button>
          </Box>
        </Box>
 
        <p className="social-text" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Or Sign in with social platforms</p>
        <div className="social-media">
          {socialIcons.map((item, idx) => (
            <a key={idx} href={item.link} className="social-icon" target="_blank"
              rel="noopener noreferrer">
              {item.icon}
            </a>
          ))}
        </div>
      </form>
 
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
  );
};
 
export default AuthForm;