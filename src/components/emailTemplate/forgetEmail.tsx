import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ChangeUser } from "../Api/apiUrl";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Box, Button, IconButton, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { yupResolver } from "@hookform/resolvers/yup";
import { getChangeUserSchema } from "../Validations/ValidationSchema";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface changeUsers {
  email: string;
  oldPassword: string;
  newPassword: string;
}
const EmailForgetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

  const {
    register: registerchangeUser,
    handleSubmit: handlechangeUserSubmit,
    setValue: setchangeUserValue,
    reset: resetchangeUser,
    formState: { errors: changeUserErrors, isSubmitting: ischangeUserIn },
  } = useForm<changeUsers>({ resolver: yupResolver(getChangeUserSchema()) });


  const changeUsertextFieldProps = {
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
  const handlechangeUser: SubmitHandler<changeUsers> = async (data: changeUsers) => {
    try {
      const response = await ChangeUser(data.email, data.oldPassword, data.newPassword);
      console.log(response.data.data);

      if (response.data) {
        localStorage.setItem("token", response.data.token);
        setSnackbarMessage("✅ Change password successfully!");
        setSnackbarSeverity("success");
        resetchangeUser();
        navigate("/");
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
  return (
    <div className="signin-signup">
      {/* Sign In Form */}

      <form className="sign-in-form" onSubmit={handlechangeUserSubmit(handlechangeUser)}>
        <h2 className="title">ChangePassword</h2>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              placeholder="Email"
              variant="outlined"
              {...registerchangeUser("email")}
              onChange={(e) => {
                const cleaned = e.target.value
                  .toLowerCase() // force lowercase
                  .replace(/[^a-z0-9@.]/g, ""); // strip unwanted chars
                setchangeUserValue("email", cleaned);
              }}
              error={!!changeUserErrors.email}
              helperText={changeUserErrors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              {...changeUsertextFieldProps}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              variant="outlined"
              {...registerchangeUser("oldPassword")}
              error={!!changeUserErrors.oldPassword}
              helperText={changeUserErrors.oldPassword?.message}
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
              {...changeUsertextFieldProps}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <TextField
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                variant="outlined"
                {...registerchangeUser("newPassword")}
                error={!!changeUserErrors.newPassword}
                helperText={changeUserErrors.newPassword?.message}
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
                {...changeUsertextFieldProps}
              />
            </Box>


            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                endIcon={<SendIcon />}
                disabled={ischangeUserIn}
              >
                {ischangeUserIn ? "Submitting..." : "Change Password"}
              </Button>
            </Box>
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

export default EmailForgetPassword;
