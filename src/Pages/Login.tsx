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
  Radio,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import UseToggleSidebar from "../CommonHandler/UseToggleSidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const theme = createTheme();

const Login: React.FC<{
  setUser: (user: { role: string; email: string }) => void;
}> = ({ setUser }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      setOpenSnackbar(true);
      return;
    }

    try {
      const resp = await axios.post("https://localhost:44338/api/Auth/Login", {
        email,
        password,
      });

      const { token, user } = resp.data;
      console.log("Token", token);
      if (token) {
        localStorage.setItem("token", token);
        setError("");
        setUser(user); // Assuming user data contains role and email
        navigate("/Dashboard");
        window.location.reload();
      } else {
        setError("Token not found in response");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError("Invalid username or password");
      setOpenSnackbar(true);
    }
  };

  const { open, setOpen } = UseToggleSidebar();
  const toggleDrawer = () => {
    setOpen(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  //Style
  const paperStyle = {
    padding: "10px",
    height: "65vh",
    width: 350,
    margin: "20px auto",
  };
  const btnstyle = { margin: "8px 0" };

  return (
    <ThemeProvider theme={theme}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={15} style={paperStyle}>
          <Box
            sx={{
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={require("../assets/logoAOP.png")}
              variant="square"
              sx={{ height: "100px", width: "300px", ml: "5px"}}
            ></Avatar>
            <Typography component="h2" variant="h5" sx={{mt:"10px"}}>
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 0.5 }}
            >
              <TextField
                margin="normal"
                //required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                //required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <Typography
                    component="h2"
                    variant="body2"
                    sx={{ mr: "10px", fontSize: "16px", fontWeight: "bold" }}
                  >
                    Portal
                  </Typography>
                </Grid>
                <Grid item>
                  <Radio
                    value="fact"
                    color="primary"
                    size="small"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 14 } }}
                    inputProps={{ "aria-label": "FACT" }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1" sx={{ fontSize: 14 }}>
                    FACT
                  </Typography>
                </Grid>
                <Grid item>
                  <Radio
                    value="aspack"
                    color="primary"
                    size="small"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 14 } }}
                    inputProps={{ "aria-label": "ASPACK" }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1" sx={{ fontSize: 14 }}>
                    ASPACK
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={toggleDrawer}
                sx={{ mt: 1, mb: 2 }}
                style={btnstyle}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
