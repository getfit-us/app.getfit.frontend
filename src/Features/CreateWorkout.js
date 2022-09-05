import {
  Button,
  Fab,
  Grid,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

import { useState, useTheme } from "react";
import AddExerciseForm from "../Components/AddExerciseForm";
import useProfile from "../utils/useProfile";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../utils/useAxiosPrivate";

const CreateWorkout = ({ newWorkoutName }) => {
  const { state, dispatch } = useProfile();
  const [showTabs, setShowTabs] = useState(false);
  const [addExercise, setAddExercise] = useState([]);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const {
    register,
    unregister,
    getValues,
    formState: { errors },
    control,
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });
  const axiosPrivate = useAxiosPrivate();

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
      // reset();
    } catch (err) {
      console.log(err);
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
  };

  return (
    <Grid container style={styles.container} sx={{ marginTop: 10 }} >
      <Grid item style={styles.header}>
        <h3> {newWorkoutName}</h3>
      </Grid>
      {addExercise.length !== 0 && (
        <>
          {addExercise.map((exercise, index) => {
            return (
              <Paper
                elevation={4}
                sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                key={Math.random(exercise._id)}
              >
                {/* <DevTool control={control} /> set up the dev tool */}

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
                    key={Math.random(exercise._id)}
                  >
                    <Grid item xs={12} key={Math.random(exercise._id)}>
                      <h3>{exercise.name}</h3>
                    </Grid>

                    {/* add dynamic fields */}
                    {exercise.numOfSets.map((num, idx) => {
                      return (
                        <>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            key={Math.random(exercise._id)}
                            sx={{ justifyContent: "flex-start" }}
                          >
                            <TextField
                              key={Math.random(exercise._id)}
                              type="input"
                              variant="outlined"
                              label="Set"
                              fullWidth
                              name={`Set${idx}`}
                              value={idx + 1}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sm={4}
                            key={Math.random(exercise._id)}
                            sx={{}}
                          >
                            <TextField
                              key={Math.random(exercise._id)}
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
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            key={Math.random(exercise._id)}
                          >
                            <TextField
                              fullWidth
                              type="text"
                              variant="outlined"
                              label="Reps"
                              name="reps"
                              key={Math.random(exercise._id)}
                              {...register(`${exercise.name}-reps-${idx}`)}
                            />
                          </Grid>
                          {idx >= 1 ? (
                            <Grid item xs={1} key={Math.random(exercise._id)}>
                              <Fab
                                key={Math.random(exercise._id)}
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
                      key={Math.random(exercise._id)}
                      sx={{ alignContent: "center" }}
                    >
                      <Button
                      key={Math.random(exercise._id)}
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
          ;
          <Grid item sx={{ textAlign: "center", margin: 5 }} >
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                const values = getValues();
                values.exercises = [];
                // console.log(values);
                //reformat values for DB
                for (const property in values) {
                  // 
                  if (property !== "exercises") {
                    //get ending number
                    // let end = property.slice(-1)
                 
                    let arr = property.split("-");
                    const exerciseName = {};


                    exerciseName[arr[0]] = {}
                    
                

                    
                    if (arr[1] === "weight") {
                      exerciseName[arr[0]]= {weight: ''}
                    }
                    if (arr[1] === "reps") {
                      exerciseName[arr[0]]= {reps: ''}
                    }
                    values.exercises.push(exerciseName);
                    console.log(values.exerciseName);
                  }
                }
                console.log(values);
              }}
              sx={{ borderRadius: 10 }}
            >
              Save Changes
            </Button>
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
