import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  useTheme,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";

import ViewWorkoutModal from "../Modals/ViewWorkoutModal";
import useAxios from "../../../hooks/useAxios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import DataGridViewWorkouts from "./DataGridViewWorkouts";
import { useProfile, useWorkouts } from "../../../Store/Store";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ViewWorkouts = ({ trainerWorkouts, clientId }) => {
  const customWorkouts = useWorkouts((state) => state.customWorkouts);
  const completedWorkouts = useWorkouts((state) => state.completedWorkouts);
  const delCustomWorkout = useWorkouts((state) => state.delCustomWorkout);
  const assignedCustomWorkouts = useWorkouts((state) => state.assignedCustomWorkouts);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [workoutType, setWorkoutType] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [viewWorkout, setViewWorkout] = useState([]);
  const theme = useTheme();
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const handleModal = () => setOpen((prev) => !prev);
  const handleChange = (event, tabValue) => {
    if (clientId) {
      //being managed so adjust workoutType
      tabValue === 0
        ? setWorkoutType(trainerWorkouts?.completedWorkouts)
        : tabValue === 1
        ? setWorkoutType(trainerWorkouts?.assignedWorkouts)
        : setWorkoutType(customWorkouts);
    } else {
      tabValue === 0
        ? setWorkoutType(completedWorkouts)
        : tabValue === 1
        ? setWorkoutType(assignedCustomWorkouts)
        : setWorkoutType(customWorkouts);
    }

    setValue(tabValue);
    setSelectionModel([]);
  };

  const handleView = (event) => {
    if (value === 0) {
      //for tab 0 completedWorkouts
      if (clientId) {
        setViewWorkout(
          trainerWorkouts?.completedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      } else {
        setViewWorkout(
          completedWorkouts.filter((w) => w._id === selectionModel[0])
        );
      }
    } else if (value === 1) {
      //for tab assignedWorkouts
      if (clientId) {
        setViewWorkout(
          trainerWorkouts?.assignedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      } else {
        setViewWorkout(
          assignedCustomWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      }
    } else if (value === 2) {
      //for created workouts
      setViewWorkout(
        customWorkouts.filter((w) => w._id === selectionModel[0])
      );
    }
    setSelectionModel([]);
    handleModal();
  };

 
  const onDelete = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      delCustomWorkout({_id: id});
      setWorkoutType((prev) => prev);
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    document.title = "View Workouts";
    clientId
      ? setWorkoutType(trainerWorkouts?.completedWorkouts)
      : setWorkoutType(completedWorkouts);
  }, []);

console.log(customWorkouts)

  ///need to add notes and info to view modal
  return (
    <>
      <ViewWorkoutModal
        open={open}
        viewWorkout={viewWorkout}
        handleModal={handleModal}
      />

      <Grid
        container
        spacing={0}
        mt={3}
        display="flex"
        justifyContent="center"
        minWidth="100%"
        padding="0"
        marginTop={"4rem"}
      >
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Create Workout tabs"
            variant="fullWidth"
          >
            <Tab label="Completed Workouts" {...a11yProps(0)} />
            <Tab label="Assigned Workouts" {...a11yProps(1)} />
            <Tab label="Created Workouts" {...a11yProps(2)} />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {/* Completed Workouts */}

          <TabPanel value={value} index={0}>
            <h2 className="page-title">Completed Workouts</h2>
           
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={workoutType}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
              />
            
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          {/* Assigned Workouts */}
          <TabPanel value={value} index={1}>
            <h2 className="page-title">Assigned Workouts</h2>

              <DataGridViewWorkouts
                tabValue={value}
             
                workoutType={workoutType}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
              />
         
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={value} index={2}>
            {/* Created Workouts */}
            <h2 className="page-title">Created Workouts</h2>

              <DataGridViewWorkouts
                tabValue={value}
               
                workoutType={workoutType}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
              />
       
          </TabPanel>

          <Grid
            item
            sx={{
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
              mb: 4,
            }}
          >
            {selectionModel.length !== 0 ? (
              <Button
                sx={{ borderRadius: "10px", mb: 1 }}
                variant="contained"
                onClick={handleView}
              >
                View
              </Button>
            ) : (
              <Grid item sx={{ mb: 10 }}>
                {" "}
              </Grid>
            )}
            {value === 2 && selectionModel.length !== 0 && (
              <Button
                sx={{ borderRadius: "10px", mb: 1, ml: 20 }}
                variant="contained"
                onClick={() => {
                  onDelete(selectionModel[0]);
                  setSelectionModel([]);
                }}
                color="error"
              >
                Delete
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #474a48",
    boxShadow: 24,
    p: 4,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  span: {
    fontWeight: "600",
  },
  tableTextLoad: {
    color: "red",
  },
  tableTextReps: {
    color: "blue",
  },
  tableColumns: {
    textDecoration: "underline",
  },
  title: {
    padding: "4px",
    borderRadius: "20px",
    backgroundColor: "#689ee1",
    color: "white",

    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  },
  date: {
    padding: "5px",
    backgroundColor: "#3070af",
    color: "white",
    borderRadius: "10px",
  },
};

export default ViewWorkouts;
