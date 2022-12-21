import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {
  Button,
  LinearProgress,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import SearchCustomWorkout from "../SearchCustomWorkout";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";

import { Add } from "@mui/icons-material";
import AddExerciseForm from "../AddExerciseForm";
import { useNavigate } from "react-router-dom";
import NotificationSnackBar from "../../Notifications/SnackbarNotify";
import SaveWorkoutModal from "../Modals/SaveWorkoutModal";
import RenderExercises from "./RenderExercises";
import { useProfile, useWorkouts } from "../../../Store/Store";
import {
  completeGoal,
  saveCompletedWorkout,
  getAssignedCustomWorkouts,
  getCompletedWorkouts,
  getCustomWorkouts,
} from "../../../Api/services";
import ExerciseHistory from "../Modals/ExerciseHistory";
import { useCallback } from "react";

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

const StartWorkout = ({ trainerWorkouts, clientId }) => {
  const assignedCustomWorkouts = useWorkouts(
    (state) => state.assignedCustomWorkouts
  );

  const manageWorkout = useWorkouts((state) => state.manageWorkout);
  const customWorkouts = useWorkouts((state) => state.customWorkouts);
  const completedWorkouts = useWorkouts((state) => state.completedWorkouts);
  const addCompletedWorkout = useWorkouts((state) => state.addCompletedWorkout);
  const deleteCalendarEvent = useProfile((state) => state.deleteCalendarEvent);
  const deleteNotification = useProfile((state) => state.deleteNotification);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const [modalHistory, setModalHistory] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [
    loadingAssignedCustomWorkouts,
    latestAssignedCustomWorkouts,
    errorAssignedCustomWorkouts,
  ] = useApiCallOnMount(getAssignedCustomWorkouts);
  const [
    loadingCompletedWorkouts,
    latestCompletedWorkouts,
    errorCompletedWorkouts,
  ] = useApiCallOnMount(getCompletedWorkouts);
  const [loadingCustomWorkouts, latestCustomWorkouts, errorCustomWorkouts] =
    useApiCallOnMount(getCustomWorkouts);

  // tabs for the assigned workouts or user created workouts
  const [tabValue, setTabValue] = useState(0);
  //state for chooseing assinged or user created workouts
  const [workoutType, setWorkoutType] = useState([]);
  //Start workout is the main state for the workout being displayed.
  const [startWorkout, setStartWorkout] = useState([]);
  // this is superset state that is unused for now
  //modals state
  const [modalFinishWorkout, setModalFinishWorkout] = useState(false);

  const [showAddExercise, setShowAddExercise] = useState(false);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const [status, setStatus] = useState({
    error: false,
    success: false,
    loading: false,
    message: null,
  });
  const inStartWorkout = true; // used to determine which component is using the add exercise form (says we are using it from startWorkout)

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleOpenModal = () => setModalFinishWorkout(true);
  const handleCloseModal = () => setModalFinishWorkout(false);
  const handleModalHistory = useCallback(() => setModalHistory(true), []);

  //change tabs (assigned workouts, created workouts)
  const handleChange = (event, newValue) => {
    if (newValue === 0 && !trainerWorkouts) {
      // check if being managed by trainer
      setWorkoutType(assignedCustomWorkouts); // assigned custom workouts
    }
    if (trainerWorkouts && newValue === 0) {
      setWorkoutType(trainerWorkouts.assignedWorkouts);
    }
    if (newValue === 1) {
      setWorkoutType(customWorkouts); // created custom workouts
      //if component is being managed from trainer page, set workout type (data) to prop
    }
    if (newValue === 2 && !trainerWorkouts) {
      setWorkoutType(completedWorkouts);
    }
    if (newValue === 2 && trainerWorkouts) {
      setWorkoutType(trainerWorkouts.completedWorkouts);
    }

    setTabValue(newValue);
  };

  const handleCompleteGoal = (id) => {
    completeGoal(axiosPrivate, id).then((res) => {
      setStatus({ loading: res.loading, error: res.error });
      if (!res.loading && !res.error) {
        deleteCalendarEvent({ _id: id });
      }
    });
  };

  const handleSaveCompletedWorkout = (workout) => {
    saveCompletedWorkout(axiosPrivate, workout).then((res) => {
      setStatus({ loading: res.loading, error: res.error });

      if (!res.loading && !res.error) {
        //if not errors and not loading
        // console.log(response.data);

        if (!clientId) {
          // if not being managed by trainer
          addCompletedWorkout(res.data);
          // if workout has been posted then remove localStorage
          localStorage.removeItem("startWorkout");
          // check for goalId
          if (manageWorkout?.taskId) {
            // remove from calendar state
            // remove notification
            const notification = activeNotifications.find((n) => {
              return n.goalId === manageWorkout?.taskId;
            });
            delNotificationApi(notification?._id);
            handleCompleteGoal(manageWorkout?.taskId);
          }

          navigate("/dashboard/overview");
        } else if (clientId) {
          localStorage.removeItem("startWorkout");
          setOpenSnackbar(true);
        }
        setStatus({ loading: false });
        handleCloseModal();
      }
    });
  };

  const delNotificationApi = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/notifications/${id}`, {
        signal: controller.signal,
      });
      deleteNotification({ _id: id });
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    //going to check localStorage for any unfinished workouts if it exists we will ask the user if they want to complete the workout and load it from localStorage into state

    //if startworkout has loaded a workout and nothing exists in localStorage then save to localStorage

    if (startWorkout[0] && !localStorage.getItem("startWorkout")) {
      localStorage.setItem("startWorkout", JSON.stringify(startWorkout));
    }

    document.title = "Start Workout";

    setWorkoutType(
      trainerWorkouts?.length > 0
        ? trainerWorkouts?.assignedWorkouts
        : assignedCustomWorkouts
    );
  }, [
    startWorkout.length,
    trainerWorkouts,
    assignedCustomWorkouts,
    completedWorkouts,
    customWorkouts,
    startWorkout,
  ]);

  return (
    <>
      <SaveWorkoutModal
        modalFinishWorkout={modalFinishWorkout}
        handleCloseModal={handleCloseModal}
        status={status}
        setStatus={setStatus}
        clientId={clientId}
        onSubmit={handleSaveCompletedWorkout}
        setStartWorkout={setStartWorkout}
        startWorkout={startWorkout}
      />
      <ExerciseHistory
        clientId={clientId}
        setModalHistory={setModalHistory}
        modalHistory={modalHistory}
      />
      <NotificationSnackBar
        message={status.message}
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
      />

      {startWorkout?.length > 0 ? (
        <>
          <Grid container sx={{ mb: 5, justifyContent: "center" }}>
            <Grid
              item
              xs={12}
              sm={5}
              sx={{ mt: 10, justifyContent: "center", mb: 3 }}
            >
              <TextField
                style={{ justifyContent: "center" }}
                type="text"
                size="small"
                defaultValue={startWorkout[0].name}
                label="Workout Name"
                id="WorkoutName"
                variant="outlined"
                fullWidth
              />
            </Grid>

            {/* start rendering the workout form of exercises */}
            <RenderExercises
              startWorkout={startWorkout}
              setStartWorkout={setStartWorkout}
              status={status}
              clientId={clientId}
              setStatus={setStatus}
              handleModalHistory={handleModalHistory}
            />
            <Grid
              item
              xs={12}
              sx={{
                textAlign: "center",
                mt: 2,
              }}
            >
              {/* Need to show exercise add form , going to refactor this to use the tabs on add exercise form*/}
              {showAddExercise ? (
                <AddExerciseForm
                  setCheckedExerciseList={setCheckedExerciseList}
                  checkedExerciseList={checkedExerciseList}
                  addExercise={startWorkout}
                  setAddExercise={setStartWorkout}
                  inStartWorkout={inStartWorkout}
                  setShowAddExercise={setShowAddExercise}
                />
              ) : (
                <Grid item xs={12}
                sx={{ display: "flex", justifyContent: "space-evenly", marginBottom: 5 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowAddExercise(true)}
                    style={styles.buttons}
e
                   
                  >
                    Add Exercise
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    style={styles.buttons}
                   

                    onClick={handleOpenModal}
                  >
                    Complete Workout
                  </Button>
                </Grid>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "inherit", justifyContent: "center", mt: 2 }}
            ></Grid>
          </Grid>
        </>
      ) : (
        //datagrid with workouts on different tabs
        <Grid container justifyContent="center" sx={{ mt: 6 }}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <h2 className="page-title">Start Workout</h2>
          </Grid>

          <Box sx={{ width: "100%", padding: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="start workout options"
                textColor="primary"
              >
                <Tab label="Assigned" {...a11yProps(0)} />
                <Tab label="Created" {...a11yProps(1)} />
                <Tab label="Completed" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              {status.loading && workoutType?.length === 0 ? (
                <LinearProgress />
              ) : (
                <SearchCustomWorkout
                  setStartWorkout={setStartWorkout}
                  startWorkout={startWorkout}
                  workoutType={workoutType}
                  tabValue={tabValue}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {status.loading && customWorkouts?.length === 0 ? (
                <LinearProgress />
              ) : (
                <SearchCustomWorkout
                  setStartWorkout={setStartWorkout}
                  startWorkout={startWorkout}
                  workoutType={workoutType}
                  tabValue={tabValue}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {status.loading && completedWorkouts?.length === 0 ? (
                <LinearProgress />
              ) : (
                <SearchCustomWorkout
                  setStartWorkout={setStartWorkout}
                  startWorkout={startWorkout}
                  workoutType={workoutType}
                  tabValue={tabValue}
                />
              )}
            </TabPanel>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default StartWorkout;
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",

  },
  buttonContainer: {
    display: "flex",
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  buttons: {
    borderRadius: 20,
      m: 2,
  },
  modalFinishWorkout: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // minWidth: "50%",
    width: { xs: "90%", sm: "70%", md: "40%" },
    bgcolor: "background.paper",
    border: "2px solid #000",
    // boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",

    gap: 2,
  },

  close: {
    position: "fixed",
    top: 10,
    right: 0,
  },
  h2: {
    textAlign: "center",
    margin: "1px",
    padding: "4px",
    backgroundColor: "#689ee1",
    borderRadius: "20px",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    marginTop: "2rem",
    color: "#fff",
    marginBottom: "1rem",
  },
  h4: {
    textAlign: "center",
    margin: "1px",
    padding: "8px",
    backgroundColor: "#689ee1",
    borderRadius: "20px",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    marginTop: "5rem",
    color: "#fff",
  },
};
