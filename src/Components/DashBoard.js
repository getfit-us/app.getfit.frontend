import {
  Container,
  Typography,
  MenuItem,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Divider,
  stepLabelClasses,
  Drawer,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MuiDrawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";

import AddTaskIcon from "@mui/icons-material/AddTask";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StraightenIcon from "@mui/icons-material/Straighten";
import ManageExercise from "../Features/ManageExercise";
import AddWorkout from "../Features/AddWorkouts";
import { useState, useEffect } from "react";
import Users from "./Users";
import useProfile from "../utils/useProfile";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import useMediaQuery from "@mui/material/useMediaQuery";
import Profile from "../Pages/Profile";
import ViewWorkouts from "./ViewWorkouts";
import Measurements from "../Features/Measurements";
import ProgressPics from "./ProgressPics";
import { Photo } from "@mui/icons-material";
import Overview from "./Overview";

const drawerWidth = 200;

const DashBoard = ({ page, setPage, theme, setMobileOpen, mobileOpen }) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [open, setOpen] = useState(true);
  const [onClose, setClose] = useState();

  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(() => {
    //set global state
    //grab workouts
    if (!state.workouts[0]) getWorkouts(state.profile.clientId);
    if (!state.measurements[0]) getAllMeasurements(state.profile.clientId);

    if (lgUp) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [lgUp]);

  const getWorkouts = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/workouts/client/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_WORKOUTS", payload: response.data });
      setLoading(false);
      // console.log(state.workouts)
    } catch (err) {
      console.log(err);
      setError(err);
      //save last page so they return back to page before re auth.
      // navigate('/login', {state: {from: location}, replace: true});
    }
    return () => {
      controller.abort();
    };
  };

  const getAllMeasurements = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/client/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_MEASUREMENTS", payload: response.data });
      setLoading(false);
      // console.log(state.measurements)
    } catch (err) {
      console.log(err);
      setError(err);
      //save last page so they return back to page before re auth.
      // navigate('/login', {state: {from: location}, replace: true});
    }
    return () => {
      controller.abort();
    };
  };

  const drawer = (
    <div>
      <></>
      <Divider sx={{ fontWeight: "bold" }} />

      <List>
        <ListItem disablePadding>
          <Tooltip title="Add Workout" placement="right-start">
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
              selected={page.type.name === "AddWorkoutForm" ? true : false}
              onClick={() => {
                setPage(<AddWorkout theme={theme} />);
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <AddTaskIcon sx={{ marginRight: 1 }} /> Add Workout
            </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem disablePadding>
          {state.profile.roles.includes(10) && (
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
                selected={page.type.name === "ManageExercise" ? true : false}
                onClick={() => {
                  setPage(<ManageExercise theme={theme} />);
                  if (mobileOpen) handleDrawerToggle();
                }}
              >
                <FitnessCenterIcon sx={{ marginRight: 1 }} />
                Manage Exercises
              </ListItemButton>
            </Tooltip>
          )}
        </ListItem>

        <ListItem disablePadding>
          {state.profile.roles.includes(10) && (
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
                selected={page.type.name === "Users" ? true : false}
                variant="text"
                onClick={() => {
                  setPage(<Users theme={theme} />);
                  if (mobileOpen) handleDrawerToggle();
                }}
              >
                <PersonIcon sx={{ marginRight: 1 }} />
                Manage Users
              </ListItemButton>
            </Tooltip>
          )}
        </ListItem>

        <ListItem disablePadding>
          <Tooltip title="Workouts" placement="right">
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
              selected={page.type.name === "ViewWorkouts" ? true : false}
              onClick={() => {
                setPage(<ViewWorkouts theme={theme} />);
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <FitnessCenterIcon sx={{ marginRight: 1 }} />
              Workouts
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
              selected={page.type.name === "Measurements" ? true : false}
              onClick={() => {
                setPage(<Measurements theme={theme} />);
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
              selected={page.type.name === "ProgressPics" ? true : false}
              onClick={() => {
                setPage(<ProgressPics theme={theme} />);
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
    <Container mt={3} sx={{ minHeight: "100vh" }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {" "}
        <>{drawer}</>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
      {/* <Grid
        sx={{
          justifyContent: "center",
          alignItems: "center",

          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth + 1}px `,
          ...(!lgUp && {
            width: `calc(100% - ${50}px)`,
            ml: `${55}px `,
          }),
        }}
      > */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)`, md: `calc(100% - ${drawerWidth}px)`  },
        }}
      >
        {page && page}
      </Box>
    </Container>
  );
};

export default DashBoard;
