import { useEffect, useMemo, useRef, useState } from "react";
import useProfile from "../../hooks/useProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import SearchCustomWorkout from "./SearchCustomWorkout";
import {
  Add,
  Delete,
  DeleteForever,
  DeleteRounded,
  History,
} from "@mui/icons-material";
import Overview from "../Overview";
import IsolatedMenu from "./IsolatedMenu";
import ExerciseHistory from "./Modals/ExerciseHistory";
import SuperSetModal from "./Modals/SuperSetModal";
import RenderSuperSet from "./RenderSuperSet";
import AddExerciseForm from "./AddExerciseForm";
import ContinueWorkout from "./Modals/ContinueWorkout";
import { useNavigate } from "react-router-dom";
import SearchExerciseTab from "./SearchExerciseTab";
import NotificationSnackBar from "../Notifications/SnackbarNotify";
import SaveWorkoutModal from "./Modals/SaveWorkoutModal";
import { set } from "date-fns/esm";

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

function findAllByKey(obj, keyToFind) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === "object"
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc,
    []
  );
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
      ? trainerWorkouts.assignedWorkouts
      : state.assignedCustomWorkouts
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
  const historyButton = useRef(null);

  //change tabs (assigned workouts, created workouts)
  const handleChange = (event, newValue) => {
    if (newValue === 0 && trainerWorkouts?.assignedWorkouts) {
      // check if being managed by trainer
      setWorkoutType(state.assignedCustomWorkouts); // assigned the custom workouts
    } 
     if (trainerWorkouts?.assignedWorkouts && newValue === 0) {
      setWorkoutType(trainerWorkouts.assignedWorkouts);
    } 
    if (newValue === 1) {
      setWorkoutType(state.customWorkouts); // created custom workouts
      //if component is being managed from trainer page, set workouttype (data) to prop
    } 
     if (newValue === 2 && !trainerWorkouts?.completedWorkouts) {
      setWorkoutType(state.completedWorkouts);
    } 
    if (newValue === 2 && trainerWorkouts?.completedWorkouts) {
      setWorkoutType(trainerWorkouts.completedWorkouts);
    }

    setTabValue(newValue);
  };

  const getHistory = async (exerciseId) => {
    const controller = new AbortController();
setStatus(prev => ({...prev, loading: true}));
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
      setStatus(prev => ({...prev, loading: false}));
      handleOpenHistoryModal();
      // reset();
    } catch (err) {
      console.log(err);
      if (err?.response.status === 404) {
        setStatus({
          error: "404",
          message: "No History found",
          loading: false,
          success: false,
        });

        setTimeout(() => {
          setStatus({
            error: false,
            message: "",
            loading: false,
            success: false,
          });
        }, 2000);
      }

      setStatus(prev => ({...prev, loading: false}));
      return () => {
        controller.abort();
      };
    }
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
            {startWorkout[0]?.exercises?.map((e, index) => {
              return Array.isArray(e) ? (
                <RenderSuperSet
                  superSet={e} //this is the nested array of exercises for the superset
                  setFunctionMainArray={setStartWorkout}
                  mainArray={startWorkout} // this is the main state array top level........................
                  inStartWorkout={inStartWorkout}
                  superSetIndex={index} //}
                  getHistory={getHistory}
                  exerciseHistory={exerciseHistory}
                  status={status}
                  clientId={clientId}
                />
              ) : e.type === "cardio" ? ( // going to show a different output for cardio
                <Paper
                  elevation={4}
                  sx={{
                    padding: 2,
                    mt: 1,
                    mb: 1,
                    borderRadius: 10,
                    width: { xs: "100%", sm: "100%", md: "60%" },
                  }}
                  key={e._id}
                >
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      marginBottom: 2,
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography
                        variant="h5"
                        sx={{ color: "#3070af", padding: 2, borderRadius: 5 }}
                      >
                        {e.name}
                      </Typography>
                    </Grid>
                    {e.numOfSets.map((num, idx) => {
                      return (
                        <>
                          <Grid item xs={3} sm={3} key={e._id + 'cardio'} sx={{}}>
                            <TextField
                              type="number"
                              fullWidth
                              name="level"
                              size="small"
                              variant="outlined"
                              label="Level"
                              onChange={(event) => {
                                const updated = JSON.parse(
                                  localStorage.getItem("startWorkout")
                                );
                                updated[0].exercises[index].numOfSets[
                                  idx
                                ].level = event.target.value;
                                localStorage.setItem(
                                  "startWorkout",
                                  JSON.stringify(updated)
                                );
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sm={4}
                            key={e._id + 'cardio time'}
                            
                          >
                            <TextField
                              type="number"
                              fullWidth
                              name="time"
                              size="small"
                              variant="outlined"
                              label="Time"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    Min
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(event) => {
                                const updated = JSON.parse(
                                  localStorage.getItem("startWorkout")
                                );
                                updated[0].exercises[index].numOfSets[
                                  idx
                                ].minutes = event.target.value;
                                localStorage.setItem(
                                  "startWorkout",
                                  JSON.stringify(updated)
                                );
                              }}
                            />
                          </Grid>
                          <Grid item xs={5} sm={4} key={e._id + 'cardio heart rate'}>
                            <TextField
                              fullWidth
                              type="number"
                              variant="outlined"
                              label="Heart Rate"
                              size="small"
                              name="heartRate"
                              InputLabelProps={{ shrink: true, required: true }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    BPM
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(event) => {
                                const updated = JSON.parse(
                                  localStorage.getItem("startWorkout")
                                );
                                updated[0].exercises[index].numOfSets[
                                  idx
                                ].heartRate = event.target.value;
                                localStorage.setItem(
                                  "startWorkout",
                                  JSON.stringify(updated)
                                );
                              }}
                            />
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                </Paper>
              ) : (
                <Paper
                  elevation={4}
                  sx={{
                    padding: 2,
                    mt: 1,
                    mb: 1,
                    borderRadius: 10,
                    width: { xs: "100%", sm: "100%", md: "60%" },
                  }}
                  key={e._id}
                >
                  <form>
                    <Grid
                      container
                      spacing={1}
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{
                        marginBottom: 2,
                        position: "relative",
                      }}
                    >
                      <ExerciseHistory
                        setModalHistory={setModalHistory}
                        modalHistory={modalHistory}
                        exerciseHistory={exerciseHistory}
                        clientId={clientId}
                        status={status}
                      />

                      <Grid item xs={12}>
                        <h3 style={styles.ExerciseTitle}>{e.name}</h3>

                        <IsolatedMenu
                          setFunctionMainArray={setStartWorkout}
                          mainArray={startWorkout}
                          exercise={e}
                          inStartWorkout={inStartWorkout}
                        />
                        <Grid item xs={4} sm={3}>
                          {" "}
                          <TextField
                            size="small"
                            fullWidth
                            select
                            label="Exercise Order"
                            value={index}
                            onChange={(e) => {
                              let _workout = JSON.parse(
                                localStorage.getItem("startWorkout")
                              );
                              const currentExercise =
                                _workout[0].exercises.splice(index, 1)[0];
                              _workout[0].exercises.splice(
                                e.target.value,
                                0,
                                currentExercise
                              );
                              localStorage.setItem(
                                "startWorkout",
                                JSON.stringify(_workout)
                              );
                              setStartWorkout(_workout);
                            }}
                          >
                            {startWorkout[0].exercises.map(
                              (position, posindex) => (
                                <MenuItem key={posindex} value={posindex}>
                                  #{posindex + 1}
                                </MenuItem>
                              )
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      {/* map sets */}
                      {e.numOfSets.map((set, i) => {
                        return (
                          <>
                            <Grid
                              item
                              xs={2}
                              sm={2}
                              key={e._id + index + i + 'set'}
                              sx={{ justifyContent: "flex-start" }}
                            >
                              <TextField
                                type="input"
                                variant="outlined"
                                label="Set"
                                fullWidth
                                name={`Set`}
                                value={i + 1}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6} sm={6} key={e._id + index + i + 'weight'}>
                              <TextField
                                type="input"
                                variant="outlined"
                                label="Weight"
                                fullWidth
                                name="weight"
                                size="small"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      lb
                                    </InputAdornment>
                                  ),
                                }}
                                onChange={(event) => {
                                  //update changes to local storage
                                  const updated = JSON.parse(
                                    localStorage.getItem("startWorkout")
                                  );

                                  updated[0].exercises[index].numOfSets[
                                    i
                                  ].weight = event.target.value;
                                  localStorage.setItem(
                                    "startWorkout",
                                    JSON.stringify(updated)
                                  );
                                }}
                                defaultValue={set.weight}
                              />
                            </Grid>
                            <Grid item xs={3} sm={3} key={e._id + index + i + 'rep'}>
                              <TextField
                                type="text"
                                variant="outlined"
                                label="Reps"
                                fullWidth
                                name="reps"
                                size="small"
                                defaultValue={set.reps}
                                onChange={(event) => {
                                  //update changes to local storage

                                  const updated = JSON.parse(
                                    localStorage.getItem("startWorkout")
                                  );

                                  updated[0].exercises[index].numOfSets[
                                    i
                                  ].reps = event.target.value;
                                  localStorage.setItem(
                                    "startWorkout",
                                    JSON.stringify(updated)
                                  );
                                }}
                              />
                            </Grid>
                            {i >= 1 && (
                              <Grid item xs={1} key={e._id + index + i + 'delete'}>
                                <DeleteForever
                                  onClick={() => {
                                    setStartWorkout((prev) => {
                                      let updated = JSON.parse(
                                        localStorage.getItem("startWorkout")
                                      );
                                      const selectedExercise =
                                        updated[0].exercises[index];

                                      selectedExercise.numOfSets.splice(i, 1);
                                      updated[0].exercises[index] =
                                        selectedExercise;
                                      localStorage.setItem(
                                        "startWorkout",
                                        JSON.stringify(updated)
                                      );

                                      return updated;
                                    });
                                  }}
                                  sx={{ color: "#db4412", cursor: "pointer" }}
                                />
                              </Grid>
                            )}
                          </>
                        );
                      })}

                      <Grid item lg={4} sm={3}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ borderRadius: 10, pr: 1 }}
                          endIcon={<Add />}
                          onClick={() => {
                            //Update Num of sets for exercise
                            //use local state for component to store form data. save button will update global state or just send to backend
                            setStartWorkout((prev) => {
                              const updated = JSON.parse(
                                localStorage.getItem("startWorkout")
                              );
                              updated[0].exercises[index].numOfSets.push({
                                weight: "",
                                reps: "",
                                completed: false,
                              });
                              localStorage.setItem(
                                "startWorkout",
                                JSON.stringify(updated)
                              );
                              return updated;
                            });
                          }}
                        >
                          Set
                        </Button>
                      </Grid>
                      <Grid item lg={4}>
                      {status.loading ? <CircularProgress size={60} sx={{  }} /> :
                        <Button
                        ref={historyButton}
                          size="small"
                          color={"primary"}
                          variant="contained"
                          endIcon={<History />}
                          sx={{ borderRadius: 10 }}
                          onClick={() => {
                            getHistory(e._id);
                              console.log(historyButton.current.classList)
                              historyButton.current.classList.remove("MuiButton-containedPrimary"
                              );
                              historyButton.current.classList.add("MuiButton-containedError");
                         

                          }}
                        >
                       

                            History
                          </Button>}
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              );
            })}
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
  ExerciseTitle: {},
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
