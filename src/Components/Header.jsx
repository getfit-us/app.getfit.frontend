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
  CalendarToday,
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
import { BASE_URL } from "../assets/BASE_URL";
import "./Header.css";
import CalendarModal from "./Calendar/CalendarModal";
import { getSWR } from "../Api/services";
import useSWR from "swr";
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const Header = ({ mobileOpen, setMobileOpen }) => {
  const profile = useProfile((state) => state.profile);
  const balance = useProfile((state) => state.balance);
  const tasks = useProfile((state) => state.tasks);
  const isClient = useProfile((state) => state.isClient);
  const isTrainer = useProfile((state) => state.isTrainer);
  const isAdmin = useProfile((state) => state.isAdmin);
  const handleLogout = useProfile((state) => state.handleLogout);
  const setMessages = useProfile((state) => state.setMessages);
  const setTasks = useProfile((state) => state.setTasks);
  const setAlerts = useProfile((state) => state.setAlerts);

  const axiosPrivate = useAxiosPrivate();

  const [anchorElNav, setAnchorElNav] = useState(null);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const [dashboard, setDashboard] = useState({});
  const navigate = useNavigate();
  const drawerWidth = 200;
  const currentDate = new Date();
  const location = useLocation();
  const [openCalendar, setOpenCalendar] = useState(false);
  const handleCalendarModal = () => setOpenCalendar((prev) => !prev);

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

  //get alerts from api
  const { data: alerts, isLoading: loadingAlerts } = useSWR(
    profile?.clientId ? `/notifications/alerts/${profile.clientId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      refreshInterval: 3000,
      onSuccess: (data) => {
        setAlerts(data);
      },
    }
  );

  //get messages from api
  const { data: messages, isLoading: loadingMessages } = useSWR( profile?.clientId ? 
    `/notifications/messages/${profile.clientId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      refreshInterval: 3000,
      onSuccess: (data) => {
        setMessages(data);
      },
    }
  );

  //if new notifications display
  //set loading of api calls inside header once logged in
  return (
    <>
      <CalendarModal
        open={openCalendar}
        handleModal={handleCalendarModal}
        currentDate={currentDate}
      />
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
                  src="../public/img/GF-logo-sm.png"
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
                    <MenuItem
                      component={Link}
                      to="/Login"
                      label="Login"
                      onClick={handleCloseNavMenu}
                    >
                      Login
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/sign-up"
                      label="Sign Up"
                      onClick={handleCloseNavMenu}
                    >
                      Sign Up
                    </MenuItem>

                    <MenuItem
                      component={Link}
                      to="/about"
                      label="About"
                      onClick={handleCloseNavMenu}
                    >
                      About
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
                  src="../public/img/GF-logo-sm.png"
                  alt="getfit Logo"
                  width="30%"
                  height="30%"
                  style={{ marginRight: "3rem" }}
                />
              </Typography>

              {/* Regular Button Menu visible when NOT logged in */}

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
                    to="/login"
                    color="secondary"
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    to="/sign-up"
                    label="Sign Up"
                    color="secondary"
                    variant="contained"
                    sx={{ borderRadius: 5 }}
                  >
                    {" "}
                    Sign Up
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

              {/* Notification Menu only visible if logged in */}

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
                      {alerts?.length > 0 || balance < 0 ? (
                        <Badge badgeContent={alerts?.length} color="error">
                          <NotificationsActive sx={{ color: "white" }} />
                        </Badge>
                      ) : (
                        <Notifications sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Menu
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
                      {messages?.length > 0 && (
                        <Badge
                          badgeContent={messages?.length}
                          color="error"
                          sx={{ ml: 2 }}
                        />
                      )}
                    </MenuItem>
                    {tasks?.length > 0 && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/overview/#goals");
                          handleCloseNotificationMenu();
                        }}
                      >
                        Tasks
                        <Badge
                          badgeContent={tasks?.length}
                          color="error"
                          sx={{ ml: 2 }}
                        />
                      </MenuItem>
                    )}
                    {balance < 0 && (
                      <MenuItem
                        onClick={() => {
                          navigate("/dashboard/profile#account-details");
                          handleCloseNotificationMenu();
                        }}
                      >
                        Account Balance
                        <Badge badgeContent={1} color="error" sx={{ ml: 2 }} />
                      </MenuItem>
                    )}
                  </Menu>
                </Box>
              )}
              {/* Profile Avatar menu only visible if logged in  */}
              {profile?.accessToken && (
                <Box sx={{ alignItems: "end" }}>
                  <Tooltip title="Manage">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar srcSet={`${BASE_URL}/avatar/${profile?.avatar}`}>
                        {profile?.accessToken &&
                          profile?.firstName[0].toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  <Menu
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
                    <MenuItem divider>{`Account: ${
                      isClient
                        ? "Client"
                        : isTrainer
                        ? "Trainer"
                        : isAdmin
                        ? "Admin"
                        : ""
                    }`}</MenuItem>

                    <MenuItem
                      onClick={() => {
                        navigate("/dashboard/overview");
                        handleCloseUserMenu();
                      }}
                      selected={location.pathname === "/dashboard/overview"}
                    >
                      Dashboard
                    </MenuItem>

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
                    <MenuItem
                      onClick={() => {
                        handleCalendarModal();
                        handleCloseUserMenu();
                      }}
                    >
                      <ListItemIcon>
                        <CalendarToday fontSize="small" />
                      </ListItemIcon>
                      Add Goal
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        handleLogout(axiosPrivate);
                        handleCloseUserMenu();
                        navigate("/");
                      }}
                    >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
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
