import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  Drawer,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import AddTaskIcon from "@mui/icons-material/AddTask";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import StraightenIcon from "@mui/icons-material/Straighten";
import ManageExercise from "../Components/Exercise/ManageExercise";
import { useState, useEffect } from "react";
import Users from "../Components/Users/Users";
import useProfile from "../hooks/useProfile";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useMediaQuery from "@mui/material/useMediaQuery";
import ViewWorkouts from "./Workout/ViewWorkouts";
import Measurements from "../Components/Measurements/Measurements";
import ProgressPics from "../Components/Measurements/ProgressPics";
import { Photo, Whatshot } from "@mui/icons-material";
import Overview from "./Overview";
import WorkoutModal from "./Workout/WorkoutModal";
import CreateWorkout from "./Workout/CreateWorkout";
import StartWorkout from "./Workout/StartWorkout";
// need to change the way we handle the routes, need to control when a user decides to leave a page and use modal

const DashBoard = ({
  page,
  setPage,
  theme,
  setMobileOpen,
  mobileOpen,
  loadingApi,
  setLoadingApi,
  err,
  setError,
}) => {
  const [open, setOpen] = useState(true);
  const [onClose, setClose] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [leavePage, setLeavePage] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState();

  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawerWidth = 200;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(() => {
    // if newWorkoutName is not false
    if (newWorkoutName && page.type.name !== "CreateWorkout") {
      setPage(
        <CreateWorkout
          newWorkoutName={newWorkoutName}
          setPage={setPage}
        />
      );
    }
  }, [newWorkoutName]);

  const drawer = (
    <div>
      <List>
        <ListItem
          button
          onClick={() => {
            setPage(<Overview loadingApi={loadingApi} />);
            if (mobileOpen) handleDrawerToggle();
          }}
          sx={{
            border: "2px solid white",
            borderRadius: "10px",
            justifyContent: "center",
            padding: 3,
            display: "flex",
            flexDirection: "column",
            marginBottom: 1,
          }}
        >
          <p>DASHBOARD</p>

          <Typography variant="p" sx={{ display: "block" }}>
            {state.profile.roles.includes(10) && "ADMIN"}
            {state.profile.roles.includes(2) && `CLIENT`}
            {state.profile.roles.includes(5) && `TRAINER`}
          </Typography>
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
              onClick={() => {
                //need to check if already on page and do something
                if (page.type.name === "CreateWorkout") {
                  setLeavePage(true);
                } else {
                  setModalOpen((prev) => !prev);
                }
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <Whatshot sx={{ marginRight: 1 }} /> Create Workout
            </ListItemButton>
          </Tooltip>
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
              onClick={() => {
                //need to check if already on page and do something

                setPage(<StartWorkout theme={theme} setPage={setPage} />);
                if (mobileOpen) handleDrawerToggle();
              }}
            >
              <Whatshot sx={{ marginRight: 1 }} /> Start Workout
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
              // selected={page?.type.name === "ViewWorkouts" ? true : false}
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
    <Container mt={3}  maxWidth={false} sx={{ minHeight: "100vh", backgroundColor: "#f2f4f7" , marginRight:0}}>
      <WorkoutModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setNewWorkoutName={setNewWorkoutName}
      />

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
        {page && page}
      </Box>
    </Container>
  );
};

export default DashBoard;
