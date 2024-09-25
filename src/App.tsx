import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { Button, Menu, MenuItem, Fade, Dialog, DialogTitle, DialogContent, FormControl, DialogActions, FormHelperText, OutlinedInput, InputLabel } from "@mui/material";
import ConsArchived from "./Pages/ConsArchived";
import ConsRecent from "./Pages/ConsRecent";
import ConsKategori from "./Pages/ConsKategori";
import CustomTheme from "./Theme/CustomTheme";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Avatar, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import MenuItems from "./Component/MenuItems";
import UseToggleSidebar from "./CommonHandler/UseToggleSidebar";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MasterTemplate from "./Pages/MasterTemplate";
import Login from "./Pages/Login";
import MstUserAffco from "./Pages/MstUserAffco";
import AccordionWrapper from "./Component/AccordionWrapper";
import MstWorkflow from "./Pages/MasterWorkflow";
import WelcomePage from "./Pages/Welcome";
import OpenPeriod from "./Pages/oPeriode";
import EmailUpdateTemplate from "./Pages/MstTempEmail";
import HistoryUploadAffco from "./Pages/HistUploadAffco";
import PageContent from "./Component/PageContent";
import ConsApprovals from "./Pages/ConsApprovals";
import AffcoUpload from "./Pages/AffcoUpload";
import AcordionWrapper from "./Component/AccordionWrapper";
import EmailApprovalAspack from "./Pages/MstEmailApproval";
import EmailAffcoSubmit from "./Pages/MstEmailAffcoSubmit";
import { IProfileProps } from "./Component/Interface/DataTemplate";
import CloseIcon from "@mui/icons-material/Close";
import { apiUrl, getToken, getUserId } from "./Component/TemplateUrl";
import { genSaltSync } from "bcrypt-ts";
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CategorySettings from "./Pages/CategorySettings";

const drawerWidth: number = 250;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#DCDCDC",
  color: CustomTheme.palette.secondary.main,
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  "& .MuiToolbar-root": {
    paddingLeft: "5px",
  },
}));

const LeftDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    backgroundColor: CustomTheme.palette.primary.main,
    color: "white",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    height: "100vh", // Ensures full viewport height, important for scrolling
    overflowY: "auto", // Enable vertical scroll if content overflows
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(6),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(8),
      },
    }),
  },
  "& .MuiListItemIcon-root": {
    color: "white",
    ...(open && { minWidth: "30px" }),
  },
  "& .MuiListItemText-root .MuiTypography-root": {
    ...(open && { fontSize: "0.8rem" }),
  },
  "& .profileHero": {
    ...(!open && { display: "none" }),
  },
}));

const defaultTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: "hidden", // Disable overflow globally
        },
      },
    },
  },
});

const ProtectedRoute = ({ element }) => {
  const isToken = localStorage.getItem("token");
  return isToken ? element : <Navigate to="/" replace />;
};

