import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Circle, Delete } from "@mui/icons-material";

import { useState, useEffect, useRef } from "react";
import AddExerciseForm from "./AddExerciseForm";
import useProfile from "../../hooks/useProfile";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import IsolatedMenu from "./IsolatedMenu";
import Overview from "../Overview";
import RenderSuperSet from "./RenderSuperSet";
import { useNavigate } from "react-router-dom";

const CreateWorkout = ({ manageWorkout }) => {
  //need to ask if you want to save or leave page for new workout

  const { state, dispatch } = useProfile();
  const [showTabs, setShowTabs] = useState(false);
  const [move, setMove] = useState(false);
  const [saveError, setSaveError] = useState(false);
  // superset
  const [indexOfSuperSets, setIndexOfSuperSets] = useState([]); // array of indexes for the current workout supersets
  const navigate = useNavigate();
  const [addExercise, setAddExercise] = useState([]);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const [status, setStatus] = useState({
    isError: false,
    success: false,
    loading: false,
  });

  const { register, unregister, getValues } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const axiosPrivate = useAxiosPrivate();

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const handleSort = () => {
    // used to handle drag and drop form elements
    //duplicate items
    let _workout = JSON.parse(localStorage.getItem("NewWorkout"));
    console.log(_workout);
    //remove and save the dragged item content
    const draggedItemContent = _workout.splice(dragItem.current, 1)[0];

    //switch the position
    _workout.splice(dragOverItem.current, 0, draggedItemContent);

    //reset the position ref
    dragItem.current = null;
    dragOverItem.current = null;

    //update the actual array
    localStorage.setItem("NewWorkout", JSON.stringify(_workout));
    setAddExercise(_workout);
  };

  // -------------------api call to save workout--
  const onSubmit = async (workout) => {
    let isMounted = true;
    setStatus({
      show: false,
      isError: false,
      loading: true,
      success: false,
    });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/custom-workout", workout, {
        signal: controller.signal,
      });
      localStorage.removeItem("NewWorkout"); //remove current workout from localStorage
      dispatch({ type: "ADD_CUSTOM_WORKOUT", payload: response.data });
      dispatch({ type: "MANAGE_WORKOUT", payload: [] });
      setStatus({
        isError: false,
        loading: false,
        success: true,
      });
      navigate("/dashboard/overview");
      

      // reset();
    } catch (err) {
      console.log(err);
      setStatus({
        isError: true,
        loading: false,
        success: false,
      });
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

  useEffect(() => {
    // going to add something for localStorage here later
    if (state.manageWorkout) {
      localStorage.setItem("NewWorkout", JSON.stringify(state.manageWorkout));
      setAddExercise(state.manageWorkout);
    } else {
      localStorage.setItem("NewWorkout", JSON.stringify(addExercise));
    }
    if (localStorage.getItem("NewWorkout")) {

    }
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
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
  document.title = `Create Workout - ${state.newWorkout.name}`;

  return (
    <Grid container style={styles.container} sx={{ marginTop: 10 }}>
      <Grid
        item
        xs={12}
        sm={5}
        sx={{ justifyContent: "center", textAlign: "center", mb: 2 }}
      >
        <TextField
          style={{ justifyContent: "center" }}
          type="text"
          defaultValue={state.newWorkout.name}
          label="Workout Name"
          id="WorkoutName"
          variant="outlined"
          fullWidth
        />
      </Grid>

      {addExercise?.length !== 0 && (
        <>
          {addExercise.map((exercise, index) => {
            // check if the exercise is a superset array of exercises
            return Array.isArray(exercise) ? (
              <RenderSuperSet
                superSet={exercise} //this is the nested array of exercises for the superset
                register={register}
                setFunctionMainArray={setAddExercise}
                unregister={unregister}
                mainArray={addExercise} // this is the main state array top level........................
                inStartWorkout={false}
                superSetIndex={index}
                dragItem={dragItem}
                dragOverItem={dragOverItem}
                setMove={setMove}
                move={move}
              />
            ) : exercise.type === "cardio" ? ( // going to show a different output for cardio
              <Paper
                elevation={4}
                sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                key={exercise._id}
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
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{
                    marginBottom: 2,
                  }}
                >
                  <Grid item xs={12}>
                    <Typography variant="h5">{exercise.name}</Typography>
                  </Grid>
                  {exercise.numOfSets.map((num, idx) => {
                    return (
                      <>
                        <Grid item xs={4} sm={4} key={idx + 2} sx={{}}>
                          <TextField
                            type="number"
                            fullWidth
                            name="level"
                            variant="outlined"
                            label="Level of intensity"
                            {...register(`level`)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  Lvl
                                </InputAdornment>
                              ),
                            }}
                            onChange={(event) => {
                              const updated = JSON.parse(
                                localStorage.getItem("NewWorkout")
                              );
                              updated[index].numOfSets[idx].level =
                                event.target.value;
                              localStorage.setItem(
                                "NewWorkout",
                                JSON.stringify(updated)
                              );
                            }}
                          />
                        </Grid>
                        <Grid item xs={4} sm={4} key={idx + 2} sx={{}}>
                          <TextField
                            type="number"
                            fullWidth
                            name="time"
                            variant="outlined"
                            label="Time Completed"
                            {...register(`time`)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  Minutes
                                </InputAdornment>
                              ),
                            }}
                            onChange={(event) => {
                              const updated = JSON.parse(
                                localStorage.getItem("NewWorkout")
                              );
                              updated[index].numOfSets[idx].minutes =
                                event.target.value;
                              localStorage.setItem(
                                "NewWorkout",
                                JSON.stringify(updated)
                              );
                            }}
                          />
                        </Grid>
                        <Grid item xs={3} sm={3} key={idx + 3}>
                          <TextField
                            fullWidth
                            type="number"
                            variant="outlined"
                            label="Heart Rate"
                            name="heartRate"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  BPM
                                </InputAdornment>
                              ),
                            }}
                            {...register(`heartRate`)}
                            onChange={(event) => {
                              const updated = JSON.parse(
                                localStorage.getItem("NewWorkout")
                              );
                              updated[index].numOfSets[idx].heartRate =
                                event.target.value;
                              localStorage.setItem(
                                "NewWorkout",
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
                key={exercise._id}
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
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{
                      marginBottom: 2,
                    }}
                  >
                    <Grid item xs={12} sx={{ position: "relative" }}>
                      <h3>{exercise.name}</h3>

                      <IsolatedMenu
                        setFunctionMainArray={setAddExercise}
                        mainArray={addExercise}
                        exercise={exercise}
                        setMove={setMove}
                        move={move} // this
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
                              onChange={(event) => {
                                const updated = JSON.parse(
                                  localStorage.getItem("NewWorkout")
                                );
                                updated[index].numOfSets[idx].weight =
                                  event.target.value;
                                localStorage.setItem(
                                  "NewWorkout",
                                  JSON.stringify(updated)
                                );
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
                              onChange={(event) => {
                                const updated = JSON.parse(
                                  localStorage.getItem("NewWorkout")
                                );
                                updated[index].numOfSets[idx].reps =
                                  event.target.value;
                                localStorage.setItem(
                                  "NewWorkout",
                                  JSON.stringify(updated)
                                );
                              }}
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
                                  const updated = JSON.parse(
                                    localStorage.getItem("NewWorkout")
                                  );
                                  setAddExercise((prev) => {
                                    //make copy of array of objects
                                    //remove array set and replace object in array and set state

                                    const item = updated[index];

                                    item.numOfSets.splice(idx, 1);
                                    updated[index] = {
                                      ...item,
                                    };
                                    localStorage.setItem(
                                      "NewWorkout",
                                      JSON.stringify(updated)
                                    );
                                    return updated;
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

                    <Grid item xs={12} sx={{ alignContent: "center" }}>
                      <Button
                        variant="contained"
                        sx={{ borderRadius: 10, ml: 2 }}
                        endIcon={<Add />}
                        size="small"
                        onClick={() => {
                          //Update Num of sets for exercise
                          //use local state for component to store form data. save button will update global state or just send to backend

                          const updated = JSON.parse(
                            localStorage.getItem("NewWorkout")
                          );

                          setAddExercise((prev) => {
                            const item = updated[index];
                            item.numOfSets.push({ weight: "", reps: "" });
                            updated[index] = {
                              ...item,
                            };
                            localStorage.setItem(
                              "NewWorkout",
                              JSON.stringify(updated)
                            );
                            return updated;
                          });
                        }}
                      >
                        Set
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            );
          })}

          <Grid item xs={12} sx={{ textAlign: "center", margin: 5 }}>
            {status.error ? (
              <Button variant="contained" color="error">
                Error Duplicate Workout Name
              </Button>
            ) : status.loading ? (
              <CircularProgress size={100} color="success" />
            ) : (
              <Button
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  let workout = {};
                  const getFormName =
                    document.getElementById("WorkoutName").value;
                  //get workout from localStorage
                  const updated = JSON.parse(
                    localStorage.getItem("NewWorkout")
                  );
                  workout.exercises = updated; // add exercises to workout
                  workout.name = getFormName
                    ? getFormName
                    : state.newWorkout.name; // add name to workout
                  workout.id = state.profile.clientId;

                  onSubmit(workout);
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
