import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ForgetUser } from "./Api/apiUrl";
import EmailIcon from '@mui/icons-material/Email';
import { useForm, SubmitHandler } from "react-hook-form";
import { Alert, Box, Button, InputAdornment, Snackbar, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { yupResolver } from "@hookform/resolvers/yup";
import { getForgetUserSchema } from "./Validations/ValidationSchema";

interface ForgetUsers {
    email: string;
}
const ForgetPasswordForm: React.FC = () => {
    const navigate = useNavigate();
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
        register: registerForgetUser,
        handleSubmit: handleForgetUserSubmit,
        setValue: setForgetUserValue,
        reset: resetForgetUser,
        formState: { errors: ForgetUserErrors, isSubmitting: isForgetUserIn },
    } = useForm<ForgetUsers>({ resolver: yupResolver(getForgetUserSchema()) });


    const ForgetUsertextFieldProps = {
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
    const handleForgetUser: SubmitHandler<ForgetUsers> = async (data: ForgetUsers) => {
        try {
            const response = await ForgetUser(data.email);
            console.log(response.data);
            if (response.data) {
                setSnackbarMessage("✅ Change password successfully!");
                setSnackbarSeverity("success");
                resetForgetUser();
                navigate("/");
            }
            return response.data;
        } catch (error:any) {
            const message = error?.message || "❌ Forget password failed";
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

            <form className="sign-in-form" onSubmit={handleForgetUserSubmit(handleForgetUser)}>
                <h2 className="title">Forget Password</h2>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            placeholder="Email"
                            variant="outlined"
                            {...registerForgetUser("email")}
                            onChange={(e) => {
                                const cleaned = e.target.value
                                    .toLowerCase() // force lowercase
                                    .replace(/[^a-z0-9@.]/g, ""); // strip unwanted chars
                                setForgetUserValue("email", cleaned);
                            }}
                            error={!!ForgetUserErrors.email}
                            helperText={ForgetUserErrors.email?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            {...ForgetUsertextFieldProps}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Button
                                type="submit"
                                variant="outlined"
                                color="primary"
                                endIcon={<SendIcon />}
                                disabled={isForgetUserIn}
                            >
                                {isForgetUserIn ? "Submitting..." : "Confirm"}
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

export default ForgetPasswordForm;
