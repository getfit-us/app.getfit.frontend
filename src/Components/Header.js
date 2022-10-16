import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  IconButton,
  Menu,
  Container,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  CircularProgress,
  ListItemIcon,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useProfile from "../hooks/useProfile";
import MenuIcon from "@mui/icons-material/Menu";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Info,
  Logout,
  ManageAccounts,
  NotificationImportantRounded,
  Notifications,
  NotificationsActive,
} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import ScrollTop from "./Scroll";
import HideScrollBar from "./HideScrollBar";
import Overview from "./Overview";
import TabView from "./Profile/TabView";
import GrabData from "./GrabData";
import Messages from "./Notifications/Messages";
import Reminders from "./Notifications/Reminders";
import NotificationSnackBar from "./Notifications/SnackbarNotify";
import Tasks from "./Notifications/Tasks";
import { BASE_URL } from "../assets/BASE_URL";
import ServiceWorker from "./ServiceWorker";
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Header = ({ mobileOpen, setMobileOpen }) => {
  const axiosPrivate = useAxiosPrivate();
  const { state, dispatch } = useProfile();
  const { setAuth, auth } = useAuth();
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    message: "",
  });
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();
  const drawerWidth = 200;
  const location = useLocation();
  // const [openSnackbar, setOpenSnackbar] = useState(true);

  const smUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(() => {
    // set width and Margin left based on screensize and page location
    if (location.pathname === "/dashboard") {
      setDashboard({
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      });
    } else if (location.pathname !== "/dashboard") {
      setDashboard({});
    }
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    if (state.profile.clientId) {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleOpenNotifications = (event) => {
    if (state.profile.clientId) {
      setAnchorElNotify(event.currentTarget);
    }
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotify(null);
  };

  const onLogout = async () => {
    let isMounted = true;
    dispatch({
      type: "SET_STATUS",
      payload: { loading: true, error: null, message: null },
    });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get("/logout", {
        signal: controller.signal,
      });
      // console.log(response.data);
      setAuth({});
      dispatch({
        type: "RESET_STATE",
      });

      handleCloseUserMenu();
      navigate("/");
    } catch (err) {
      dispatch({
        type: "SET_STATUS",
        payload: { loading: false, error: err, message: err.message },
      });

      console.log(err);
    } finally {
      dispatch({
        type: "SET_STATUS",
        payload: { loading: false, error: null, message: null },
      });
    }

    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  //if new notifications display
  //set loading of api calls inside header once logged in
  return (
    <>
      {/* <NotificationSnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} /> */}
      {state.profile.clientId && <GrabData setStatus={setStatus} />}

      {auth.accessToken && <ServiceWorker />}
      <HideScrollBar>
        <AppBar position="fixed" sx={dashboard}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                //if logged in goto dashboard otherwise goto homePage
                onClick={() => {
                  if (state.profile.clientId) navigate("/dashboard/overview");
                  else navigate("/");
                }}
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  mt: 1,
                  mb: 1,
                }}
              >
                <img
                  src={require("../assets/img/GF-logo-sm.png")}
                  alt="getfit Logo"
                  width="50%"
                  height="50%"
                />
              </Typography>

              {!state.profile.clientId && (
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: "block", md: "none" },
                    }}
                  >
                    <MenuItem>
                      <Button
                        component={Link}
                        to="/sign-up"
                        label="Sign Up"
                        onClick={handleCloseNavMenu}
                      >
                        Get Started
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        component={Link}
                        to="/Login"
                        label="Login"
                        onClick={handleCloseNavMenu}
                      >
                        Login
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        component={Link}
                        to="/about"
                        label="About"
                        onClick={handleCloseNavMenu}
                      >
                        About
                      </Button>
                    </MenuItem>
                  </Menu>
                </Box>
              )}

              {/* if logged in and on dashboard */}
              {state.profile.clientId && !smUp && (
                <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: "none" } }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              )}

              <Typography
                variant="h5"
                noWrap
                component="a"
                //if logged in goto dashboard otherwise goto homePage
                onClick={() => {
                  if (state.profile.clientId) navigate("/dashboard/overview");
                  else navigate("/");
                }}
                sx={{
                  mr: 2,
                  mt: 1,
                  mb: 1,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <img
                  src={require("../assets/img/GF-logo-sm.png")}
                  alt="getfit Logo"
                  width="30%"
                  height="30%"
                />
              </Typography>

              {!state.profile.clientId && (
                <Box
                  sx={{
                    flexGrow: 1,
                    gap: 2,
                    display: { xs: "none", md: "flex" },
                  }}
                  className=""
                >
                  <Button
                    component={Link}
                    to="/sign-up"
                    label="Get Started"
                    color="secondary"
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                  >
                    {" "}
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    color="secondary"
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/about"
                    label="About"
                    color="secondary"
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                  >
                    About
                  </Button>
                </Box>
              )}

              {/* add notification menu */}
              {auth.accessToken && (
                <Box
                  sx={{
                    flexGrow: 1,
                    marginRight: 2,
                    justifyContent: "right",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  <Tooltip title="Notifications">
                    <IconButton onClick={handleOpenNotifications} sx={{ p: 0 }}>
                      {/* show notification icon if there are new notifications that haven't been read and they are not of type goal */}
                      {state.notifications?.length !== 0 &&
                      state.notifications.filter(
                        (notification) =>
                          notification.receiver.id === state.profile.clientId &&
                          notification.is_read === false &&
                          notification.type !== "goal" &&
                          notification.type !== "activity"
                      ).length > 0 ? (
                        <NotificationsActive sx={{ color: "red" }} />
                      ) : (
                        <Notifications sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElNotify}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElNotify)}
                    onClose={handleCloseNotificationMenu}
                  >
                    {state.profile.email && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/messages");
                          handleCloseNotificationMenu();
                        }}
                      >
                        Messages{" "}
                        {state.notifications.filter(
                          (notification) => notification.type === "message"
                        ).length > 0 &&
                        state.notifications.filter(
                          (notification) =>
                            notification.receiver.id === state.profile.clientId
                        ).length > 0 ? (
                          <NotificationImportantRounded />
                        ) : (
                          ""
                        )}
                      </MenuItem>
                    )}

                    {state.profile.email && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/reminders");
                          handleCloseNotificationMenu();
                        }}
                      >
                        Reminders
                      </MenuItem>
                    )}
                    {state.profile.email && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/tasks");
                          handleCloseNotificationMenu();
                        }}
                      >
                        Tasks{" "}
                        {state.notifications.filter(
                          (notification) => notification.type === "task"
                        ).length > 0 &&
                        state.notifications.filter(
                          (notification) =>
                            notification.receiver.id === state.profile.clientId
                        ).length > 0 ? (
                          <Info />
                        ) : (
                          ""
                        )}
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
              )}

              {state.profile.email && (
                <Box sx={{ alignItems: "end" }}>
                  <Tooltip title="Manage">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        srcSet={`${BASE_URL}/avatar/${state.profile.avatar}`}
                        sx={{ bgcolor: "black" }}
                      >
                        {state.profile.email &&
                          state.profile.firstName[0].toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {state.profile.email && (
                      <MenuItem
                        sx={{
                          fontSize: "1.5rem",
                          color: "grey",
                        }}
                        onClick={handleCloseUserMenu}
                      >{`Account Type: ${
                        state.profile.roles.includes(2)
                          ? "Client"
                          : state.profile.roles.includes(5)
                          ? "Trainer"
                          : state.profile.roles.includes(10)
                          ? "Admin"
                          : ""
                      }`}</MenuItem>
                    )}
                    {state.profile.email && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/overview");
                          handleCloseUserMenu();
                        }}
                      >
                        DashBoard
                      </MenuItem>
                    )}

                    {state.profile.email && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/profile");

                          handleCloseUserMenu();
                        }}
                      >
                        <ListItemIcon>
                          <ManageAccounts fontSize="small" />
                        </ListItemIcon>
                        Profile
                      </MenuItem>
                    )}

                    {state.profile.email && (
                      <MenuItem onClick={onLogout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideScrollBar>
      <ScrollTop />
      {/* offset adds space under appbar to push content down page */}
      <Offset id="back-to-top-anchor" />
    </>
  );
};

export default Header;
