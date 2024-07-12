import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  CssBaseline,
  Grid,
  Link,
  Radio,
//   Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 0.5 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Grid
              container
              direction="row"
              alignItems="center"
            >
              <Grid item>
                <Typography component="h2" variant="body2" sx={{mr:"10px", fontSize: "16px", fontWeight: "bold"}}>
                  Portal
                </Typography>
              </Grid>
              <Grid item>
                <Radio
                  value="fact"
                  color="primary"
                  size="small" // Set the size to small
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 14 } }} // Adjust the icon size
                  inputProps={{ "aria-label": "FACT" }}
                />
              </Grid>
              <Grid item>
                <Typography variant="body1" sx={{fontSize: 14}}>FACT</Typography>
              </Grid>
              <Grid item>
                <Radio
                  value="aspack"
                  color="primary"
                  size="small" // Set the size to small
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 14 } }} // Adjust the icon size
                  inputProps={{ "aria-label": "ASPACK" }}
                />
              </Grid>
              <Grid item>
                <Typography variant="body1" sx={{fontSize: 14}}>ASPACK</Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
