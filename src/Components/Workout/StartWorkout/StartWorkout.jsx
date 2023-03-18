import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Button, Grid, Tab, Tabs, TextField, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import SearchCustomWorkout from "../SearchCustomWorkout";

import AddExerciseForm from "../AddExerciseForm";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import NotificationSnackBar from "../../Notifications/SnackbarNotify";
import SaveWorkoutModal from "../Modals/SaveWorkoutModal";
import RenderExercises from "./RenderExercises";
import { useProfile, useWorkouts } from "../../../Store/Store";
import TabPanel from "../../TabPanel";
import { a11yProps } from "../../TabPanel";
import ExerciseHistory from "../Modals/ExerciseHistory";
import { useCallback } from "react";
import { useEffect } from "react";
import { getSWR, InitialWorkout } from "../../../Api/services";
import useSWR from "swr";

const StartWorkout = ({ trainerWorkouts, trainerManaged }) => {
  const setAssignedCustomWorkouts = useWorkouts(
    (state) => state.setAssignedCustomWorkouts
  );
  const setCompletedWorkouts = useWorkouts(
    (state) => state.setCompletedWorkouts
  );
  const setCustomWorkouts = useWorkouts((state) => state.setCustomWorkouts);
  const manageWorkout = useWorkouts((state) => state.manageWorkout);
  const profile = useProfile((state) => state.profile);
  const handleCompletedWorkout = useProfile(
    (state) => state.handleCompletedWorkout
  );
  const addCompletedWorkout = useWorkouts((state) => state.addCompletedWorkout);
  const deleteCalendarEvent = useProfile((state) => state.deleteCalendarEvent);
  const deleteNotification = useProfile((state) => state.deleteNotification);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const [modalHistory, setModalHistory] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const {
    data: assignedCustomWorkouts,
    isLoading: loadingAssignedCustomWorkouts,
  } = useSWR(
    `/custom-workout/client/assigned/${profile.clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      fallbackData: InitialWorkout,
      onSuccess: (data) => {
        setAssignedCustomWorkouts(data);
      },
    }
  );

  const { data: completedWorkouts, isLoading: loadingCompletedWorkouts } =
    useSWR(
      `/completed-workouts/client/${profile.clientId}`,
      (url) => getSWR(url, axiosPrivate),
      {
        fallbackData: InitialWorkout,
        onSuccess: (data) => {
          setCompletedWorkouts(data);
        },
      }
    );

  const { data: customWorkouts, isLoading: loadingCustomWorkouts } = useSWR(
    `/custom-workout/client/${profile.clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      fallbackData: InitialWorkout,
      onSuccess: (data) => {
        setCustomWorkouts(data);
      },
    }
  );

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

  const completeGoal = async (id) => {
    setStatus({ loading: res.loading, error: res.error });
    const res = await handleCompleteGoal(id);
    deleteCalendarEvent({ _id: id });
    completeGoal(axiosPrivate, id).then((res) => {
      if (!res.loading && !res.error) {
      }
    });
  };

  const handleCompleteWorkout = async (workout) => {
    setStatus({ loading: true, error: false });
    const response = await handleCompletedWorkout(axiosPrivate, workout);

    if (response.error) {
      setStatus({ error: true, message: response.message, loading: false });

      return;
    }
    //remove the current workout from local storage
    localStorage.removeItem("startWorkout");

    if (!trainerManaged) {
      // if not being managed by trainer

      addCompletedWorkout(response);

      if (manageWorkout?.taskId) {
        // remove from calendar state
        // remove notification

        console.log("this needs to be fixed");
        // const notification = activeNotifications.find((n) => {
        //   return n.activityId === manageWorkout?._id;
        // });
        // handleDeleteNotification(notification?._id);
        // handleCompleteGoal(manageWorkout?.taskId);
      }
      setStatus({ loading: false });
      handleCloseModal();
      navigate("/dashboard/overview");
    } else if (trainerManaged) {
      setOpenSnackbar(true);
    }
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
        trainerManaged={trainerManaged}
        onSubmit={handleCompleteWorkout}
        setStartWorkout={setStartWorkout}
        startWorkout={startWorkout}
      />
      <ExerciseHistory
        trainerManaged={trainerManaged}
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
            trainerManaged={trainerManaged}
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

            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="start workout options"
              textColor="primary"
              variant="fullWidth"

            >
              <Tab label="Assigned" {...a11yProps(0)} />
              <Tab label="Created" {...a11yProps(1)} />
              <Tab label="Completed" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              {loadingAssignedCustomWorkouts ? (
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
                    trainerManaged
                      ? trainerWorkouts?.assignedWorkouts
                      : assignedCustomWorkouts
                  }
                  tabValue={tabValue}
                />
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {loadingCustomWorkouts ? (
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
              {loadingCompletedWorkouts ? (
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
                    trainerManaged
                      ? trainerWorkouts?.completedWorkouts
                      : completedWorkouts
                  }
                  tabValue={tabValue}
                />
              )}
            </TabPanel>
          </Grid>
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
