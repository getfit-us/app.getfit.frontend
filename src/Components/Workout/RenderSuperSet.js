import { Add, DeleteForever, History } from "@mui/icons-material";
import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import IsolatedMenu from "./IsolatedMenu";
import ExerciseHistory from "./Modals/ExerciseHistory";

//this will be used to render the superset selection

const RenderSuperSet = ({
  superSet, // this is the nested superset array
  setFunctionMainArray,
  mainArray, // top level array
  inStartWorkout,
  superSetIndex,
  exerciseHistory,
  clientId,
  getHistory,
  setModalHistory,
  modalHistory,
  status,
}) => {


  // create local state for superset inputs for controlled inputs
const [superSetState, setSuperSetState] = useState({});

  const inSuperSet = true;
  return (
    <Paper
      elevation={4}
      sx={{
        padding: 2,
        mt: 1,
        mb: 1,
        borderRadius: 10,
        borderLeft: "7px solid #689ee1",
        width: { xs: "100%", sm: "100%", md: "60%" },
      }}
    >
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
        <Grid item xs={4} sm={3}>
          <h3>SuperSet</h3>
          <TextField
            size="small"
            fullWidth
            select
            label="Exercise Order"
            value={superSetIndex}
            onChange={(e) => {
              if (inStartWorkout) {
                let _workout = JSON.parse(localStorage.getItem("startWorkout"));
                const currentExercise = _workout[0].exercises.splice(
                  superSetIndex,
                  1
                )[0];
                _workout[0].exercises.splice(
                  e.target.value,
                  0,
                  currentExercise
                );
                localStorage.setItem("startWorkout", JSON.stringify(_workout));
                setFunctionMainArray(_workout);
              } else {
                let _workout = JSON.parse(localStorage.getItem("NewWorkout"));
                const currentExercise = _workout.splice(superSetIndex, 1)[0];
                _workout.splice(e.target.value, 0, currentExercise);
                localStorage.setItem("NewWorkout", JSON.stringify(_workout));
                setFunctionMainArray(_workout);
              }
            }}
          >
            {inStartWorkout
              ? mainArray[0].exercises.map((position, posindex) => (
                  <MenuItem key={posindex} value={posindex}>
                    #{posindex + 1}
                  </MenuItem>
                ))
              : mainArray.map((position, posindex) => (
                  <MenuItem key={posindex} value={posindex}>
                    #{posindex + 1}
                  </MenuItem>
                ))}
          </TextField>
        </Grid>

        {superSet.map((exercise, exerciseIndex) => {
          return (
            <>
              <Grid item xs={12} sx={{ position: "relative" }}>
                <h3>{exercise.name}</h3>

                <IsolatedMenu
                  setFunctionMainArray={setFunctionMainArray}
                  inSuperSet={inSuperSet}
                  superSet={superSet}
                  mainArray={mainArray}
                  superSetIndex={superSetIndex}
                  inStartWorkout={inStartWorkout}
                  exercise={exercise}
                />
              </Grid>

              {/* add dynamic fields */}
              {exercise.numOfSets.map((num, setIndex) => {
                return (
                  <>
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      key={setIndex + 1}
                      sx={{ justifyContent: "flex-start" }}
                    >
                      <TextField
                        type="input"
                        variant="outlined"
                        label="Set"
                        fullWidth
                        name={`Set${setIndex}`}
                        value={setIndex + 1}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6} key={setIndex + 2} sx={{}}>
                      <TextField
                        type="text"
                        fullWidth
                        name="weight"
                        variant="outlined"
                        label="Weight"
                        size="small"
                        value={superSetState[`${superSetIndex}${exercise.name}weight${setIndex}`]}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">lb</InputAdornment>
                          ),
                        }}
                        onChange={(event) => {
                          if (inStartWorkout) {
                            const updated = JSON.parse(
                              localStorage.getItem("startWorkout")
                            );
                            updated[0].exercises[superSetIndex][
                              exerciseIndex
                            ].numOfSets[setIndex].weight = event.target.value;
                            localStorage.setItem(
                              "startWorkout",
                              JSON.stringify(updated)
                            );
                          } else {
                            const updated = JSON.parse(
                              localStorage.getItem("NewWorkout")
                            );
                            updated[superSetIndex][exerciseIndex].numOfSets[
                              setIndex
                            ].weight = event.target.value;
                            localStorage.setItem(
                              "NewWorkout",
                              JSON.stringify(updated)
                            );
                          }
                          setSuperSetState(prevState => ({...prevState, [`${exercise.name}weight${setIndex}`]: event.target.value}))
                        }}
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} key={setIndex + 3}>
                      <TextField
                        fullWidth
                        type="text"
                        variant="outlined"
                        label="Reps"
                        name="reps"
                        size="small"
                       value={superSetState[`${superSetIndex}${exercise.name}reps${setIndex}`]}
                        onChange={(event) => {
                          if (inStartWorkout) {
                            const updated = JSON.parse(
                              localStorage.getItem("startWorkout")
                            );
                            updated[0].exercises[superSetIndex][
                              exerciseIndex
                            ].numOfSets[setIndex].reps = event.target.value;
                            localStorage.setItem(
                              "startWorkout",
                              JSON.stringify(updated)
                            );
                          } else {
                            const updated = JSON.parse(
                              localStorage.getItem("NewWorkout")
                            );
                            updated[superSetIndex][exerciseIndex].numOfSets[
                              setIndex
                            ].reps = event.target.value;
                            localStorage.setItem(
                              "NewWorkout",
                              JSON.stringify(updated)
                            );
                          }
                          //set local state
                          setSuperSetState((prevState) => ({...prevState, [`${exercise.name}reps${setIndex}`]: event.target.value}))
                        }}
                      />
                    </Grid>
                    {setIndex >= 1 && (
                      <Grid item xs={1} key={setIndex + 4}>
                        <DeleteForever
                          onClick={() => {
                            // this is inside a superset so we need to go deeper
                            // find corresponding superset

                            setFunctionMainArray((prev) => {
                              let updated = [];
                              if (inStartWorkout) {
                                updated = JSON.parse(
                                  localStorage.getItem("startWorkout")
                                );
                                const item =
                                  updated[0].exercises[superSetIndex][
                                    exerciseIndex
                                  ];
                                item.numOfSets.splice(exerciseIndex, 1);
                                updated[0].exercises[superSetIndex][
                                  exerciseIndex
                                ] = item;
                                localStorage.setItem(
                                  "startWorkout",
                                  JSON.stringify(updated)
                                );
                              } else {
                                updated = JSON.parse(
                                  localStorage.getItem("NewWorkout")
                                );
                                const item =
                                  updated[superSetIndex][exerciseIndex];
                                item.numOfSets.splice(exerciseIndex, 1);
                                updated[superSetIndex][exerciseIndex] = item;
                                localStorage.setItem(
                                  "NewWorkout",
                                  JSON.stringify(updated)
                                );
                              }

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

              <Grid item lg={4} sm={3} sx={{ alignContent: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<Add />}
                  sx={{ borderRadius: 10 }}
                  onClick={() => {
                    setFunctionMainArray((prev) => {
                      let updated = [];
                      if (inStartWorkout) {
                        updated = JSON.parse(
                          localStorage.getItem("startWorkout")
                        );
                        const item =
                          updated[0].exercises[superSetIndex][exerciseIndex];
                        item.numOfSets.push({ weight: "", reps: "" });
                        updated[0].exercises[superSetIndex][exerciseIndex] =
                          item;
                        localStorage.setItem(
                          "startWorkout",
                          JSON.stringify(updated)
                        );
                      } else {
                        updated = JSON.parse(
                          localStorage.getItem("NewWorkout")
                        );

                        const item = updated[superSetIndex][exerciseIndex];
                        item.numOfSets.push({ weight: "", reps: "" });
                        updated[superSetIndex][exerciseIndex] = item;
                        localStorage.setItem(
                          "NewWorkout",
                          JSON.stringify(updated)
                        );
                      }

                      return updated;
                    });
                  }}
                >
                  Set
                </Button>
              </Grid>
              {inStartWorkout && (
                <>
                  <Grid item lg={4} sx={{ alignContent: "center" }}>
                    <Button
                      id={`historyButton${superSetIndex}${exerciseIndex}`}
                      size="small"
                      color={"primary"}
                      variant="contained"
                      endIcon={<History />}
                      sx={{ borderRadius: 10 }}
                      onClick={() => {
                        const currButton = document.getElementById(
                          `historyButton${superSetIndex}${exerciseIndex}`
                        );
                        const curInnerHtml = currButton.innerHTML;
                        currButton.innerHTML = "Loading...";
                        getHistory(
                          exercise._id,
                          `historyButton${superSetIndex}${exerciseIndex}`,
                          curInnerHtml
                        );
                      }}
                    >
                      History
                    </Button>
                  </Grid>
                </>
              )}
            </>
          );
        })}
      </Grid>
      <ExerciseHistory
        setModalHistory={setModalHistory}
        modalHistory={modalHistory}
        exerciseHistory={exerciseHistory}
        status={status}
        clientId={clientId}
      />
    </Paper>
  );
};

export default RenderSuperSet;
