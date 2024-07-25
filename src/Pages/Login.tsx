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
import { jwtDecode, JwtPayload } from "jwt-decode";
import { hash } from "bcrypt-ts";

const theme = createTheme();

interface CustomJwtPayload extends JwtPayload {
  VNAMEUSR: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      // Hash the password before sending it to the server
      const hashedPassword = await hash(password, 8);

      const resp = await axios.post("http://10.194.235.103:9020/api/Auth/Login", {
        username,
        password: hashedPassword,
      });

      const { token, user } = resp.data;
      const decode = jwtDecode<CustomJwtPayload>(token);
      const userName = decode.VNAMEUSR; // Properti kustom dari token decoded
      console.log("Data : ", resp.data);
      console.log("Decode : ", decode);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("username", userName);
        localStorage.setItem("password", password);
        // navigate("/welcome");
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
    height: "58vh",
    width: 350,
    margin: "50px auto",
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
            <Typography component="h5" variant="h5" sx={{ mt: "1px" }}>
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 0.5 }}
            >
              <TextField
                margin="dense"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="medium"
              />
              <TextField
                margin="dense"
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
                size="medium"
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
