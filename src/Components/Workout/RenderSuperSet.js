import { Add, Delete, Done, History } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Fab,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useRef, useState } from "react";
import useProfile from "../../hooks/useProfile";
import IsolatedMenu from "./IsolatedMenu";
import ExerciseHistory from "./ExerciseHistory";

//this will be used to render the superset selection

const RenderSuperSet = ({
  superSet, // this is the nested superset array
  setFunctionMainArray,
  mainArray, // top level array
  inStartWorkout,
  superSetIndex,
  dragOverItem,
  dragItem,
  move,
  setMove,
  clientId
}) => {
  const { state, dispatch } = useProfile();
  const [currentExercise, setCurrentExercise] = useState(null);
  const [modalHistory, setModalHistory] = useState(false);
  
  const handleSort = () => {
    if (inStartWorkout) {
       //duplicate items
       let _workout = JSON.parse(localStorage.getItem("startWorkout"));
       //remove and save the dragged item content
       const draggedItemContent = _workout[0].exercises.splice(dragItem.current, 1)[0];
 
       //switch the position
       _workout[0].exercises.splice(dragOverItem.current, 0, draggedItemContent);
 
       //reset the position ref
       dragItem.current = null;
       dragOverItem.current = null;
 
       //update the actual array
       localStorage.setItem("startWorkout", JSON.stringify(_workout));
       setFunctionMainArray(_workout);
     
    } else { // inside create workout
       //duplicate items
       let _workout = JSON.parse(localStorage.getItem("NewWorkout"));
       //remove and save the dragged item content
       const draggedItemContent = _workout.splice(dragItem.current, 1)[0];
 
       //switch the position
       _workout.splice(dragOverItem.current, 0, draggedItemContent);
 
       //reset the position ref
       dragItem.current = null;
       dragOverItem.current = null;
 
       //update the actual array
       localStorage.setItem("NewWorkout", JSON.stringify(_workout));
       setFunctionMainArray(_workout);
    }
  };
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
        width: {xs: '100%', sm: '100%', md:"60%"}
      }}
      draggable={move}
      onDragStart={(e) => (dragItem.current = superSetIndex)}
  onDragEnter={(e) => (dragOverItem.current = superSetIndex)}
  onDragEnd={handleSort}
  onDragOver={(e) => e.preventDefault()}
  className={move ? 'DragOn' : ''}
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
        <Grid item xs={12}>
          <h3>SuperSet</h3>
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
                  setMove={setMove}
                  move={move}
                />
              </Grid>

              {/* add dynamic fields */}
              {exercise.numOfSets.map((num, setIndex) => {
                return (
                  <>
                    <Grid
                      item
                      xs={3}
                      sm={3}
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
                      />
                    </Grid>
                    <Grid item xs={4} sm={4} key={setIndex + 2} sx={{}}>
                      <TextField
                        type="text"
                        fullWidth
                        name="weight"
                        variant="outlined"
                        label="Weight"
                        // {...register(`${exercise.name}-weight-${setIndex}`)}
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
                        }}
                      />
                    </Grid>
                    {setIndex >= 1 && (
                      <Grid item xs={1} key={setIndex + 4}>
                        <Fab
                          size="small"
                          variant="contained"
                          color="warning"
                          sx={{ ml: 1 }}
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
                        >
                          <Delete />
                        </Fab>
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
                      size="small"
                      variant="contained"
                      sx={{ borderRadius: 10 }}
                      onClick={() => {
                        setCurrentExercise(exercise);

                        setModalHistory(true);
                      }}
                      endIcon={<History />}
                    >
                      Exercise
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
        currentExercise={currentExercise}
        clientId={clientId}
      />
    </Paper>
  );
};

export default RenderSuperSet;
