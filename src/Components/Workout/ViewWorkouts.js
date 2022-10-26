import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { DataGrid } from "@mui/x-data-grid/DataGrid";
import {
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Button,
  useTheme,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import useProfile from "../../hooks/useProfile";

import useMediaQuery from "@mui/material/useMediaQuery";

import NoWorkouts from "./NoWorkouts";
import ViewWorkoutModal from "./Modals/ViewWorkoutModal";
import useAxios from "../../hooks/useAxios";
import { axiosPrivate } from "../../hooks/axios";
import DataGridViewWorkouts from "./DataGridViewWorkouts";

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

const ViewWorkouts = ({trainerWorkouts, clientId }) => {
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [workoutType, setWorkoutType] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);

  const [viewWorkout, setViewWorkout] = useState([]);
  const theme = useTheme();
  const { state, dispatch } = useProfile();
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const handleModal = () => setOpen((prev) => !prev);
  const handleChange = (event, tabValue) => {
    if (clientId) {
    
      //being managed so adjust workoutType
      tabValue === 0 ? setWorkoutType(trainerWorkouts?.completedWorkouts) : tabValue === 1 ? setWorkoutType(trainerWorkouts?.assignedWorkouts) :  setWorkoutType(state.customWorkouts) 

    } else {
   
      tabValue === 0 ? setWorkoutType(state.completedWorkouts) : tabValue === 1 ? setWorkoutType(state.assignedCustomWorkouts) :  setWorkoutType(state.customWorkouts) 
    }

    setValue(tabValue);
    setSelectionModel([]);
  };

  const handleView = (event) => {
     
     if (value === 0) { //for tab 0 completedWorkouts
      if (clientId) {
        setViewWorkout(
          trainerWorkouts?.completedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      } else {
        setViewWorkout(
          state.completedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      }

     } else if (value === 1) { //for tab assignedWorkouts
      if (clientId) {
        setViewWorkout(
          trainerWorkouts?.assignedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      } else {
        setViewWorkout(
          state.assignedCustomWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      }

  } else if (value === 2) { //for created workouts
    setViewWorkout(
      state.customWorkouts.filter(
        (w) => w._id === selectionModel[0]
      )
    );

  }
  setSelectionModel([]);
  handleModal();

}
  


  //get assignedCustomWorkouts
  const {
    loading,
    error,
    data: assignedCustomWorkouts,
  } = useAxios({
    url:  `/custom-workout/client/assigned/${state.profile.clientId}`,
    method: "GET",
    type:  "SET_ASSIGNED_CUSTOM_WORKOUTS"
  }
    
  );
  

  const onDelete = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      dispatch({
        type: "DELETE_CUSTOM_WORKOUT",
        payload: response.data,
      });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    document.title = "View Workouts";
    clientId ? setWorkoutType(trainerWorkouts?.completedWorkouts) : setWorkoutType(state?.completedWorkouts);
  }, []);



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
        padding='0'
        marginTop={'4rem'}
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
        <Grid item xs={12} >
          {/* Completed Workouts */}

          <TabPanel value={value} index={0}>
            <h2 className="page-title">Completed Workouts</h2>
             {loading ? <CircularProgress/> : <DataGridViewWorkouts 
              tabValue={value}
              loading={loading} workoutType={workoutType} selectionModel={selectionModel}
              setSelectionModel={setSelectionModel}
              />}
           
          
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          {/* Assigned Workouts */}
          <TabPanel value={value} index={1}>
            <h2 className="page-title">Assigned Workouts</h2>
       
            {loading && <CircularProgress />}
            {loading ? <CircularProgress/> : <DataGridViewWorkouts 
              tabValue={value}
              loading={loading} workoutType={workoutType} selectionModel={selectionModel}
              setSelectionModel={setSelectionModel}
              />}

           
           
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={value} index={2}>
            {/* Created Workouts */}
            <h2 className="page-title">Created Workouts</h2>

            {loading && <CircularProgress />}
            {loading ? <CircularProgress/> :<DataGridViewWorkouts 
              tabValue={value}
              loading={loading} workoutType={workoutType} selectionModel={selectionModel}
              setSelectionModel={setSelectionModel}
              />}

           
           
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
              {value === 2 && selectionModel.length !== 0 &&  <Button
                    sx={{ borderRadius: "10px", mb: 1, ml: 1 }}
                    variant="contained"
                    onClick={() => {
                      onDelete(selectionModel[0]);
                      setSelectionModel([]);
                    }}
                    color="error"
                  >
                    Delete
                  </Button>}
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
