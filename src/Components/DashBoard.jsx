import {
  Container,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  Drawer,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StraightenIcon from "@mui/icons-material/Straighten";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  Build,
  Create,
  History,
  ManageAccounts,
  Photo,
  Tune,
} from "@mui/icons-material";

import WorkoutModal from "./Workout/Modals/WorkoutModal";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../Store/Store";
// need to change the way we handle the routes, need to control when a user decides to leave a page and use modal

const DashBoard = ({ setMobileOpen, mobileOpen }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profile = useProfile((state) => state.profile);
  const isTrainer = useProfile((state) => state.isTrainer);
  const isAdmin = useProfile((state) => state.isAdmin);
  const isClient = useProfile((state) => state.isClient);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawerWidth = 200;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      navigate("/dashboard/overview", { replace: true });
    }
  }, []);

  const drawer = (
    <div>
      <List>
        <ListItem
          onClick={() => {
            navigate("/dashboard/overview");
            if (mobileOpen) handleDrawerToggle();
          }}
          sx={{
            border: "2px solid white",
            borderRadius: "10px",
            justifyContent: "center",
            padding: 1,
            display: "flex",
            flexDirection: "column",
            marginBottom: 1,
            backgroundColor: "#3070AF",
            cursor: "pointer",
          }}
        >
          <h3
            style={{
              margin: 0,
            }}
          >
            GETFIT
          </h3>
          <img
            src="../public/img/GF-logo-sm.png"
            alt="getfit Logo"
            width="30%"
            height="30%"
          />
          <span sx={{ display: "block" }}>
            {isAdmin && "ADMIN"}
            {isClient && `CLIENT`}
            {isTrainer && `TRAINER`}
          </span>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title="Start Workout" placement="right-start">
            <ListItemButton
              variant="text"
              className="dashboardBtn"
              sx={{
                [`& .active, &:hover`]: {
                  backgroundColor: "#3070AF",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "#689ee1",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },

                  "&:hover": {
                    backgroundColor: "#3070AF",
                  },
                  margin: 0.2,
                },
                overflow: "hidden",
                borderRadius: 4,
                margin: 0.2,
              }}
              selected={
                location.pathname === "/dashboard/start-workout" ? true : false
              }
              onClick={() => {
                //need to check if already on page and do something

                navigate("/dashboard/start-workout");
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <FitnessCenterIcon sx={{ marginRight: 1 }} /> Start Workout
            </ListItemButton>
          </Tooltip>
        </ListItem>
        <ListItem disablePadding>
          <Tooltip title="Create Workout" placement="right-start">
            <ListItemButton
              variant="text"
              className="dashboardBtn"
              sx={{
                [`& .active, &:hover`]: {
                  backgroundColor: "#3070AF",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "#689ee1",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },

                  "&:hover": {
                    backgroundColor: "#3070AF",
                  },
                  margin: 0.2,
                },
                overflow: "hidden",
                borderRadius: 4,
                margin: 0.2,
              }}
              selected={
                location.pathname === "/dashboard/create-workout" ? true : false
              }
              onClick={() => {
                //need to check if already on page and do something

                setModalOpen((prev) => !prev);

                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <Create sx={{ marginRight: 1 }} /> Create Workout
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {isAdmin && (
          <Tooltip title="Manage Custom Workouts" placement="right">
            <ListItemButton
              variant="text"
              sx={{
                [`& .active, &:hover`]: {
                  backgroundColor: "#3070AF",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "#689ee1",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },

                  "&:hover": {
                    backgroundColor: "#3070AF",
                  },
                  margin: 0.2,
                },
                overflow: "hidden",
                borderRadius: 4,
                margin: 0.2,
              }}
              selected={
                location.pathname === "/dashboard/manage-customworkouts"
                  ? true
                  : false
              }
              // selected={page.type.name === "ManageCustomWorkouts" ? true : false}
              onClick={() => {
                navigate("/dashboard/manage-customworkouts");
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <Tune sx={{ marginRight: 1 }} />
              Manage Custom Workouts
            </ListItemButton>
          </Tooltip>
        )}

        <ListItem disablePadding>
          {isAdmin && (
            <Tooltip title="Manage Exercises" placement="right">
              <ListItemButton
                variant="text"
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: "#3070AF",
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: "#000",
                    },
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#689ee1",
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: "#000",
                    },

                    "&:hover": {
                      backgroundColor: "#3070AF",
                    },
                    margin: 0.2,
                  },
                  overflow: "hidden",
                  borderRadius: 4,
                  margin: 0.2,
                }}
                selected={
                  location.pathname === "/dashboard/manage-exercises"
                    ? true
                    : false
                }
                onClick={() => {
                  navigate("/dashboard/manage-exercises");
                  if (mobileOpen) handleDrawerToggle();
                }}
              >
                <Build sx={{ marginRight: 1 }} />
                Manage Exercises
              </ListItemButton>
            </Tooltip>
          )}
        </ListItem>

        <ListItem disablePadding>
          {isAdmin && (
            <Tooltip title="Users" placement="right">
              <ListItemButton
                id="dashboardBtn"
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: "#3070AF",
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: "#000",
                    },
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#689ee1",
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: "#000",
                    },

                    "&:hover": {
                      backgroundColor: "#3070AF",
                    },
                    margin: 0.2,
                  },
                  overflow: "hidden",
                  borderRadius: 4,
                  margin: 0.2,
                }}
                selected={
                  location.pathname === "/dashboard/manage-users" ? true : false
                }
                variant="text"
                onClick={() => {
                  navigate("/dashboard/manage-users");
                  if (mobileOpen) handleDrawerToggle();
                }}
              >
                <ManageAccounts sx={{ marginRight: 1 }} />
                Manage Users
              </ListItemButton>
            </Tooltip>
          )}
        </ListItem>
        <ListItem disablePadding>
          {isAdmin && (
            <Tooltip title="Clients" placement="right">
              <ListItemButton
                id="dashboardBtn"
                sx={{
                  [`& .active, &:hover`]: {
                    backgroundColor: "#3070AF",
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: "#000",
                    },
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#689ee1",
                    fontWeight: "bold",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "2px 2px 2px #000f",
                    "& svg": {
                      fill: "#000",
                    },

                    "&:hover": {
                      backgroundColor: "#3070AF",
                    },
                    margin: 0.2,
                  },
                  overflow: "hidden",
                  borderRadius: 4,
                  margin: 0.2,
                }}
                selected={
                  location.pathname === "/dashboard/manage-clients"
                    ? true
                    : false
                }
                variant="text"
                onClick={() => {
                  navigate("/dashboard/manage-clients");
                  if (mobileOpen) handleDrawerToggle();
                }}
              >
                <PersonIcon sx={{ marginRight: 1 }} />
                Manage Clients
              </ListItemButton>
            </Tooltip>
          )}
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title="View Workouts" placement="right">
            <ListItemButton
              variant="text"
              sx={{
                [`& .active, &:hover`]: {
                  backgroundColor: "#3070AF",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "#689ee1",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },

                  "&:hover": {
                    backgroundColor: "#3070AF",
                  },
                  margin: 0.2,
                },
                overflow: "hidden",
                borderRadius: 4,
                margin: 0.2,
              }}
              selected={
                location.pathname === "/dashboard/view-workouts" ? true : false
              }
              onClick={() => {
                navigate("/dashboard/view-workouts");
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <History sx={{ marginRight: 1 }} />
              View Workouts
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title="Measurements" placement="right">
            <ListItemButton
              variant="text"
              sx={{
                [`& .active, &:hover`]: {
                  backgroundColor: "#3070AF",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "#689ee1",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },

                  "&:hover": {
                    backgroundColor: "#3070AF",
                  },
                  margin: 0.2,
                },
                overflow: "hidden",
                borderRadius: 4,
                margin: 0.2,
              }}
              selected={
                location.pathname === "/dashboard/measurements" ? true : false
              }
              onClick={() => {
                navigate("/dashboard/measurements");
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <StraightenIcon sx={{ marginRight: 1 }} />
              Measurements
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title="Progress Pictures" placement="right">
            <ListItemButton
              variant="text"
              sx={{
                [`& .active, &:hover`]: {
                  backgroundColor: "#3070AF",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "#689ee1",
                  fontWeight: "bold",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "2px 2px 2px #000f",
                  "& svg": {
                    fill: "#000",
                  },

                  "&:hover": {
                    backgroundColor: "#3070AF",
                  },
                  margin: 0.2,
                },
                overflow: "hidden",
                borderRadius: 4,
                margin: 0.2,
              }}
              selected={
                location.pathname === "/dashboard/progress-pictures"
                  ? true
                  : false
              }
              onClick={() => {
                navigate("/dashboard/progress-pictures");
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <Photo sx={{ marginRight: 1 }} />
              Progress Pictures
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Container
      mt={3}
      maxWidth={false}
      sx={{ minHeight: "100vh", marginRight: 0 }}
    >
      <WorkoutModal modalOpen={modalOpen} setModalOpen={setModalOpen} />

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        PaperProps={{
          sx: {
            bgcolor: "#29282b",
            color: "white",
            padding: 1,
            marginBottom: 1,
            borderRight: "2px inset black",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        PaperProps={{
          sx: {
            bgcolor: "#29282b",
            color: "white",
            padding: 1,
            marginBottom: 1,
            borderRight: "2px inset black",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        alignContent="center"
        justifyContent="center"
        sx={{
          flexGrow: 1,
          display: "flex",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Outlet />
        {/* {page && page} */}
      </Box>
    </Container>
  );
};

export default DashBoard;
