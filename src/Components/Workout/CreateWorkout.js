import {
  Button,
  Fab,
  Grid,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

import { useState, useEffect } from "react";
import AddExerciseForm from "./AddExerciseForm";
import useProfile from "../../hooks/useProfile";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import IsolatedMenuCreateWorkout from "./IsolatedMenuCreateWorkout";
import Overview from "../Overview";

const CreateWorkout = ({ newWorkoutName, setPage }) => {
  //need to ask if you want to save or leave page for new workout

  const { state, dispatch } = useProfile();
  const [showTabs, setShowTabs] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [addExercise, setAddExercise] = useState([]);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);

  const { register, unregister, getValues } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const axiosPrivate = useAxiosPrivate();

  //---------------------------use effect to api call used exercises
  useEffect(() => {
    const ApiCallUsedExercises = async () => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/exercises/UsedExercise/${state.profile.clientId}`,
          {
            signal: controller.signal,
          }
        );
        console.log(response.data);
        dispatch({ type: "SET_USED_EXERCISES", payload: response.data });

        // reset();
      } catch (err) {
        console.log(err);
      }
      return () => {
        controller.abort();
      };
    };

    if (state.usedExercises?.length === 0) {
      //-------no state for used exercises then make api call
      ApiCallUsedExercises();
    }
  }, []);
  // ----------------------api call to save recently used exercises
  const addRecentlyUsedExercises = async () => {
    const controller = new AbortController();
    let data = {};
    //add user id
    data.id = state.profile.clientId;
    data.exercises = [...addExercise];

    console.log(data)

    try {
      const response = await axiosPrivate.post(
        `/exercises/UsedExercise`,
        data,
        {
          signal: controller.signal,
        }
      );
      console.log(response.data);
      dispatch({ type: "ADD_USED_EXERCISE", payload: response.data });

      // reset();
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  // -------------------api call to save workout--
  const onSubmit = async (values) => {
    let isMounted = true;
    //add logged in user id to data and workout name
    values.id = state.profile.clientId;
    values.name = newWorkoutName;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/custom-workout", values, {
        signal: controller.signal,
      });
      console.log(response.data);
      dispatch({ type: "ADD_CUSTOM_WORKOUT", payload: response.data });
      // need to setpage to overview after
      setPage(<Overview />);

      // reset();
    } catch (err) {
      console.log(err);
      if (err.response.status === 409) {
        setSaveError((prev) => !prev);
        setTimeout(() => setSaveError((prev) => !prev), 5000);
      }
    }
    return () => {
      isMounted = false;

      controller.abort();
    };
  };

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
      boxShadow: 24,
      p: 4,
    },
    close: {
      position: "fixed",
      top: 0,
      right: 0,
    },
    header: {
      display: "flex",
      justifyContent: "center",
    },
  };

  document.title = `Create Workout - ${newWorkoutName}`;

 

  return (
    <Grid container style={styles.container} sx={{ marginTop: 10 }}>
      <Grid item xs={12} style={styles.header}>
        <h2> {newWorkoutName}</h2>
      </Grid>

      {addExercise.length !== 0 && (
        <>
          {addExercise.map((exercise, index) => {
            // console.log(exercise);
            return (
              <Paper
                elevation={4}
                sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                key={exercise._id}
              >
                <form>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{
                      marginBottom: 2,
                    }}
                    key={exercise._id + 2}
                  >
                    <Grid
                      item
                      xs={12}
                      key={exercise._id + 3}
                      sx={{ position: "relative" }}
                    >
                      <h3>{exercise.name}</h3>

                      <IsolatedMenuCreateWorkout
                        setAddExercise={setAddExercise}
                        addExercise={addExercise}
                        exerciseId={exercise._id}
                      />
                    </Grid>

                    {/* add dynamic fields */}
                    {exercise.numOfSets.map((num, idx) => {
                      return (
                        <>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            key={idx + 1}
                            sx={{ justifyContent: "flex-start" }}
                          >
                            <TextField
                              type="input"
                              variant="outlined"
                              label="Set"
                              fullWidth
                              name={`Set${idx}`}
                              value={idx + 1}
                            />
                          </Grid>
                          <Grid item xs={4} sm={4} key={idx + 2} sx={{}}>
                            <TextField
                              type="text"
                              fullWidth
                              name="weight"
                              variant="outlined"
                              label="Weight"
                              {...register(`${exercise.name}-weight-${idx}`)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    lb
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={3} sm={3} key={idx + 3}>
                            <TextField
                              fullWidth
                              type="text"
                              variant="outlined"
                              label="Reps"
                              name="reps"
                              {...register(`${exercise.name}-reps-${idx}`)}
                            />
                          </Grid>
                          {idx >= 1 ? (
                            <Grid item xs={1} key={idx + 4}>
                              <Fab
                                size="small"
                                variant="contained"
                                color="warning"
                                sx={{ ml: 1 }}
                                onClick={() => {
                                  setAddExercise((prev) => {
                                    //make copy of array of objects
                                    //remove array set and replace object in array and set state
                                    const update = [...prev];
                                    const item = update[index];

                                    item.numOfSets.splice(idx, 1);
                                    update[index] = {
                                      ...item,
                                    };
                                    return update;
                                  });

                                  //remove inputs from react-form-hook
                                  unregister(`${exercise.name}-reps-${idx}`);
                                  unregister(`${exercise.name}-weight-${idx}`);
                                }}
                              >
                                <Delete />
                              </Fab>
                            </Grid>
                          ) : null}
                        </>
                      );
                    })}

                    <Grid
                      item
                      xs={12}
                      key={exercise._id}
                      sx={{ alignContent: "center" }}
                    >
                      <Button
                        variant="contained"
                        sx={{ borderRadius: 10, ml: 2 }}
                        onClick={() => {
                          //Update Num of sets for exercise
                          //use local state for component to store form data. save button will update global state or just send to backend

                          setAddExercise((prev) => {
                            const update = [...prev];
                            const item = update[index];
                            item.numOfSets.push({ weight: "", reps: "" });
                            update[index] = {
                              ...item,
                            };
                            return update;
                          });
                        }}
                      >
                        Add Set
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            );
          })}

          <Grid item xs={12} sx={{ textAlign: "center", margin: 5 }}>
            {saveError ? (
              <Button variant="contained" color="error">
                Error Duplicate Workout Name
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  const values = getValues();
                  values.exercises = [];
                  // console.log(values);
                  //reformat values for DB
                  for (const [key, value] of Object.entries(values)) {
                    // console.log(`${key}: ${value}`);

                    if (key !== "exercises") {
                      let arr = key.split("-");
                      let end = Number(arr[2]);
                      let duplicate = values.exercises.findIndex(
                        (e) => arr[0] === Object.keys(e).toString()
                      );

                      if (arr[1] === "weight" && duplicate === -1) {
                        const key = arr[0];
                        const obj = {};
                        obj[key] = [{ weight: value }];
                        values.exercises.push(obj);
                      } else if (arr[1] === "weight" && duplicate !== -1) {
                        const curArr = values.exercises[duplicate][arr[0]];

                        curArr.push({ weight: value });
                      }

                      if (arr[1] === "reps" && duplicate === -1) {
                        const key = arr[0];
                        const obj = {};
                        obj[key] = [{ reps: value }];
                        values.exercises.push(obj);
                      } else if (arr[1] === "reps" && duplicate !== -1) {
                        console.log("inside reps else if");

                        values.exercises[duplicate][arr[0]][end].reps = value;
                      }
                    }
                  }

                  //need to add notes to post data
                  addExercise.map((exercise, index) => {
                    if (exercise.notes)
                      values.exercises[index].notes = exercise.notes;
                  });

                  //add exericses to recently used exercises
                  addRecentlyUsedExercises();
                  onSubmit(values);
                  
                }}
                sx={{ borderRadius: 10 }}
              >
                Save Changes
              </Button>
            )}
          </Grid>
        </>
      )}

      {showTabs ? (
        <AddExerciseForm
          setShowTabs={setShowTabs}
          addExercise={addExercise}
          setAddExercise={setAddExercise}
          checkedExerciseList={checkedExerciseList}
          setCheckedExerciseList={setCheckedExerciseList}
        />
      ) : (
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
        >
          <Button
            variant="contained"
            onClick={() => setShowTabs((prev) => !prev)}
            style={styles.buttonExercise}
          >
            Add Exercise
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default CreateWorkout;
