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
  Alert,
  Paper,
} from "@mui/material";
import UseToggleSidebar from "../CommonHandler/UseToggleSidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useUser} from "../GlobalUsers/UserContext";

const theme = createTheme();

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const resp = await axios.post("https://localhost:44338/api/Auth/Login", {
        email,
        password,
        role
      });

      console.log("Role " + role);

      const { token, user } = resp.data;
      console.log("Token", token);
      if (token) {
        localStorage.setItem("token", token);
        setError("");
        setUser(user); // Assuming user data contains role and email
        // navigate("/Welcome");
        // window.location.reload();
      } else {
        setError("Token not found in response");
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  const { open, setOpen } = UseToggleSidebar();
  const toggleDrawer = () => {
    setOpen(true);
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
              sx={{ height: "45px", width: "200px", ml: "5px" }}
            ></Avatar>
            <Typography component="h5" variant="h5" sx={{mt: "1px"}}>
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
              {/* Test Role */}
              {/* <TextField
                margin="normal"
                //required
                fullWidth
                hidden
                name="role"
                label="role"
                type="role"
                id="role"
                autoComplete="current-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              /> */}
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <Typography
                    component="h2"
                    variant="body2"
                    sx={{ mr: "10px", fontSize: "14px", fontWeight: "bold" }}
                  >
                    Portal
                  </Typography>
                </Grid>
                <Grid item>
                  <Radio
                    value="fact"
                    color="primary"
                    size="small"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 12 } }}
                    inputProps={{ "aria-label": "FACT" }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1" sx={{ fontSize: 12 }}>
                    FACT
                  </Typography>
                </Grid>
                <Grid item>
                  <Radio
                    value="aspack"
                    color="primary"
                    size="small"
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 12 } }}
                    inputProps={{ "aria-label": "ASPACK" }}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1" sx={{ fontSize: 12 }}>
                    ASPACK
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={toggleDrawer}
                sx={{ mt: 1, mb: 1 }}
                style={btnstyle}
              >
                Sign In
              </Button>
              {error && (
                <Alert severity="error" sx={{ width: "100%", mt: 5 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
