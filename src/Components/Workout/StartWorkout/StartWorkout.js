import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Button, Grid, Tab, Tabs, TextField, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import SearchCustomWorkout from "../SearchCustomWorkout";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";

import AddExerciseForm from "../AddExerciseForm";
import { useNavigate, useBeforeUnload } from "react-router-dom";
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
  deleteSingleNotification,
} from "../../../Api/services";
import ExerciseHistory from "../Modals/ExerciseHistory";
import { useCallback } from "react";
import { useEffect } from "react";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

  //Notify User to save the workout before leaving the page
  useBeforeUnload(
    useCallback((event) => {
      if (startWorkout.length > 0) {
        event.preventDefault();
        event.returnValue = "Are you sure you want to leave?";
      }
    }),
    [startWorkout]
  );

  //change tabs (assigned workouts, created workouts)
  const handleChange = (event, newValue) => {
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
        localStorage.removeItem("startWorkout");

        if (!clientId) {
          // if not being managed by trainer
          addCompletedWorkout(res.data);
          // if workout has been posted then remove localStorage
          console.log("not being managed by trainer ui");
          // check for goalId
          if (manageWorkout?.taskId) {
            // remove from calendar state
            // remove notification
            const notification = activeNotifications.find((n) => {
              return n.activityId === manageWorkout?._id;
            });
            handleDeleteNotification(notification?._id);
            handleCompleteGoal(manageWorkout?.taskId);
          }
          setStatus({ loading: false });
          handleCloseModal();
          navigate("/dashboard/overview");
        } else if (clientId) {
          setOpenSnackbar(true);
        }
      }
    });
  };

  const handleDeleteNotification = async (id) => {
    if (!id) return;

    deleteSingleNotification(axiosPrivate, id).then((res) => {
      if (!res.loading && !res.error) {
        deleteNotification({ _id: id });
      }
    });
  };

  useEffect(() => {
    if (startWorkout[0] && !localStorage.getItem("startWorkout")) {
      localStorage.setItem("startWorkout", JSON.stringify(startWorkout));
    }
  }, [startWorkout]);

  document.title = "GetFit | Start Workout";

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            marginTop: "5rem",
            gap: "1rem",
          }}
        >
          <TextField
            style={{ justifyContent: "center", width: "250px" }}
            type="text"
            size="small"
            defaultValue={startWorkout[0].name}
            label="Workout Name"
            id="WorkoutName"
            variant="outlined"
            fullWidth
          />

          {/* start rendering the workout form of exercises */}
          <RenderExercises
            startWorkout={startWorkout}
            setStartWorkout={setStartWorkout}
            status={status}
            clientId={clientId}
            setStatus={setStatus}
            handleModalHistory={handleModalHistory}
          />

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
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
                marginBottom: "5rem",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setShowAddExercise(true)}
                style={styles.buttons}
              >
                Add Exercise
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                style={styles.buttons}
                onClick={handleOpenModal}
              >
                Complete Workout
              </Button>
            </div>
          )}
        </div>
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
              {loadingAssignedCustomWorkouts &&
              assignedCustomWorkouts?.length === 0 ? (
                <>
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                </>
              ) : (
                <SearchCustomWorkout
                  setStartWorkout={setStartWorkout}
                  startWorkout={startWorkout}
                  workoutType={
                    clientId
                      ? trainerWorkouts?.assignedWorkouts
                      : assignedCustomWorkouts
                  }
                  tabValue={tabValue}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {loadingCustomWorkouts && customWorkouts?.length === 0 ? (
                <>
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                </>
              ) : (
                <SearchCustomWorkout
                  setStartWorkout={setStartWorkout}
                  startWorkout={startWorkout}
                  workoutType={customWorkouts}
                  tabValue={tabValue}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {loadingCompletedWorkouts && completedWorkouts?.length === 0 ? (
                <>
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                  <Skeleton animation="wave" height="6em" width="100%" />
                </>
              ) : (
                <SearchCustomWorkout
                  setStartWorkout={setStartWorkout}
                  startWorkout={startWorkout}
                  workoutType={
                    clientId
                      ? trainerWorkouts?.completedWorkouts
                      : completedWorkouts
                  }
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
    justifyContent: "space-evenly",
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
