import { useEffect, useMemo, useState } from "react";
import useProfile from "../../hooks/useProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
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
  Done,
  History,
  Save,
  Star,
  TextSnippet,
} from "@mui/icons-material";
import Overview from "../Overview";
import IsolatedMenu from "./IsolatedMenuStartWorkout";
import ExerciseHistory from "./ExerciseHistory";
import SuperSetModal from "./SuperSetModal";
import RenderSuperSet from "./RenderSuperSet";
import AddExerciseForm from "./AddExerciseForm";
import ContinueWorkout from "./ContinueWorkout";


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
const StartWorkout = ({ setPage }) => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  // tabs for the assigned workouts or user created workouts
  const [tabValue, setTabValue] = useState(0);
  //state for chooseing assinged or user created workouts
  const [workoutType, setWorkoutType] = useState(state.assignedCustomWorkouts);
  //Start workout is the main state for the workout being displayed.
  const [startWorkout, setStartWorkout] = useState([]);
  // this is superset state that is unused for now
  const [superSet, setSuperSet] = useState({});
  const [numOfSuperSets, setNumOfSuperSets] = useState(0);
  const [checked, setChecked] = useState({});
  //modals state
  const [modalFinishWorkout, setModalFinishWorkout] = useState(false);
  const [modalHistory, setModalHistory] = useState(false);

  const [exerciseHistory, setExerciseHistory] = useState({});
  const [currentExercise, setCurrentExercise] = useState("");
  const [addExercise, setAddExercise] = useState([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const inStartWorkout = true;
  const [ratingValue, setRatingValue] = useState(4);
  const [hover, setHover] = useState(-1);
  const handleOpenModal = () => setModalFinishWorkout(true);
  const handleCloseModal = () => setModalFinishWorkout(false);
  const handleOpenHistoryModal = () => setModalHistory(true);
  const handleCloseHistoryModal = () => setModalHistory(false);

  const handleChange = (event, newValue) => {
    if (newValue === 0) setWorkoutType(state.assignedCustomWorkouts);
    if (newValue === 1) setWorkoutType(state.customWorkouts);

    setTabValue(newValue);
  };

  const onSubmit = async () => {
    let isMounted = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post(
        "/completed-workouts",
        startWorkout[0],
        {
          signal: controller.signal,
        }
      );
      dispatch({ type: "ADD_COMPLETED_WORKOUT", payload: response.data });
      // if workout has been posted then remove localStorage
      localStorage.removeItem("startWorkout");
      setPage(<Overview />);
      // reset();
    } catch (err) {
      console.log(err);
      if (err.response.status === 409) {
        // setSaveError((prev) => !prev);
        // setTimeout(() => setSaveError((prev) => !prev), 5000);
      }
    }
    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  useEffect(() => {
    //grab customWorkouts assigned to user/ client
    const getCustomWorkouts = async () => {
      let isMounted = true;
      //add logged in user id to data and workout name
      //   values.id = state.profile.clientId;

      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/custom-workout/client/${state.profile.clientId}`,
          {
            signal: controller.signal,
          }
        );
        dispatch({ type: "SET_CUSTOM_WORKOUTS", payload: response.data });

        // reset();
      } catch (err) {
        console.log(err);
        if (err.response.status === 409) {
          //     setSaveError((prev) => !prev);
          //     setTimeout(() => setSaveError((prev) => !prev), 5000);
          //   }
        }
        return () => {
          isMounted = false;

          controller.abort();
        };
      }
    };

    if (state.customWorkouts.length === 0) {
      getCustomWorkouts();
    }

    //going to check localStorage for any unfinished workouts if it exists we will ask the user if they want to complete the workout and load it from localStorage into state

    // const workoutLocalStorage = localStorage.getItem('startWorkout')
    // if (workoutLocalStorage) {
    //   //ask user if they want to complete the workout
    // const savedStartWorkout = JSON?.parse(workoutLocalStorage);
    //   console.log(savedStartWorkout);

    // }

    //if startworkout has loaded a workout and nothing exists in localStorage then save to localStorage
    if (startWorkout[0] && !localStorage.getItem("startWorkout")) {
      localStorage.setItem("startWorkout", JSON.stringify(startWorkout));
     
    }

    document.title = "Start Workout";
  }, [startWorkout]);

  //going to refactor to use localstorage for changes and then load from localStorage into state and save to mongodb -- done!
  return (
    <>
      {startWorkout?.length > 0 ? (
        <>
          <Grid container sx={{ mb: 5 }}>
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
                  {" "}
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
                    updated[0].feedback = feedback;
                    updated[0].dateCompleted = new Date().toISOString();
                    const split = updated[0].dateCompleted.split("T");
                    updated[0].dateCompleted = split[0];
                    updated[0].rating = ratingValue;
                    //add current user ID
                    updated[0].id = state.profile.clientId;
                    setStartWorkout(updated);

                    // setStartWorkout((prev) => {
                    //   const updated = [...prev];
                    //   const feedback =
                    //     document.getElementById("workoutFeedback").value;
                    //   updated[0].feedback = feedback;
                    //   updated[0].dateCompleted = new Date().toISOString();
                    //   const split = updated[0].dateCompleted.split("T");
                    //   updated[0].dateCompleted = split[0];
                    //   updated[0].rating = ratingValue;
                    //   //add current user ID
                    //   updated[0].id = state.profile.clientId;

                    //   return updated;
                    // });

                    onSubmit();

                    handleCloseModal();
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  color="warning"
                  sx={{ align: "center", borderRadius: 20, mt: 1 }}
                  onClick={() => {
                    //   const updated = [...startWorkout]
                    //   const notes = document.getElementById(Object.keys(e).toString()).value;
                    //   updated[0].exercises[index].notes = notes;
                    //   console.log(startWorkout, startWorkout[0].exercises[index])

                    handleCloseModal();
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Modal>
            <Dialog
              //Show Exercise History
              open={modalHistory}
              onClose={handleCloseHistoryModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              scroll="paper"
            >
              <Grid container>
                <Grid item xs={12} sx={{ position: "relative" }}>
                  {" "}
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ p: 1 }}
                  >
                    Exercise History
                  </Typography>
                  <IconButton
                    aria-label="Close"
                    onClick={handleCloseHistoryModal}
                    style={styles.close}
                  >
                    <Close />
                  </IconButton>
                </Grid>

                {/* loop over history state array and return Drop down Select With Dates */}
                <DialogContent >
                  <ExerciseHistory
                    exerciseHistory={exerciseHistory}
                    currentExercise={currentExercise}
                  />
                </DialogContent>
                <Grid item xs={12} sx={{ mb: 1, mt: 1, textAlign: "center" }}>
                  {" "}
                  <Button
                    variant="contained"
                    size="medium"
                    color="warning"
                    sx={{ borderRadius: 20, mt: 1 }}
                    onClick={() => {
                      handleCloseHistoryModal();
                    }}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </Dialog>

            {/* start rendering the workout form of exercises */}
            {startWorkout[0]?.exercises?.map((e, index) => {
              return (
                <Paper
                  elevation={4}
                  sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                  key={Object.keys(e).toString() + index}
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
                      <Grid item xs={12}>
                        <h3 style={styles.ExerciseTitle}>
                          {Object.keys(e)[0].toString()}
                        </h3>

                        <IsolatedMenu
                          e={e}
                          index={index}
                          startWorkout={startWorkout}
                          setStartWorkout={setStartWorkout}
                          setSuperSet={setSuperSet}
                          superSet={superSet}
                          numOfSuperSets={numOfSuperSets}
                          setNumOfSuperSets={setNumOfSuperSets}
                        />
                      </Grid>
                      {/* map sets */}
                      {Object.entries(e).map((set) => {
                        if (set[0] !== "notes")
                          return set[1].map((s, idx) => {
                            return (
                              <>
                                <Grid
                                  item
                                  xs={3}
                                  sm={3}
                                  key={idx + 2}
                                  sx={{ justifyContent: "flex-start" }}
                                >
                                  <TextField
                                    type="input"
                                    variant="outlined"
                                    label="Set"
                                    fullWidth
                                    name={`Set`}
                                    value={idx + 1}
                                  />
                                </Grid>
                                <Grid item xs={4} sm={4} key={idx + 5}>
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

                                      updated[0].exercises[index][
                                        Object?.keys(e)[0]?.toString()
                                      ][idx].weight = event.target.value;
                                      localStorage.setItem(
                                        "startWorkout",
                                        JSON.stringify(updated)
                                      );

                                      // this was old way used to update state----------------------------------------------------------------

                                      // if (
                                      //   startWorkout[0].exercises[index][
                                      //     Object?.keys(e)[0]?.toString()
                                      //   ][idx].completed
                                      // ) {
                                      //   setStartWorkout((prev) => {
                                      //     //set items completed and log weight and reps to state
                                      //     const updated = [...prev];

                                      //     updated[0].exercises[index][
                                      //       Object?.keys(e)[0]?.toString()
                                      //     ][idx].weight = event.target.value;

                                      //     return prev;
                                      //   });
                                      //     //on change save workout to local storage
                                      //   localStorage.setItem('startWorkout', JSON.stringify(startWorkout));

                                      // }
                                    }}
                                    defaultValue={s.weight}
                                    id={`${
                                      Object?.keys(e)?.toString() + idx
                                    }weight`}
                                  />
                                </Grid>
                                <Grid item xs={3} sm={3} key={idx + 6}>
                                  <TextField
                                    type="text"
                                    variant="outlined"
                                    label="Reps"
                                    fullWidth
                                    name="reps"
                                    id={`${
                                      Object?.keys(e)?.toString() + idx
                                    }reps`}
                                    defaultValue={s.reps}
                                    onChange={(event) => {
                                      //update changes to local storage

                                      const updated = JSON.parse(
                                        localStorage.getItem("startWorkout")
                                      );

                                      updated[0].exercises[index][
                                        Object?.keys(e)[0]?.toString()
                                      ][idx].reps = event.target.value;
                                      localStorage.setItem(
                                        "startWorkout",
                                        JSON.stringify(updated)
                                      );

                                      // this was old way used to update state----------------------------------------------------------------

                                      // //if value changes uncheck box
                                      // if (
                                      //   startWorkout[0].exercises[index][
                                      //     Object?.keys(e)[0]?.toString()
                                      //   ][idx].completed
                                      // ) {
                                      //   setStartWorkout((prev) => {
                                      //     //set items completed and log weight and reps to state
                                      //     const updated = [...prev];

                                      //     updated[0].exercises[index][
                                      //       Object?.keys(e)[0]?.toString()
                                      //     ][idx].reps = event.target.value;

                                      //     return prev;
                                      //   });
                                      //      //Update state
                                      // localStorage.setItem('startWorkout', JSON.stringify(startWorkout));
                                      // }
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={1} key={idx + 3}>
                                  <Tooltip title="completed">
                                    <Checkbox
                                      checked={
                                        checked[
                                          Object?.keys(e)[0]?.toString() + idx
                                        ]
                                          ? (checked[
                                              Object?.keys(e)[0]?.toString() +
                                                idx
                                            ] = true)
                                          : (checked[
                                              Object?.keys(e)[0]?.toString() +
                                                idx
                                            ] = false)
                                      }
                                      aria-label="Completed"
                                      color="success"
                                      onClick={() => {
                                        setChecked((prev) => {
                                          let updated = { ...prev };
                                          let previousValue =
                                            updated[
                                              Object?.keys(e)[0]?.toString() +
                                                idx
                                            ];
                                          updated[
                                            Object?.keys(e)[0]?.toString() + idx
                                          ] = !previousValue;

                                          return updated;
                                        });

                                        setStartWorkout((prev) => {
                                          //set items completed and log weight and reps to state
                                          const updated = [...prev];
                                          const weight =
                                            document.getElementById(
                                              `${
                                                Object?.keys(e)?.toString() +
                                                idx
                                              }weight`
                                            ).value;
                                          const reps = document.getElementById(
                                            `${
                                              Object?.keys(e)?.toString() + idx
                                            }reps`
                                          ).value;

                                          updated[0].exercises[index][
                                            Object?.keys(e)[0]?.toString()
                                          ][idx].completed =
                                            !checked[
                                              Object?.keys(e)[0]?.toString() +
                                                idx
                                            ];
                                          //if check is true (checked) then save value
                                          if (
                                            updated[0].exercises[index][
                                              Object?.keys(e)[0]?.toString()
                                            ][idx].completed
                                          ) {
                                            updated[0].exercises[index][
                                              Object?.keys(e)[0]?.toString()
                                            ][idx].weight = weight;
                                            updated[0].exercises[index][
                                              Object?.keys(e)[0]?.toString()
                                            ][idx].reps = reps;
                                          }

                                          return updated;
                                        });
                                      }}
                                      value={
                                        checked[
                                          Object?.keys(e)[0]?.toString() + idx
                                        ]
                                      }
                                    />
                                  </Tooltip>
                                </Grid>
                              </>
                            );
                          });
                      })}
                      <Grid item lg={4}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ borderRadius: 10, pr: 1 }}
                          endIcon={<Add />}
                          onClick={() => {
                            //Update Num of sets for exercise
                            //use local state for component to store form data. save button will update global state or just send to backend
                            setStartWorkout((prev) => {
                              const updated = [...prev];
                              updated[0].exercises[index][
                                Object?.keys(e)[0]?.toString()
                              ].push({
                                weight: "",
                                reps: "",
                                completed: false,
                              });
                              return updated;
                            });
                          }}
                        >
                          Set
                        </Button>
                      </Grid>
                      <Grid item lg={4}>
                        <Button
                          size="small"
                          variant="contained"
                          endIcon={<History />}
                          sx={{ borderRadius: 10 }}
                          onClick={() => {
                            //need to grab all the exercise history from user and display dates in small table modal.
                            // console.log(state.completedWorkouts)

                            const test = [...state.completedWorkouts];

                            //Check if already grabbed exercise history in state to save memory and eliminate duplicates
                            if (!exerciseHistory[Object?.keys(e)?.toString()]) {
                              test.map((finishedWorkouts, index) => {
                                //search for exercise, if found grab data and DateCompleted
                                //grab index of map loop to get dateCompleted
                                //logic is flawed... need to check for duplicate dates

                                finishedWorkouts.exercises.filter(
                                  (exercise, i, arr) => {
                                    // console.log(`clicked exercise: ${Object?.keys(e)[0]?.toString()} current exercise: ${Object.keys(exercise)[0].toString()}`)
                                    // find out if exercise is the same as current on button selected
                                    if (
                                      Object.keys(exercise)[0].toString() ===
                                      Object?.keys(e)[0]?.toString()
                                    ) {
                                      //if it is same exercise then look for dateCompleted
                                      if (
                                        arr[i][
                                          Object.keys(exercise)[0].toString()
                                        ].findIndex(
                                          (cur) => cur.dateCompleted
                                        ) === -1
                                      ) {
                                        // if we do NOT find the date we are pushing it to end of the array
                                        arr[i][
                                          Object.keys(exercise)[0].toString()
                                        ].push({
                                          dateCompleted:
                                            finishedWorkouts.dateCompleted,
                                        });
                                        //add to history array
                                      }

                                      //testing
                                      //2 workouts loops through twice..

                                      setExerciseHistory((prev) => {
                                        const updated = { ...prev };
                                        // if object with exercise name already exists then we are pushing array
                                        if (
                                          updated[
                                            Object.keys(exercise)[0].toString()
                                          ]
                                        ) {
                                          //check if current state already has this array
                                          let dateIndexOfArray = arr[i][
                                            Object.keys(exercise)[0].toString()
                                          ].findIndex(
                                            (cur) => cur.dateCompleted
                                          );
                                          //Loop through current array and get dates to compare for duplicate
                                          let dates = updated[
                                            Object.keys(exercise)[0].toString()
                                          ].map((set) => {
                                            return findAllByKey(
                                              set,
                                              "dateCompleted"
                                            );
                                          });
                                          //convert date array to strings and see if current date already exists inside the string

                                          //if date already exists then do not push it ..
                                          if (
                                            !dates
                                              .toString()
                                              .includes(
                                                arr[i][
                                                  Object.keys(
                                                    exercise
                                                  )[0].toString()
                                                ][dateIndexOfArray]
                                                  .dateCompleted
                                              )
                                          ) {
                                            updated[
                                              Object.keys(
                                                exercise
                                              )[0].toString()
                                            ].push(
                                              arr[i][
                                                Object.keys(
                                                  exercise
                                                )[0].toString()
                                              ]
                                            );
                                          }
                                        } else {
                                          updated[
                                            Object.keys(exercise)[0].toString()
                                          ] = [];
                                          updated[
                                            Object.keys(exercise)[0].toString()
                                          ].push(
                                            arr[i][
                                              Object.keys(
                                                exercise
                                              )[0].toString()
                                            ]
                                          );
                                        }

                                        return updated;
                                      });

                                      return true;
                                    }
                                  }
                                );
                              });
                            }
                            //set current exercise state to handle modal

                            setCurrentExercise(Object?.keys(e)[0]?.toString());
                            handleOpenHistoryModal();
                          }}
                        >
                          {" "}
                          Exercise
                        </Button>
                      </Grid>
                      <Grid item lg={4}>
                        {" "}
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<Done />}
                          sx={{ borderRadius: 10 }}
                          onClick={() => {
                            Object.entries(checked).map((checkboxSet, idx) => {
                              //find corresponding checkbox that match exercisename and set to  true

                              if (
                                checkboxSet[0].includes(
                                  Object?.keys(e)[0]?.toString()
                                ) &&
                                !checkboxSet[0].includes("note")
                              ) {
                                setChecked((prev) => {
                                  let updated = { ...prev };
                                  let previousValue = updated[checkboxSet[0]];
                                  updated[checkboxSet[0]] = true;
                                  return updated;
                                });
                              }
                              setStartWorkout((prev) => {
                                //loop through sets and set completed to true
                                //add input values to state
                                const updated = [...prev];

                                updated[0].exercises[index][
                                  Object?.keys(e)[0]?.toString()
                                ].map((set, idx) => {
                                  //get input values for current set
                                  const weight = document.getElementById(
                                    `${Object?.keys(e)?.toString() + idx}weight`
                                  ).value;
                                  const reps = document.getElementById(
                                    `${Object?.keys(e)?.toString() + idx}reps`
                                  ).value;
                                  //update state
                                  updated[0].exercises[index][
                                    Object?.keys(e)[0]?.toString()
                                  ][idx].weight = weight;
                                  updated[0].exercises[index][
                                    Object?.keys(e)[0]?.toString()
                                  ][idx].reps = reps;
                                  set.completed = true;
                                });
                                return updated;
                              });
                            });
                          }}
                        >
                          {" "}
                          Completed
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
                  Exercise
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
            <h2 style={styles.h2}>Start Workout</h2>
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
  modalHistory: {
    position: "absolute",
    top: "50%",
    left: "50%",

    height: "80%",

    width: { xs: "90%", sm: "70%", md: "40%" },
    transform: "translate(-50%, -50%)",

    bgcolor: "background.paper",
    border: "2px solid #000",
    // boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
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
