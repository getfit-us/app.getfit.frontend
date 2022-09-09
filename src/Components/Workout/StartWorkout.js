import { useEffect, useMemo, useState } from "react";
import useProfile from "../../utils/useProfile";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import {
  Button,
  Checkbox,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Rating,
  Switch,
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
  MoreVert,
  Remove,
  Save,
  Star,
} from "@mui/icons-material";
import Overview from '../Overview';
import IsolatedMenu from "./IsolatedMenu"
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
const StartWorkout = ({setPage}) => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const [tabValue, setTabValue] = useState(0);
  const [startWorkout, setStartWorkout] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [checked, setChecked] = useState({});
  const [modalFinishWorkout, setModalFinishWorkout] = useState(false);
  const [ratingValue, setRatingValue] = useState(4);
  const [hover, setHover] = useState(-1);
  const handleOpenModal = () => setModalFinishWorkout(true);
  const handleCloseModal = () => setModalFinishWorkout(false);

  const handleChange = (event, newValue) => {
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
      console.log(response.data);
      dispatch({ type: "ADD_COMPLETED_WORKOUT", payload: response.data });
      
      setPage(<Overview />)
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

    document.title = "Start Workout";
  }, [state.customWorkouts]);

  return (
    <>
      {startWorkout?.length > 0 ? (
        <>
          <Grid container sx={{ mb: 5 }}>
            <Grid item xs={12} sx={{ mt: 10, justifyContent: "center" }}>
              <h3 style={{ textAlign: "center" }}> {startWorkout[0]?.name}</h3>
            </Grid>
            <Modal
              open={modalFinishWorkout}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={styles.modal}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ p: 1 }}
                >
                  Do you want to save and finish the Current Workout?
                </Typography>
                <IconButton
                  aria-label="Close"
                  onClick={handleCloseModal}
                  style={styles.close}
                >
                  <Close />
                </IconButton>
                <TextField
                  type="input"
                  multiline
                  minRows={3}
                  name="workoutFeedback"
                  id="workoutFeedback"
                  label="Workout Feedback"
                />
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
                {ratingValue !== null && (
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : ratingValue]}
                  </Box>
                )}
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
                    setStartWorkout((prev) => {
                      const updated = [...prev];
                      const feedback =
                        document.getElementById("workoutFeedback").value;
                      updated[0].feedback = feedback;
                      updated[0].dateCompleted = new Date().toISOString();
                      const split = updated[0].dateCompleted.split("T");
                      updated[0].dateCompleted = split[0];
                      updated[0].rating = ratingValue;
                      //add current user ID
                      updated[0].id = state.profile.clientId;

                      return updated;
                    });

                    onSubmit();
                    // console.log(startWorkout);

                    handleCloseModal();
                  }}
                >
                  Finish Workout
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
              </Box>
            </Modal>

            {startWorkout[0]?.exercises?.map((e, index) => {
              return (
                <Paper
                  elevation={4}
                  sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                  key={Object.keys(e).toString()}
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
                      key={Object.keys(e).toString()}
                    >
                      <Grid item xs={12} key={Object.keys(e).toString()}>
                        <h3>{Object.keys(e)[0].toString()}</h3>
                        <IsolatedMenu
                          e={e}
                          index={index}
                          startWorkout={startWorkout}
                          setStartWorkout={setStartWorkout}
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
                                    name={"weight"}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          lb
                                        </InputAdornment>
                                      ),
                                    }}
                                    defaultValue={s.weight}
                                  />
                                </Grid>
                                <Grid item xs={3} sm={3} key={idx + 6}>
                                  <TextField
                                    type="text"
                                    variant="outlined"
                                    label="Reps"
                                    fullWidth
                                    name="reps"
                                    defaultValue={s.reps}
                                  />
                                </Grid>

                                <Grid item xs={1} key={idx + 3}>
                                  <Tooltip title="completed">
                                    <Checkbox
                                      className={Object?.keys(e)?.toString()}
                                      checked={
                                        checked[
                                          Object?.keys(e)?.toString() + idx
                                        ]
                                          ? (checked[
                                              Object?.keys(e)?.toString() + idx
                                            ] = true)
                                          : (checked[
                                              Object?.keys(e)?.toString() + idx
                                            ] = false)
                                      }
                                      aria-label="Completed"
                                      color="success"
                                      onClick={() => {
                                        setChecked((prev) => {
                                          let updated = { ...prev };
                                          let previousValue =
                                            updated[
                                              Object?.keys(e)?.toString() + idx
                                            ];
                                          updated[
                                            Object?.keys(e)?.toString() + idx
                                          ] = !previousValue;
                                          return updated;
                                        });

                                        setStartWorkout((prev) => {
                                          const updated = [...prev];
                                          ;
                                          updated[0].exercises[index][Object?.keys(e)?.toString()][idx].completed = !checked[Object?.keys(e)?.toString() + idx];
                                          return updated;
                                        })
                                        console.log(startWorkout[0])
                                        //Update State to show completed so when sent to backend we can see this
                                        // const test = [...startWorkout];
                                        // const bool = test[0].exercises[index][Object?.keys(e)?.toString()][idx]?.completed
                                        // test[0].exercises[index][Object?.keys(e)?.toString()][idx].completed = !bool;
                                        // console.log(test[0].exercises[index][Object?.keys(e)?.toString()][idx])
                                      }}
                                      value={
                                        checked[
                                          Object?.keys(e)?.toString() + idx
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
                          // onClick={() => {
                          //   //Update Num of sets for exercise
                          //   //use local state for component to store form data. save button will update global state or just send to backend

                          //   setAddExercise((prev) => {
                          //     const update = [...prev];
                          //     const item = update[index];
                          //     item.numOfSets.push({ weight: "", reps: "" });
                          //     update[index] = {
                          //       ...item,
                          //     };
                          //     return update;
                          //   });
                          // }}
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
                                  Object?.keys(e)?.toString()
                                )
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
                              const updated = [...prev];
                              
                              updated[0].exercises[index][Object?.keys(e)?.toString()].map(set => set.completed = true);
                              return updated;
                            })
                            });
                            // const test = [...startWorkout];
                            // test[0].exercises[index][Object?.keys(e)?.toString()].map(set => set.completed = true)

                            // console.log(test[0].exercises[index][Object?.keys(e)?.toString()])

                           
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
            <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
              <Button variant="contained">Add Exercise</Button>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
              <Button variant="contained" onClick={handleOpenModal}>
                Finish Workout
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid container justifyContent="center" sx={{ mt: 6 }}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <h4 style={{ textAlign: "center" }}>Start Session</h4>
          </Grid>

          <Grid item>
            {" "}
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Start Workout now?"
              />
            </FormGroup>
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
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              Item Two
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
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
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
    top: 0,
    right: 0,
  },
};
