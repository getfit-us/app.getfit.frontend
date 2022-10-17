import { useEffect, useMemo, useRef, useState } from "react";
import useProfile from "../../hooks/useProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAxios from "../../hooks/useAxios";
import {
  AlertTitle,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Rating,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import SearchCustomWorkout from "./SearchCustomWorkout";
import {
  Add,
  Close,
  Delete,
  Done,
  History,
  Save,
  Star,
  TextSnippet,
} from "@mui/icons-material";
import Overview from "../Overview";
import IsolatedMenu from "./IsolatedMenu";
import ExerciseHistory from "./ExerciseHistory";
import SuperSetModal from "./SuperSetModal";
import RenderSuperSet from "./RenderSuperSet";
import AddExerciseForm from "./AddExerciseForm";
import ContinueWorkout from "./ContinueWorkout";
import { useNavigate } from "react-router-dom";
import SearchExerciseTab from "./SearchExerciseTab";
import NotificationSnackBar from "../Notifications/SnackbarNotify";

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
function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

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
const StartWorkout = ({ trainerWorkouts, clientId, completedWorkouts }) => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  // tabs for the assigned workouts or user created workouts
  const [tabValue, setTabValue] = useState(0);
  //state for chooseing assinged or user created workouts
  const [workoutType, setWorkoutType] = useState(trainerWorkouts ? trainerWorkouts : state.assignedCustomWorkouts);
  //Start workout is the main state for the workout being displayed.
  const [startWorkout, setStartWorkout] = useState([]);
  // this is superset state that is unused for now
  //modals state
  const [modalFinishWorkout, setModalFinishWorkout] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const [move, setMove] = useState(false);
  const [status, setStatus] = useState({
    error: false,
    success: false,
    loading: false,
    message: null,
  });
  const inStartWorkout = true; // used to determine which component is using the add exercise form (says we are using it from startWorkout)
  const [ratingValue, setRatingValue] = useState(4);
  const [hover, setHover] = useState(-1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleOpenModal = () => setModalFinishWorkout(true);
  const handleCloseModal = () => setModalFinishWorkout(false);
  const handleOpenHistoryModal = () => setModalHistory(true);
  const historyButton = useRef(null);

  //change tabs (assigned workouts, created workouts)
  const handleChange = (event, newValue) => {
    if (newValue === 0 && !trainerWorkouts?.length)
      setWorkoutType(state.assignedCustomWorkouts);
    if (newValue === 1 )
      setWorkoutType(state.customWorkouts);
    //if component is being managed from trainer page, set workouttype (data) to prop
    if (trainerWorkouts?.length && newValue=== 0) setWorkoutType(trainerWorkouts);

    setTabValue(newValue);
  };

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const handleSort = () => {
    //duplicate items
    let _workout = JSON.parse(localStorage.getItem("startWorkout"));
    //remove and save the dragged item content
    const draggedItemContent = _workout[0].exercises.splice(
      dragItem.current,
      1
    )[0];

    //switch the position
    _workout[0].exercises.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    localStorage.setItem("startWorkout", JSON.stringify(_workout));
    setStartWorkout(_workout);
  };

 



  const getHistory = async (exerciseId) => {
    const controller = new AbortController();
    setLoadingHistory(true);
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
      setLoadingHistory(false);
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

      setLoadingHistory(false);
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
      setStatus((prev) => ({ ...prev, loading: false, success: true , message: 'Saved Successfully'}));

      if (!clientId) {
        // console.log(response.data);
        dispatch({ type: "ADD_COMPLETED_WORKOUT", payload: response.data });
        // if workout has been posted then remove localStorage
        localStorage.removeItem("startWorkout");

        navigate("/dashboard/overview");
      } else if (clientId) {
        localStorage.removeItem("startWorkout");
        setOpenSnackbar(true)

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
    <NotificationSnackBar message={status.message} openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} />
      {status.loading && <CircularProgress size={100} sx={{ mt: "5rem" }} />}
      {startWorkout?.length > 0 ? (
        <>
          <Grid container sx={{ mb: 5, justifyContent: "center" }}>
            <Grid item xs={12} sx={{ mt: 10, justifyContent: "center" }}>
              <h3 style={{ textAlign: "center" }}> {startWorkout[0]?.name}</h3>
            </Grid>

            <Modal
              //finish and save Workout modal
              open={modalFinishWorkout}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Grid container sx={styles.modalFinishWorkout}>
                <Grid item xs={12}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ p: 1, textAlign: "center" }}
                  >
                    Save and complete current workout?
                  </Typography>
                  <IconButton
                    aria-label="Close"
                    onClick={handleCloseModal}
                    style={styles.close}
                  >
                    <Close />
                  </IconButton>
                </Grid>
                <Grid item xs={12}>
                  {" "}
                  <TextField
                    type="input"
                    multiline
                    fullWidth
                    minRows={3}
                    name="workoutFeedback"
                    id="workoutFeedback"
                    label="Workout Feedback"
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {status.loading ? (
                    <CircularProgress size={100} color="success" />
                  ) : (
                    <Rating
                      name="hover-feedback"
                      value={ratingValue}
                      precision={0.5}
                      getLabelText={getLabelText}
                      onChange={(event, ratingValue) => {
                        setRatingValue(ratingValue);
                        // workoutLog.rating = ratingValue;
                      }}
                      onChangeActive={(event, newHover) => {
                        setHover(newHover);
                      }}
                      emptyIcon={
                        <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                      }
                    />
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {ratingValue !== null && (
                    <Box sx={{ ml: 2 }}>
                      {labels[hover !== -1 ? hover : ratingValue]}
                    </Box>
                  )}
                </Grid>

                <Button
                  variant="contained"
                  size="medium"
                  endIcon={<Save />}
                  color={status.error ? "error" : "success"}
                  sx={{
                    align: "center",
                    borderRadius: 20,
                    mt: 1,
                    mr: 1,
                    ml: 1,
                  }}
                  onClick={() => {
                    // use localStorage, grab data from localStorage
                    const updated = JSON.parse(
                      localStorage.getItem("startWorkout")
                    );

                    const feedback =
                      document.getElementById("workoutFeedback").value;
                    if (feedback) updated[0].feedback = feedback;

                    updated[0].rating = ratingValue;
                    //add current user ID , check if being managed by trainer
                    if (clientId?.length > 0) updated[0].id = clientId;
                    else updated[0].id = state.profile.clientId;

                    setStartWorkout(updated);
                    localStorage.setItem(
                      "startWorkout",
                      JSON.stringify(updated)
                    );

                    onSubmit(updated[0]);
                  }}
                >
                  {status.error ? "Error Try Again" : "Save"}
                </Button>

                <Button
                  variant="contained"
                  size="medium"
                  color="warning"
                  sx={{ align: "center", borderRadius: 20, mt: 1 }}
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Modal>

            {/* start rendering the workout form of exercises */}
            {startWorkout[0]?.exercises?.map((e, index) => {
              return Array.isArray(e) ? (
                <RenderSuperSet
                  superSet={e} //this is the nested array of exercises for the superset
                  setFunctionMainArray={setStartWorkout}
                  mainArray={startWorkout} // this is the main state array top level........................
                  inStartWorkout={inStartWorkout}
                  superSetIndex={index} //}
                  dragItem={dragItem}
                  dragOverItem={dragOverItem}
                  move={move}
                  setMove={setMove}
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
                  draggable={move}
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                  className={move ? "DragOn" : ""}
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
                      <Typography variant="h5">{e.name}</Typography>
                    </Grid>
                    {e.numOfSets.map((num, idx) => {
                      return (
                        <>
                          <Grid item xs={3} sm={3} key={e._id + idx} sx={{}}>
                            <TextField
                              type="number"
                              fullWidth
                              name="level"
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
                            key={e._id + idx + 3}
                            sx={{}}
                          >
                            <TextField
                              type="number"
                              fullWidth
                              name="time"
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
                          <Grid item xs={5} sm={4} key={e._id + idx + 4}>
                            <TextField
                              fullWidth
                              type="number"
                              variant="outlined"
                              label="Heart Rate"
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
                  draggable={move}
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                  className={move ? "DragOn" : ""}
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
                        loading={loadingHistory}
                      />

                      <Grid item xs={12}>
                        <h3 style={styles.ExerciseTitle}>{e.name}</h3>

                        <IsolatedMenu
                          setFunctionMainArray={setStartWorkout}
                          mainArray={startWorkout}
                          exercise={e}
                          inStartWorkout={inStartWorkout}
                          setMove={setMove} // this
                          move={move}
                        />

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
                          {startWorkout[0].exercises.map((position, posindex) => (
                            <MenuItem key={posindex} value={posindex}>
                              #{posindex +1}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      {/* map sets */}
                      {e.numOfSets.map((set, i) => {
                        return (
                          <>
                            <Grid
                              item
                              xs={3}
                              sm={3}
                              key={e._id + 10 * 4}
                              sx={{ justifyContent: "flex-start" }}
                            >
                              <TextField
                                type="input"
                                variant="outlined"
                                label="Set"
                                fullWidth
                                name={`Set`}
                                value={i + 1}
                              />
                            </Grid>
                            <Grid item xs={4} sm={4} key={e._id + 15 * 4}>
                              <TextField
                                type="input"
                                variant="outlined"
                                label="Weight"
                                fullWidth
                                name="weight"
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
                            <Grid item xs={3} sm={3} key={e._id + 16 * 4}>
                              <TextField
                                type="text"
                                variant="outlined"
                                label="Reps"
                                fullWidth
                                name="reps"
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
                              <Grid item xs={1} key={i + 4 * 4}>
                                <Fab
                                  size="small"
                                  variant="contained"
                                  color="warning"
                                  sx={{ ml: 1 }}
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
                                >
                                  <Delete />
                                </Fab>
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
                        <Button
                          ref={historyButton}
                          size="small"
                          color={status.error === "404" ? "error" : "primary"}
                          variant="contained"
                          endIcon={<History />}
                          sx={{ borderRadius: 10 }}
                          onClick={() => {
                            getHistory(e._id);
                          }}
                        >
                          {status.error === "404"
                            ? "Nothing Found"
                            : "Exercise"}
                        </Button>
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

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Assigned" {...a11yProps(0)} />
                <Tab label="Created" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <SearchCustomWorkout
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
                workoutType={workoutType}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <SearchCustomWorkout
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
                workoutType={workoutType}
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
