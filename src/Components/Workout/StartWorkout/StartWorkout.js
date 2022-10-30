import { useEffect, useState } from "react";
import useProfile from "../../../hooks/useProfile";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Button, Grid, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import SearchCustomWorkout from "../SearchCustomWorkout";
import { Add } from "@mui/icons-material";

import AddExerciseForm from "../AddExerciseForm";
import ContinueWorkout from "../Modals/ContinueWorkout";
import { useNavigate } from "react-router-dom";
import SearchExerciseTab from "../SearchExerciseTab";
import NotificationSnackBar from "../../Notifications/SnackbarNotify";
import SaveWorkoutModal from "../Modals/SaveWorkoutModal";

import RenderExercises from "./RenderExercises";

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
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  // tabs for the assigned workouts or user created workouts
  const [tabValue, setTabValue] = useState(0);
  //state for chooseing assinged or user created workouts
  const [workoutType, setWorkoutType] = useState(
    trainerWorkouts
      ? trainerWorkouts?.assignedWorkouts
      : state?.assignedCustomWorkouts
  );
  //Start workout is the main state for the workout being displayed.
  const [startWorkout, setStartWorkout] = useState([]);
  // this is superset state that is unused for now
  //modals state
  const [modalFinishWorkout, setModalFinishWorkout] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState(null);
  const [modalHistory, setModalHistory] = useState(false);
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
  const handleOpenHistoryModal = () => setModalHistory(true);

  //change tabs (assigned workouts, created workouts)
  const handleChange = (event, newValue) => {
    if (newValue === 0 && !trainerWorkouts) {
      // check if being managed by trainer
      setWorkoutType(state.assignedCustomWorkouts); // assigned custom workouts
    }
    if (trainerWorkouts && newValue === 0) {
      setWorkoutType(trainerWorkouts.assignedWorkouts);
    }
    if (newValue === 1) {
      setWorkoutType(state.customWorkouts); // created custom workouts
      //if component is being managed from trainer page, set workout type (data) to prop
    }
    if (newValue === 2 && !trainerWorkouts) {
      setWorkoutType(state.completedWorkouts);
    }
    if (newValue === 2 && trainerWorkouts) {
      setWorkoutType(trainerWorkouts.completedWorkouts);
    }

    setTabValue(newValue);
  };

  const getHistory = async (exerciseId, buttonId, curInnerHtml) => {
    const currButton = document.getElementById(buttonId);

    const controller = new AbortController();
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axiosPrivate.get(
        `/clients/history/${
          clientId ? clientId : state.profile.clientId
        }/${exerciseId}
        `,
        {
          signal: controller.signal,
        }
      );
      setExerciseHistory(response.data);
      setStatus((prev) => ({ ...prev, loading: false }));
      currButton.innerHTML = curInnerHtml;
      handleOpenHistoryModal();
      // reset();
    } catch (err) {
      console.log(err);
      if (err?.response.status === 404) {
        // if not found display not found on button
        setStatus({
          error: "404",
          message: "No History found",
          loading: false,
          success: false,
        });
        currButton.innerHTML = "Nothing Found";

        setTimeout(() => {
          // reset button after 2sec
          currButton.innerHTML = curInnerHtml;
          setStatus({
            error: false,
            message: "",
            loading: false,
            success: false,
          });
        }, 2000);
      } else {
        //display error please try again
        currButton.innerHTML = "Error Try Again";
        setTimeout(() => {
          // reset button after 2sec
          currButton.innerHTML = curInnerHtml;
          setStatus({
            error: false,
            message: "",
            loading: false,
            success: false,
          });
        }, 2000);
      }

      setStatus((prev) => ({ ...prev, loading: false }));
      return () => {
        controller.abort();
      };
    }
  };

  const handleCompleteGoal = async (id) => {
    console.log(id);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/users/calendar/${id}`, {
        signal: controller.signal,
        withCredentials: true,
      });

      dispatch({
        type: "DELETE_CALENDAR_EVENT",
        payload: id,
      });
      //need to delete from notifications also
      dispatch({ type: "DELETE_NOTIFICATION", payload: {_id: id} });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  //api call to save workout after completion
  const onSubmit = async (data) => {
    let isMounted = true;
    setStatus((prev) => ({ ...prev, loading: true }));
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/completed-workouts", data, {
        signal: controller.signal,
      });
      setStatus((prev) => ({
        ...prev,
        loading: false,
        success: true,
        message: "Saved Successfully",
      }));

      if (!clientId) {
        // console.log(response.data);
        dispatch({ type: "ADD_COMPLETED_WORKOUT", payload: response.data });
        // if workout has been posted then remove localStorage
        localStorage.removeItem("startWorkout");
        //check if workout id matches goal id and mark goal as complete
        let event = state.calendar.filter(
          (event) => event.activityId === data._id
        );
        if (event) {
          console.log("found matching goal", event);
          handleCompleteGoal(event[0]._id);
        }

        navigate("/dashboard/overview");
      } else if (clientId) {
        localStorage.removeItem("startWorkout");
        setOpenSnackbar(true);
      }

      handleCloseModal();

      // reset();
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: true,
        message: err.message,
        success: false,
      }));

      setTimeout(() => {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: false,
          message: "",
          success: false,
        }));
      }, 2000);
    }

    return () => {
      isMounted = false;

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
  }, [startWorkout.length]);

  return (
    <>
      <SaveWorkoutModal
        modalFinishWorkout={modalFinishWorkout}
        handleCloseModal={handleCloseModal}
        status={status}
        clientId={clientId}
        onSubmit={onSubmit}
        setStartWorkout={setStartWorkout}
      />
      <NotificationSnackBar
        message={status.message}
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
      />

      {startWorkout?.length > 0 ? (
        <>
          <Grid container sx={{ mb: 5, justifyContent: "center" }}>
            <Grid item xs={12} sm={5} sx={{ mt: 10, justifyContent: "center" }}>
              <TextField
                style={{ justifyContent: "center" }}
                type="text"
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
              getHistory={getHistory}
              status={status}
              clientId={clientId}
              setModalHistory={setModalHistory}
              modalHistory={modalHistory}
              exerciseHistory={exerciseHistory}
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
                <Button
                  variant="contained"
                  onClick={() => setShowAddExercise(true)}
                  startIcon={<Add />}
                >
                  Add Exercise
                </Button>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "inherit", justifyContent: "center", mt: 2 }}
            >
              <Button variant="contained" onClick={handleOpenModal}>
                Complete Workout
              </Button>
            </Grid>
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
              <SearchCustomWorkout
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
                workoutType={workoutType}
                tabValue={tabValue}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <SearchCustomWorkout
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
                workoutType={workoutType}
                tabValue={tabValue}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <SearchCustomWorkout
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
                workoutType={workoutType}
                tabValue={tabValue}
              />
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
  buttonExercise: {
    borderRadius: "10px",
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
