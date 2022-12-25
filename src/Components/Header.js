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
  Badge,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Logout,
  ManageAccounts,
  Notifications,
  NotificationsActive,
} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import ScrollTop from "./Scroll";
import HideScrollBar from "./HideScrollBar";
import { useProfile, useWorkouts } from "../Store/Store";
import { LogoutUser } from "../Api/services";
import { BASE_URL } from "../assets/BASE_URL";
import ServiceWorker from "./ServiceWorker";
import { getActiveNotifications } from "../Api/services";
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Header = ({ mobileOpen, setMobileOpen }) => {
  const profile = useProfile((state) => state.profile);
  const resetProfileState = useProfile((state) => state.resetProfileState);
  const resetWorkoutState = useWorkouts((state) => state.resetWorkoutState);
  const axiosPrivate = useAxiosPrivate();
  const setActiveNotifications = useProfile(
    (state) => state.setActiveNotifications
  );

  const [typeOfNotification, setTypeOfNotification] = useState({
    tasks: 0,
    messages: 0,
    balance: false,
  });

  const [anchorElNav, setAnchorElNav] = useState(null);
  // const [notifications, setNotifications] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();
  const drawerWidth = 200;
  const location = useLocation();

  const activeNotifications = useProfile((state) => state.activeNotifications);
  const [status, setStatus] = useState({});

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

    setTypeOfNotification({
      messages: activeNotifications?.filter(
        (notification) => notification.type === "message"
      ).length,
      tasks: activeNotifications?.filter(
        (notification) => notification.type === "task"
      ).length,
      balance: profile?.accountDetails?.credit < 0 ? true : false,
    });
  }, [location.pathname, activeNotifications]);

  useEffect(() => {
    // if user is logged in hit api to get notifications

    if (profile?.clientId) {
      const interval = setInterval(() => {
        getActiveNotifications(axiosPrivate, {
          setActiveNotifications,
          profile,
        }).then((res) => {
          if (res) {
            console.log(res);
            clearInterval(interval);
          }
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [profile.clientId]);

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

  const handleLogout = () => {
    LogoutUser(axiosPrivate).then((res) => {
      setStatus(res);
      if (res.loading === false && res.error === false) {
        resetProfileState();
        resetWorkoutState();
        handleCloseUserMenu();
        navigate("/");
      }
    });
  };


  //if new notifications display
  //set loading of api calls inside header once logged in
  return (
    <>
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
                <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
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
                <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ display: { md: "none" } }}
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
                  if (profile?.accessToken) navigate("/dashboard/overview");
                  else navigate("/");
                }}
                sx={{
                  mr: 1,
                  ml: 2,
                  mt: 1,
                  mb: 1,
                  display: { xs: "flex", md: "none" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  flexGrow: 0.2,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                  alignSelf: "self-start",
                }}
              >
                <img
                  src={require("../assets/img/GF-logo-sm.png")}
                  alt="getfit Logo"
                  width="30%"
                  height="30%"
                  style={{ marginRight: "3rem" }}
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
                    marginRight: 3,
                    justifyContent: "right",
                    display: "flex",
                    alignItems: "end",
                  }}
                >
                  <Tooltip title="Notifications">
                    <IconButton onClick={handleOpenNotifications} sx={{ p: 0 }}>
                      {/* show notification icon if there are new notifications that haven't been read and they are not of type goal */}
                      {activeNotifications?.length > 0 ||
                      typeOfNotification.balance ? (
                        <Badge
                          badgeContent={
                            activeNotifications?.length &&
                            typeOfNotification.balance
                              ? activeNotifications?.length + 1
                              : typeOfNotification.balance
                              ? 1
                              : activeNotifications?.length
                          }
                          color="error"
                        >
                          <NotificationsActive sx={{ color: "white" }} />
                        </Badge>
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
                        {typeOfNotification?.messages > 0 && (
                          <Badge
                            badgeContent={typeOfNotification?.messages}
                            color="error"
                            sx={{ ml: 2 }}
                          />
                        )}
                      </MenuItem>
                      {typeOfNotification.tasks > 0 && (
                        <MenuItem
                          onClick={() => {
                            navigate("/dashboard/overview/#goals");
                            handleCloseNotificationMenu();
                          }}
                        >
                          Tasks
                          <Badge
                            badgeContent={typeOfNotification.tasks}
                            color="error"
                            sx={{ ml: 2 }}
                          />
                        </MenuItem>
                      )}
                      {typeOfNotification.balance && (
                        <MenuItem
                          onClick={() => {
                            navigate("/dashboard/profile#account-details");
                            handleCloseNotificationMenu();
                          }}
                        >
                          Account Balance
                          <Badge
                            badgeContent={1}
                            color="error"
                            sx={{ ml: 2 }}
                          />
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
                    {profile?.accessToken && (
                      <MenuItem
                        sx={{
                          fontSize: "1rem",
                          color: "grey",
                        }}
                        onClick={handleCloseUserMenu}
                      >{`Account: ${
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
                        selected={location.pathname === "/dashboard/overview"}
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
                        selected={location.pathname === "/dashboard/profile"}
                      >
                        <ListItemIcon>
                          <ManageAccounts fontSize="small" />
                        </ListItemIcon>
                        Profile
                      </MenuItem>
                    )}

                    {profile?.accessToken && (
                      <MenuItem onClick={handleLogout}>
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
