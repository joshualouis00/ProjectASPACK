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
  FormControl,
  FormControlLabel,
  RadioGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import UseToggleSidebar from "../CommonHandler/UseToggleSidebar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { genSaltSync } from "bcrypt-ts";
import { apiUrl } from "../Component/TemplateUrl";
import { ForgetPassword, forgetToken } from "./ForgetPassword";
import LoginPage from "../Component/BgLogin";
import BackGroundLogin from "../assets/BgLogin.png";

const theme = createTheme();

interface CustomJwtPayload extends JwtPayload {
  UserID: string;
  UserName: string;
  Email: string;
  Role: string;
  CoCode: string;
  exp: number;
}

const Login: React.FC = () => {
  const [userId, setUserID] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [value, setValue] = React.useState("ASP");
  const [openForgetDialog, setOpenForgetDialog] = useState(false);
  const [openChangePassDialog, setOpenChangePassDialog] = useState(false);
  const [userIdForForget, setUserIDForForget] = useState("");
  const [resetError, setResetError] = useState<string>("");

  React.useEffect(() => {
    if (forgetToken !== "") {
      setOpenChangePassDialog(true);
    } else {
      setOpenChangePassDialog(false);
    }

    console.log("Token Forget", forgetToken);

    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); // 5000ms = 5 detik

      return () => clearTimeout(timer);
    }

    if (resetError) {
      const timer = setTimeout(() => {
        setResetError("");
      }, 5000); // 5000ms = 5 detik

      return () => clearTimeout(timer);
    }
  }, [error, resetError]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const navigate = useNavigate();
  const combine = password + userId;
  const encodeString = btoa(combine);
  const salt = genSaltSync(8);
  const hashedPassword = salt + encodeString;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const resp = await axios.post(apiUrl + "api/Auth/Login", {
        Email: userId,
        Password: hashedPassword,
        target: value,
      });

      const { token } = resp.data;
      const decode = jwtDecode<CustomJwtPayload>(token);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("UserID", decode.UserID);
        localStorage.setItem("UserName", decode.UserName);
        localStorage.setItem("Email", decode.Email);
        localStorage.setItem("Role", decode.Role);
        localStorage.setItem("CoCode", decode.CoCode);

        navigate("/welcome");
        window.location.reload();
      } else {
        setError("Token not found in response");
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  const handleSendResetEmail = async () => {
    if (!userIdForForget) {
      setResetError("User ID is required");
      return;
    }

    try {
      const response = await axios.get(
        apiUrl + `api/Auth/requestForgetPassword?vUserId=${userIdForForget}`
      );

      if (response.data.success) {
        alert("Please check your email for reset link.");
        setOpenForgetDialog(false);
      } else {
        setResetError(response.data.message);
      }
    } catch (error) {
      setResetError("Error sending reset email.");
    }
  };

  const handleForgetPassword = () => {
    setOpenForgetDialog(true);
  };

  const handleCancel = () => {
    setUserIDForForget(""); // Reset nilai TextField
    setOpenForgetDialog(false); // Tutup dialog
  };

  const { open, setOpen } = UseToggleSidebar();
  const toggleDrawer = () => {
    setOpen(true);
  };

  const paperStyle = {
    padding: "10px",
    height: "61vh",
    width: 350,
    margin: "50px auto",
  };
  const btnstyle = { margin: "8px 0" };

  return (
    // <ThemeProvider theme={theme}>
    <Box
      sx={{
        backgroundImage: `url(${require("../assets/Login.png")})`,
        backgroundSize: "cover", // or "contain" if you want to fit the image
        backgroundRepeat: "no-repeat", // prevent tiling
        width: "215vh",
        height: "98vh",
        mt: 1,
        ml: -1,
        mr: -2,
        display: "flex", // Tambahkan ini
        alignItems: "center", // Tambahkan ini
      }}
    >
      <Container component="main" maxWidth="xs" sx={{mb: 1}}>
        {/* <LoginPage /> */}
        <CssBaseline />
        <Paper elevation={15} style={paperStyle}>
          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={require("../assets/logoAOP.png")}
              variant="square"
              sx={{ height: "3rem", width: "12.5rem", ml: "0.5rem" }}
            />
            <Typography component="h5" variant="h5" sx={{ mt: "0.5rem" }}>
              Login
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: "0.5rem" }}
            >
              <TextField
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={userId}
                onChange={(e) => setUserID(e.target.value)}
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
                    sx={{
                      mr: "1rem",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                    }}
                  >
                    Portal
                  </Typography>
                </Grid>

                <Grid item>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="portal-label"
                      name="portal-login"
                      value={value}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="FPA"
                        id="CAPEX"
                        control={
                          <Radio
                            size="small"
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: "0.75rem" },
                            }}
                          />
                        }
                        label="FPA"
                      />

                      <FormControlLabel
                        value="ASP"
                        id="ASPACK"
                        control={
                          <Radio
                            size="medium"
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: "0.75rem" },
                            }}
                            inputProps={{ "aria-label": "FACT" }}
                          />
                        }
                        label="CONSOLIDATION"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={toggleDrawer}
                sx={{ mt: "1rem", mb: "1rem" }}
                style={btnstyle}
                size="medium"
              >
                Sign In
              </Button>

              <Typography
                sx={{
                  mb: "1rem",
                  color: "blue",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={handleForgetPassword}
              >
                Forget Password?
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: "100%", mt: "2rem" }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Dialog for forget password */}
        <ForgetPassword
          open={openChangePassDialog}
          onClose={() => {
            setOpenChangePassDialog(false);
          }}
        />
        <Dialog
          open={openForgetDialog}
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              setOpenForgetDialog(false);
            }
          }}
          disableEscapeKeyDown
        >
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="reset-userid"
              label="Enter your user id"
              type="userid"
              fullWidth
              variant="standard"
              value={userIdForForget}
              onChange={(e) => setUserIDForForget(e.target.value)}
            />
            {resetError && <Alert severity="error">{resetError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSendResetEmail}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Login;
