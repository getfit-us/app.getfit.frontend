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
  ListItemIcon,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
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
import { useProfile, useWorkouts } from "../Store/Store";
import GrabData from "./GrabData";

import { BASE_URL } from "../assets/BASE_URL";
import ServiceWorker from "./ServiceWorker";
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Header = ({ mobileOpen, setMobileOpen }) => {
  const profile = useProfile((state) => state.profile);
  const resetProfileState = useProfile((state) => state.resetProfileState);
  const resetWorkoutState = useWorkouts((state) => state.resetWorkoutState);
  const notifications = useProfile((state) => state.notifications);
  const setStatus = useProfile((state) => state.setStatus);
  const axiosPrivate = useAxiosPrivate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  // const [notifications, setNotifications] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();
  const drawerWidth = 200;
  const location = useLocation();
  const messages = useProfile((state) => state.messages);
  const activeNotifications = useProfile((state) => state.activeNotifications);

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
    if (profile.clientId) {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleOpenNotifications = (event) => {
    if (profile.clientId) {
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
    setStatus({ loading: true, error: false, message: "" });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get("/logout", {
        signal: controller.signal,
      });
      // console.log(response.data);
      resetProfileState();
      resetWorkoutState();
      setStatus({ loading: false, error: false, message: "" });
      handleCloseUserMenu();
      navigate("/");
    } catch (err) {
      setStatus({ loading: false, error: true, message: err.message });

      console.log(err);
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
      {profile?.accessToken && <GrabData />}

      {profile?.accessToken && <ServiceWorker />}
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
                  if (profile?.clientId) navigate("/dashboard/overview");
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

              {!profile?.accessToken && (
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
              {profile?.accessToken && !smUp && (
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
                  if (profile?.clientId) navigate("/dashboard/overview");
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

              {!profile?.accessToken && (
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
              {profile?.accessToken && (
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
                      {activeNotifications?.length > 0 ? (
                        <NotificationsActive sx={{ color: "#e32a09" }} />
                      ) : (
                        <Notifications sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  {profile?.accessToken && (
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
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/messages");
                          handleCloseNotificationMenu();
                        }}
                      >
                        Messages
                        {(messages?.length > 0 && activeNotifications?.length > 0) && (
                          <ListItemIcon>
                            <NotificationImportantRounded />
                          </ListItemIcon>
                        )}
                      </MenuItem>
                      {activeNotifications.filter(
                        (notification) => notification.type === "task"
                      ).length > 0 && (
                        <MenuItem>
                          <List>
                            {activeNotifications.map((notification) => {
                              return notification.type === "task" ? (
                                <ListItem key={notification._id}>
                                  <ListItemText
                                    primary={notification.message}
                                  />
                                </ListItem>
                              ) : null;
                            })}
                          </List>
                        </MenuItem>
                      )}
                    </Menu>
                  )}
                </Box>
              )}

              {profile?.accessToken && (
                <Box sx={{ alignItems: "end" }}>
                  <Tooltip title="Manage">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        srcSet={`${BASE_URL}/avatar/${profile?.avatar}`}
                        sx={{ bgcolor: "black", outline: "1px solid #fff" }}
                      >
                        {profile?.accessToken &&
                          profile?.firstName[0].toUpperCase()}
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
                    {profile?.email && (
                      <MenuItem
                        sx={{
                          fontSize: "1.5rem",
                          color: "grey",
                        }}
                        onClick={handleCloseUserMenu}
                      >{`Account Type: ${
                        profile?.roles.includes(2)
                          ? "Client"
                          : profile?.roles.includes(5)
                          ? "Trainer"
                          : profile?.roles.includes(10)
                          ? "Admin"
                          : ""
                      }`}</MenuItem>
                    )}
                    {profile?.accessToken && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/overview");
                          handleCloseUserMenu();
                        }}
                      >
                        DashBoard
                      </MenuItem>
                    )}

                    {profile?.accessToken && (
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

                    {profile?.accessToken && (
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
