import { useForm } from "react-hook-form";
import { useMemo, useState, useEffect } from "react";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import useProfile from "../utils/useProfile";
import {
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  Paper,
  Checkbox,
  
  FormControlLabel,
  Rating,
  Box,
  Tooltip,
  Fab,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  Add,
  CheckCircle,
  Delete,
  Edit,
  Save,
  Star,
} from "@mui/icons-material";
import Addworkout2 from '../assets/img/Addworkout.png'


const AddWorkoutForm = ({ theme }) => {
  const [dbExercises, setDbExercises] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [ratingValue, setRatingValue] = useState(4);
  const [hover, setHover] = useState(-1);
  const [showCardioLength, setShowCardioLength] = useState(false);
  const [showSets, setShowSets] = useState(true);
  const [rows, setRows] = useState([]);

  const [workoutLog, setWorkoutLog] = useState({
    type: "",
    cardio: "",
    length: "",
    date: "",
    exercises: [],
    rating: ratingValue,
  });
  const [exerciseName, setExerciseName] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const { state, dispatch } = useProfile();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const formValues = getValues();
  const watchv = watch();

  const [NumberFields, setNumberFields] = useState([1, 2, 3, 4]);

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

  const styles = {
    paper: {
      borderRadius: 20,
      marginLeft:'10px',
      elevation: 2,
      // backgroundColor: '#e0e0e0',
      textAlign: "center",
      // display: 'flex',
    },
    container: {
      alignItems: "center",
      justifyContent: "center",
      backgroundImage:  'linear-gradient(90deg, rgba(209,221,224,1) 35%, rgba(83,85,88,1) 100%)',
      borderRadius: 20,

    },
    h4: {
      textAlign: "center",
      margin: "1px",
      padding: "10px",
      backgroundColor: "#689ee1",
      borderRadius: "20px",
      border: "5px solid black",
      boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
   
      
    },
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const controller = new AbortController();
    //get list of exercises
    const getExercise = async () => {
      try {
        const response = await axiosPrivate.get("/exercises", {
          signal: controller.signal,
        });
        isMounted && setDbExercises(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(err);

        //save last page so they return back to page before re auth.
        // navigate('/login', {state: {from: location}, replace: true});
      }
    };

    getExercise();
    return () => {
      isMounted = false;
      setLoading(false);

      controller.abort();
    };
  }, []);

  const onSubmit = async () => {
    let isMounted = true;
    //add logged in user id to data
    workoutLog.id = state.profile.clientId;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/workouts", workoutLog, {
        signal: controller.signal,
      });
      console.log(response.data);
      dispatch({ type: "ADD_WORKOUT", payload: response.data });
      reset();
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;

      controller.abort();
    };
  };

  //form need to be split into multiple forms

  return (
    <>
      <Grid item sx={{ marginTop: 15 }}></Grid>
      <Paper elevation={3} marginTop={20} style={styles.paper}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          
            
          <Grid container spacing={2} style={styles.container}  >
            <Grid item xs={12} sm={6} md={6} mt={8} mb={3} sx={{display: 'flex', justifyContent: 'center'}}>
              <Typography variant="h4" style={styles.h4}>
                New Workout
              </Typography>
            </Grid>

            {showSets ? (
              <>
                <Grid item xs={6} sm={6} sx={{ ml: 1, mr: 1 }}>
                  <TextField
                    {...register("date")}
                    fullWidth
                    InputLabelProps={{ shrink: true, required: true }}
                    type="date"
                    name="date"
                    onChange={(e) => {
                      workoutLog.date = e.target.value;
                    }}
                    label="Workout Date"
                    placeholder=""
                   
                  />
                </Grid>

                <Grid item xs={6} sm={6} sx={{ marginLeft: 1, marginRight: 1 }}>
                  <TextField
                    {...register("WorkoutType")}
                    name="WorkoutType"
                    fullWidth
                    select
                    label="Exercise Type"
                    defaultValue="push"
                  >
                    <MenuItem value="push">Push</MenuItem>
                    <MenuItem value="pull">Pull</MenuItem>
                    <MenuItem value="legs">Legs</MenuItem>
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{ marginLeft: 1, marginRight: 1 }}
                >
                  <TextField
                    {...register(`name`)}
                    name={`name`}
                    placeholder="Exercise"
                    label="Exercise"
                    select
                    fullWidth
                    onChange={(e) => {
                      let date = getValues("date");
                      let type = getValues("WorkoutType");
                      let cardio = getValues("cardio");
                      let length = getValues("length");
                      setExerciseName(e.target.value);

                      workoutLog.exercises.push({ [e.target.value]: {} });
                      setWorkoutLog({
                        ...workoutLog,
                        date: date,
                        type: type,
                        cardio: cardio,
                        length: length,
                      });

                      setShowSets(false);
                    }}
                    defaultValue=""
                  >
                    <MenuItem value="">Choose Exercise.....</MenuItem>
                    {loading && <MenuItem>Loading...</MenuItem>}
                    {error && (
                      <MenuItem>Error could not read exercise list</MenuItem>
                    )}

                    {dbExercises &&
                      dbExercises
                        .filter(
                          (exercise) => exercise.type === formValues.WorkoutType
                        )
                        .map((exercise) => {
                          return (
                            <MenuItem
                              md="5"
                              className="m-4"
                              key={exercise._id}
                              value={exercise.name}
                            >
                              {exercise.name}
                            </MenuItem>
                          );
                        })}
                  </TextField>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sm={4}
                  sx={{
                    justifyContent: "flex-start",
                    display: "flex",
                    marginLeft: 1,
                  }}
                >
                  <FormControlLabel
                    {...register("cardio")}
                    control={<Checkbox />}
                    label="Cardio"
                    onChange={(e) => {
                      workoutLog.cardio = e.target.checked;
                      setShowCardioLength((prev) => !prev);
                    }}
                  />
                </Grid>
                {showCardioLength ? (
                  <Grid item xs={6} sm={6}>
                    <TextField
                      {...register("length")}
                      type="number"
                      label="Cardio Length (Mins)"
                      input
                      onChange={(e) => (workoutLog.length = e.target.value)}
                    />
                  </Grid>
                ) : (
                  ""
                )}

                <Grid item xs={12}>
                  <Typography sx={{ textAlign: "center" }}>
                    Workout Rating
                  </Typography>
                  <Rating
                    name="hover-feedback"
                    value={ratingValue}
                    precision={0.5}
                    getLabelText={getLabelText}
                    onChange={(event, ratingValue) => {
                      setRatingValue(ratingValue);
                      workoutLog.rating = ratingValue;
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
                </Grid>
              </>
            ) : (
              NumberFields.map((num, index) => {
                return (
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    margin={1}
                  >
                    <Grid item xs={4} sm={6} md={2}>
                      <TextField
                        {...register(`set${num}`)}
                        className="form-control"
                        name={`set${num}`}
                        label="Set"
                        placeholder="Set"
                        type="number"
                        defaultValue={num}
                      ></TextField>
                    </Grid>

                    <Grid item xs={4} sm={6} md={3}>
                      <TextField
                        className="form-control"
                        name={`load${num}`}
                        placeholder="Load"
                        type="number"
                        label="Load (lbs)"
                        {...register(`load${num}`)}
                      />
                    </Grid>

                    <Grid item xs={4} sm={6} md={3}>
                      <TextField
                        {...register(`rep${num}`)}
                        className="form-control"
                        name={`rep${num}`}
                        placeholder="Reps"
                        label="Reps"
                        type="number"
                        defaultValue=""
                      ></TextField>
                    </Grid>

                    {/* {(num === (NumberFields.length)) ? <Grid item xs={12}> <Fab onClick={() => setNumberFields(
                                            previousNumberFields =>
                                                [...previousNumberFields, previousNumberFields.length + 1]
                                        )}>
                                            <Add />
                                        </Fab></Grid> : <></>} */}
                  </Grid>
                );
              })
            )}

            {showSets ? (
              <Grid item sx={{ mb: 3 }}>
                {" "}
                <Button
                  onClick={onSubmit}
                  startIcon={<Save />}
                  variant="contained"
                  color="primary"
                >
                  Save Workout
                </Button>
              </Grid>
            ) : (
              <Grid item>
                {" "}
                <Button
                  type="button"
                  startIcon={<Add />}
                  variant="contained"
                  onClick={() => {
                    let set1 = getValues("load1");
                    let rep1 = getValues("rep1");
                    let set2 = getValues("load2");
                    let rep2 = getValues("rep2");
                    let set3 = getValues("load3");
                    let rep3 = getValues("rep3");
                    let set4 = getValues("load4");
                    let rep4 = getValues("rep4");

                    workoutLog.exercises.map((exercise, index) => {
                      //check if object has key equal to exercise string, if so add set data
                      if (exercise.hasOwnProperty(exerciseName)) {
                        workoutLog.exercises[index][`${exerciseName}`]["Set1"] =
                          {
                            load: set1,
                            reps: rep1,
                          };
                        workoutLog.exercises[index][`${exerciseName}`]["Set2"] =
                          {
                            load: set2,
                            reps: rep2,
                          };
                        workoutLog.exercises[index][`${exerciseName}`]["Set3"] =
                          {
                            load: set3,
                            reps: rep3,
                          };
                        workoutLog.exercises[index][`${exerciseName}`]["Set4"] =
                          {
                            load: set4,
                            reps: rep4,
                          };
                      }
                    });

                    setWorkoutLog(workoutLog);
                    setShowSets(true);

                    // //reset form fields for next exercise
                    NumberFields.map((num) => {
                      setValue(`load${num}`, "");
                      setValue(`rep${num}`, "");
                    });
                  }}
                  color="primary"
                >
                  Add Exercise
                </Button>
              </Grid>
            )}
          </Grid>
        </form>

        {workoutLog.exercises[0] && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Exercise</TableCell>
                  <TableCell align="center">Set1</TableCell>
                  <TableCell align="center">Set2</TableCell>
                  <TableCell align="center">Set3</TableCell>
                  <TableCell align="center">Set4</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workoutLog.exercises[0] &&
                  workoutLog.exercises.map((exercise, index) => {
                    let sets = Object.entries(exercise);

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {
                            <Fab
                              color="error"
                              sx={{ align: "start", mr: 2 }}
                              onClick={() => {
                                console.log(workoutLog.exercises[index]);
                                workoutLog.exercises.splice(index);
                                // setRows(newRows)
                              }}
                            >
                              <Delete />
                            </Fab>
                          }{" "}
                          {Object.keys(exercise)}
                        </TableCell>
                        {sets[0][1]["Set1"] && (
                          <>
                            <TableCell align="center">
                              Weight: {sets[0][1]["Set1"]["load"]} (lbs) Reps:{" "}
                              {sets[0][1]["Set1"]["reps"]}{" "}
                            </TableCell>
                            <TableCell align="center">
                              Weight: {sets[0][1]["Set2"]["load"]} (lbs) Reps:{" "}
                              {sets[0][1]["Set2"]["reps"]}
                            </TableCell>
                            <TableCell align="center">
                              Weight: {sets[0][1]["Set3"]["load"]} (lbs) Reps:{" "}
                              {sets[0][1]["Set3"]["reps"]}
                            </TableCell>
                            <TableCell align="center">
                              Weight: {sets[0][1]["Set4"]["load"]} (lbs) Reps:{" "}
                              {sets[0][1]["Set4"]["reps"]}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </>
  );
};



export default AddWorkoutForm;
