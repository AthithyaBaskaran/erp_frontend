import { styled } from "@mui/material/styles";
import { Card, Box, TextField, Button } from "@mui/material";

// Styled Button
export const StyledButton = styled(Button)({
  marginTop: "16px",
  padding: "12px",
  fontSize: "1.1rem",
  fontWeight: "bold",
  background: "linear-gradient(45deg, #00c6ff, #0072ff)",
  borderRadius: "8px",
  "&:hover": {
    background: "linear-gradient(45deg, #0072ff, #00c6ff)",
  },
});
