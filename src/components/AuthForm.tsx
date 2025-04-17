import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import HomeIcon from '@mui/icons-material/Home';
import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Box, Button, IconButton, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { apiUrl } from "./Api/BaseUrl";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRegisterSchema, getLoginSchema } from "./Validations/ValidationSchema";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginForm,addUsers } from "./Api/apiUrl";
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



console.log();

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
    } catch (error:any) {
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
      const response = await LoginForm(data.email, data.password);
      console.log(response.data.data);
      
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        setSnackbarMessage("✅ Login successfully!");
        setSnackbarSeverity("success");
        resetLogin();
        navigate("/dashboard");
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
  const textFieldProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '50px',
        padding: '1px 40px',
        backgroundColor: '#f0f0f0',
        '& fieldset': {
          border: 'none', // removes the border
        },
        '&:hover fieldset': {
          border: 'none', // removes border on hover
        },
        '&.Mui-focused fieldset': {
          border: 'none', // removes border when focused
        },
      },
    },
  };
  const LogintextFieldProps = {
    sx: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '50px',
        padding: '1px 40px',
        backgroundColor: '#f0f0f0',
        '& fieldset': {
          border: 'none', // removes the border
        },
        '&:hover fieldset': {
          border: 'none', // removes border on hover
        },
        '&.Mui-focused fieldset': {
          border: 'none', // removes border when focused
        },
      },
    },
  };


  return (
    <div className="signin-signup">
      {/* Sign In Form */}

      <form className="sign-in-form" onSubmit={handleLoginSubmit(handleLogin)}>
        <h2 className="title">Sign In</h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Email"
              variant="outlined"
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
              {...LogintextFieldProps}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              variant="outlined"
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
              {...LogintextFieldProps}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <input
                    type="checkbox"
                    checked={isStrongPassword}
                    onChange={() => setIsStrongPassword(!isStrongPassword)}
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                    Use Strong Password Validation
                </Typography>
            </Box>
          </Box>


          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              endIcon={<SendIcon />}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Submitting..." : "Login"}
            </Button>
          </Box>
        </Box>

        <p className="social-text">Or Sign up with social platforms</p>
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
        <h2 className="title">Sign up</h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Username"
              variant="outlined"
              // {...register("name", { required: "Name is Required" })}
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

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Email"
              variant="outlined"
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Phone"
              variant="outlined"
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Address"
              variant="outlined"
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              endIcon={<SendIcon />}
              disabled={isRegistering}
            >
              {isRegistering ? "Submitting..." : "Sign Up"}
            </Button>
          </Box>
        </Box>

        <p className="social-text">Or Sign up with social platforms</p>
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