function App() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { open, setOpen } = UseToggleSidebar();
  const [openProfile, setOpenProfile] = React.useState(false);
  
  const openMenu = Boolean(anchorEl);
  const username = localStorage.getItem("UserID");
  function ProfileDialog(props: IProfileProps){
    const {open, onClose} = props
    const [oldPassword, setOldPassword] = React.useState("");
  const [hasErrorOld, setHasErrorOld] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [hasErrorNew, setHasErrorNew] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [hasErrorConfirm, setHasErrorConfirm] = React.useState(false);
  const [hasNotMatch, setHasNotMatch] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false)
    const [showNewPassword, setShowNewPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const combine = oldPassword + getUserId;
    const encodeString = btoa(combine)
    const salt = genSaltSync(8)
    const hashOldPassword = salt + encodeString

    const handleChangeOldPassword = (event) => {
      if(event.target.value !== ""){
        setOldPassword(event.target.value)
        setHasErrorOld(false)
      } else {
        setOldPassword(event.target.value)        
      }

    }


    const handleChangePassword = () => {

      if(newPassword === confirmPassword && newPassword !== "" && confirmPassword !== ""){
        setHasNotMatch(false)
        const combineNew = newPassword + getUserId
        const encodeStringNew = btoa(combineNew)
        const hashNewPassword = salt + encodeStringNew

        fetch(apiUrl + "api/Auth/changePassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${getToken}`,
          },
          body: JSON.stringify({
            Password: hashOldPassword,
            NewPassword: hashNewPassword
          })
        }).then((resp) => {
          if(resp.ok) {
            onClose()
            alert("success change password")
          }
        })

      } else {
        if(newPassword === ""){
          setHasErrorNew(true);
        }
        if(confirmPassword === ""){
          setHasErrorConfirm(true);
        }
        if(confirmPassword !== newPassword){
          setHasNotMatch(true);
          setHasErrorConfirm(true)

        }
      }

    }
    return(
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}>
              <FormControl fullWidth> 
                <InputLabel sx={{ m:1}}>Old Password</InputLabel>               
                <OutlinedInput                                              
                error={hasErrorOld}
                sx={{ m:1}}
                value={oldPassword}
                onChange={handleChangeOldPassword}
                label="Old Password"
                size="medium"
                type={ showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                    onClick={() => { setShowPassword(!showPassword)}}
                    >
                      { showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                
                />
                {
                  hasErrorOld && (<FormHelperText sx={{ color: "red" }}>This is required!</FormHelperText>)
                }
              </FormControl>
              <FormControl fullWidth>
              <InputLabel sx={{ m:1}}>New Password</InputLabel> 
                <OutlinedInput                
                error={hasErrorNew}
                sx={{ m:1}}
                value={newPassword}
                onChange={(val) => { 
                  if(val.target.value !== ""){
                    setNewPassword(val.target.value)
                    setHasErrorNew(false)
                  } else {
                    setNewPassword(val.target.value)                    
                  }
                  }}
                label="New Password"
                size="medium"
                type={ showNewPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                    onClick={() => { setShowNewPassword(!showNewPassword)}}
                    >
                      { showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }

                />
                {
                  hasErrorNew && (<FormHelperText sx={{ color: "red" }}>This is required!</FormHelperText>)
                }
              </FormControl>
              <FormControl fullWidth>
              <InputLabel sx={{ m:1}}>Confirm Password</InputLabel> 
                <OutlinedInput                 
                error={hasErrorConfirm}
                sx={{ m:1}}
                value={confirmPassword}
                onChange={(val) => { 
                  if(val.target.value !== ""){
                    setConfirmPassword(val.target.value)
                    setHasErrorConfirm(false)
                  } else {
                    setConfirmPassword(val.target.value)
                  }
                  }}
                label="Confirm Password"
                size="medium"
                type={ showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                    onClick={() => { setShowConfirmPassword(!showConfirmPassword)}}
                    >
                      { showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                />
                {
                  hasErrorConfirm && (<FormHelperText sx={{ color: "red" }}>{ hasNotMatch ? "Confirm password not match with new password" : "This is required!"}</FormHelperText>)
                }
              </FormControl>
            </Box>
        </DialogContent>
        <DialogActions>
          <Box>
            <Button variant="contained"
              size="small"
              color="primary"
              sx={{ m: 1 }} onClick={handleChangePassword}>Change Password</Button>
              <Button
              onClick={onClose}
              variant="contained"
              size="small"
              color="inherit"
              sx={{ m: 1 }}
            >
              Cancel
            </Button>
          </Box>
          </DialogActions>        
      </Dialog>
    )

  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserName");
    localStorage.removeItem("UserID");
    localStorage.removeItem("Email");
    localStorage.removeItem("Role");
    localStorage.removeItem("CoCode");
    localStorage.removeItem("exp");
    window.location.href = "/";
  };

  const noToken = !localStorage.getItem("token");

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Router>
          {noToken ? (
            <Navigate to="/" replace />
          ) : (
            <>
              <AppBar position="absolute" open={open} elevation={0}>
                <Toolbar
                  sx={{
                    pr: "24px", // keep right padding when drawer closed\
                  }}
                  variant="dense"
                >
                  {!open && (
                    <Link to="/Welcome">
                      <Avatar
                        src={require("./assets/Logo AOP.png")}
                        variant="square"
                        sx={{ height: "40px", width: "60px" }}
                      />
                    </Link>
                  )}
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                      ml: 1,
                      marginRight: "36px",
                      // ...(open && { display: 'none' }),
                    }}
                  >
                    {!open && <MenuIcon />}
                    {open && <ChevronLeftIcon />}
                  </IconButton>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, visibility: "hidden" }}
                  >
                    News
                  </Typography>
                  <Button
                    id="fade-button"
                    aria-controls={openMenu ? "fade-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? "true" : undefined}
                    onClick={handleClick}
                    sx={{
                      textDecoration: "none",
                      color: CustomTheme.palette.primary.main,
                    }}
                    startIcon={<AccountCircleOutlinedIcon fontSize="large" />}
                  >
                    <Typography
                      sx={{
                        textTransform: "capitalize",
                        color: CustomTheme.palette.primary.main,
                        fontSize: "15px",
                      }}
                    >
                      {username}
                    </Typography>
                  </Button>
                  <Menu
                    id="fade-menu"
                    MenuListProps={{
                      "aria-labelledby": "fade-button",
                    }}
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => {setOpenProfile(true)}}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                  <ProfileDialog open={openProfile} onClose={() => { setOpenProfile(false)}}/>
                </Toolbar>
              </AppBar>
              <LeftDrawer variant="permanent" open={open}>
                <Toolbar
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    px: [1],
                  }}
                  variant="dense"
                >
                  <Link to="/Welcome">
                    <Avatar
                      src={require("./assets/Logo AOP.png")}
                      variant="square"
                      sx={{ height: "40px", width: "60px" }}
                    />
                  </Link>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1, fontWeight: "600" }}
                      >
                        {"Astra-Package"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1, fontSize: "10px" }}
                      >
                        {"by Astra-Otoparts Tbk"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Toolbar>
                <Divider sx={{ mb: "5px", backgroundColor: "#F5F5F5" }} />
                <Box sx={{ padding: "10px" }}>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <Avatar
                        alt="Profile Picture"
                        sx={{ width: 40, height: 40 }}
                      >
                        {"C"}
                      </Avatar>
                    </Grid>
                    <Grid
                      className="profileHero"
                      container
                      item
                      xs={9}
                      sx={{ textAlign: "left", fontSize: "12px" }}
                    >
                      <Grid item xs={12}>
                        <Typography sx={{ fontSize: "12px" }}>
                          {"Welcome,"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ fontSize: "18px" }}>
                          {username}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ mt: "5px", backgroundColor: "#F5F5F5" }} />
                <MenuItems DrawerStatus={open} />
              </LeftDrawer>
            </>
          )}

          <Box
            component="main"
            sx={{
              backgroundColor: "#F5F5F5",
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar
              sx={{
                maxHeight: "50px !important",
                minHeight: "46px !important",
              }}
            />
            <Container
              maxWidth="xl"
              sx={{
                mt: 0.5,
                mb: 0.5,
                pl: "5px !important",
                pr: "5px !important",
              }}
            >
              <Routes>
                {noToken ? (
                  <Route path="/" element={<Login />} />
                ) : (
                  <>
                    <Route
                      path=""
                      element={<ProtectedRoute element={<WelcomePage />} />}
                    />
                    <Route
                      path="/MstTemplate"
                      element={
                        <ProtectedRoute
                          element={
                            <AccordionWrapper
                              content={<MasterTemplate />}
                              headerTitle="Master Template Aspack"
                            />
                          }
                        />
                      }
                    />

                    <Route
                      path="/Approval"
                      element={
                        <PageContent
                          content={<ConsApprovals />}
                          headerTitle="Aspack Approval"
                        />
                      }
                    />

                    <Route
                      path="/AffcoUpload"
                      element={
                        <PageContent
                          content={<AffcoUpload />}
                          headerTitle="Affco Upload"
                        />
                      }
                    />

                    <Route
                      path="/MasterWorkflow"
                      element={
                        <ProtectedRoute
                          element={
                            <AccordionWrapper
                              content={<MstWorkflow />}
                              headerTitle="Master Workflow"
                            />
                          }
                        />
                      }
                    />

                    <Route
                      path="/Welcome"
                      element={<ProtectedRoute element={<WelcomePage />} />}
                    />

                    <Route
                      path="/Archived"
                      element={
                        <AcordionWrapper
                          content={<ConsArchived />}
                          headerTitle="Archived News"
                        />
                      }
                    />
                    <Route
                      path="/Recent"
                      element={
                        <AcordionWrapper
                          content={<ConsRecent />}
                          headerTitle="Recent News"
                        />
                      }
                    />
                    <Route
                      path="/Kategori"
                      element={
                        <AccordionWrapper
                          content={<ConsKategori />}
                          headerTitle="Category News"
                        />
                      }
                    />

                    <Route
                      path="/MstUserAffco"
                      element={
                        <ProtectedRoute
                          element={
                            <AccordionWrapper
                              content={<MstUserAffco />}
                              headerTitle="Master User & Affco"
                            />
                          }
                        />
                      }
                    />

                    <Route
                      path="/hisUploadAffco"
                      element={
                        <ProtectedRoute
                          element={
                            <AccordionWrapper
                              content={<HistoryUploadAffco />}
                              headerTitle="History Upload AFFCO"
                            />
                          }
                        />
                      }
                    />

                    <Route
                      path="/oPeriode"
                      element={<ProtectedRoute element={<OpenPeriod />} />}
                    />

<Route
                      path="/categorySettings"
                      element={
                        <ProtectedRoute
                          element={
                            <AccordionWrapper
                              content={<CategorySettings />}
                              headerTitle="Category Settings"
                            />
                          }
                        />
                      }
                    />

                    <Route
                      path="/emailUpdateTemp"
                      element={
                        <ProtectedRoute element={<EmailUpdateTemplate />} />
                      }
                    />

                    <Route
                      path="/emailApproval"
                      element={
                        <ProtectedRoute element={<EmailApprovalAspack />} />
                      }
                    />

                    <Route
                      path="/emailAffcoSubmit"
                      element={
                        <ProtectedRoute element={<EmailAffcoSubmit />} />
                      }
                    />
                  </>
                )}
              </Routes>
            </Container>
          </Box>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
