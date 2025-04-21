import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResetEmail } from "../Api/apiUrl";
import PersonIcon from '@mui/icons-material/Person';
import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Box, Button, IconButton, InputAdornment, Snackbar, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ResetUsers {
    newPassword: string;
    confirmPassword: string;
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
    const [searchParams] = useSearchParams();
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const {
        register: registerResetUser,
        handleSubmit: handleResetUserSubmit,
        setValue: setResetUserValue,
        reset: resetResetUser,
        formState: { errors: ResetUserErrors, isSubmitting: isResetUserIn },
    } = useForm<ResetUsers>();


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
    const handleResetUser: SubmitHandler<ResetUsers> = async (data: ResetUsers) => {
        try {
            const token = searchParams.get("token");
            if (!token) throw new Error("No token found in URL");
            const response = await ResetEmail(token, data.newPassword, data.confirmPassword);
            console.log(response.data);

            if (response.data) {
                localStorage.setItem("token", response.data.token);
                setSnackbarMessage("✅ Change password successfully!");
                setSnackbarSeverity("success");
                resetResetUser();
                navigate("/");
            }
            return response.data;
        } catch (error:any) {
            const message = error?.message || "❌ Change Password failed";
            setSnackbarMessage(`❌ ${message}`);
            setSnackbarSeverity("error");
            console.error("Error logging in:", error);
        } finally {
            setOpenSnackbar(true);
        }
    };
    return (
        <div className="signin-signup">
            {/* Sign In Form */}

            <form className="sign-in-form" onSubmit={handleResetUserSubmit(handleResetUser)}>
                <h2 className="title">Reset Password</h2>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <TextField
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            variant="outlined"
                            {...registerResetUser("newPassword")}
                            error={!!ResetUserErrors.newPassword}
                            helperText={ResetUserErrors.newPassword?.message}
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
                                placeholder="Confirm Password"
                                variant="outlined"
                                {...registerResetUser("confirmPassword")}
                                error={!!ResetUserErrors.confirmPassword}
                                helperText={ResetUserErrors.confirmPassword?.message}
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
                                disabled={isResetUserIn}
                            >
                                {isResetUserIn ? "Submitting..." : "Change Password"}
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
