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
import React from "react";
import useProfile from "../../hooks/useProfile";
import IsolatedMenu from "./IsolatedMenuStartWorkout";
import IsolatedMenuCreateWorkout from "./IsolatedMenuCreateWorkout";

//this will be used to render the superset selection

const RenderSuperSet = ({
  superSet, // this is the nested superset array
  setAddExercise,
  mainArray, // top level array
  inStartWorkout,
}) => {
  const { state, dispatch } = useProfile();

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
        <Grid item xs={12}>
          <h3>SuperSet</h3>
        </Grid>

        {superSet.map((exercise, index) => {
          return (
            <>
              <Grid item xs={12} sx={{ position: "relative" }}>
                <h3>{exercise.name}</h3>

                <IsolatedMenuCreateWorkout
                  setAddExercise={setAddExercise}
                  exerciseId={exercise._id}
                  inSuperSet={inSuperSet}
                  superSet={superSet}
                  addExercise={superSet}
                  mainArray={mainArray}
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
                        // {...register(`${exercise.name}-weight-${idx}`)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">lb</InputAdornment>
                          ),
                        }}
                        onChange={(event) => {
                          const supersets = [];
                          mainArray.map((element, i) => {
                            if (Array.isArray(element)) {
                              supersets.push(i);
                            }
                          }); // get superset indexes
                          //find current superset
                          supersets.forEach((i) => {
                            mainArray[i].forEach((element, topidx) => {
                              //check if the current exercise exists in this superset
                              if (element._id === exercise._id) {
                                if (inStartWorkout) {
                                  const updated = JSON.parse(
                                    localStorage.getItem("startWorkout")
                                  );
                                  updated[0][i][topidx].numOfSets[idx].weight =
                                    event.target.value;
                                  localStorage.setItem(
                                    "startWorkout",
                                    JSON.stringify(updated)
                                  );
                                } else {
                                  const updated = JSON.parse(
                                    localStorage.getItem("NewWorkout")
                                  );
                                  updated[i][topidx].numOfSets[idx].weight =
                                    event.target.value;
                                  localStorage.setItem(
                                    "NewWorkout",
                                    JSON.stringify(updated)
                                  );
                                }
                              }
                            }); //
                          });
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
                        // {...register(`${exercise.name}-reps-${idx}`)}
                        onChange={(event) => {
                          const supersets = [];
                          mainArray.map((element, i) => {
                            if (Array.isArray(element)) {
                              supersets.push(i);
                            }
                          }); // get superset indexes
                          //find current superset
                          supersets.forEach((i) => {
                            mainArray[i].forEach((element, topidx) => {
                              //check if the current exercise exists in this superset
                              if (element._id === exercise._id) {
                                if (inStartWorkout) {
                                  const updated = JSON.parse(
                                    localStorage.getItem("startWorkout")
                                  );
                                  updated[0][i][topidx].numOfSets[idx].weight =
                                    event.target.value;
                                  localStorage.setItem(
                                    "startWorkout",
                                    JSON.stringify(updated)
                                  );
                                } else {
                                  const updated = JSON.parse(
                                    localStorage.getItem("NewWorkout")
                                  );
                                  updated[i][topidx].numOfSets[idx].reps =
                                    event.target.value;
                                  localStorage.setItem(
                                    "NewWorkout",
                                    JSON.stringify(updated)
                                  );
                                }
                              }
                            }); //
                          });
                        }}
                      />
                    </Grid>
                    {idx >= 1 && !inStartWorkout ? (
                      <Grid item xs={1} key={idx + 4}>
                        <Fab
                          size="small"
                          variant="contained"
                          color="warning"
                          sx={{ ml: 1 }}
                          onClick={() => {
                            // this is inside a superset so we need to go deeper
                            // find corresponding superset
                            const supersets = [];
                            mainArray.map((element, i) => {
                              if (Array.isArray(element)) {
                                supersets.push(i);
                              }
                            });

                            console.log(supersets);

                            supersets.forEach((i) => {
                              mainArray[i].forEach((element, topidx) => {
                                //check if the current exercise exists in this superset
                                if (element._id === exercise._id) {
                                  console.log(mainArray[i][topidx]);

                                  setAddExercise((prev) => {
                                    let update = JSON.parse(
                                      JSON.stringify(prev)
                                    ); // make a deep copy to avoid mutating the original object
                                    const item = update[i][topidx];

                                    item.numOfSets.splice(idx, 1);
                                    update[i][topidx] = item;
                                    return update;
                                  });
                                }
                              });
                            });
                          }}
                        >
                          <Delete />
                        </Fab>
                      </Grid>
                    ) : (
                      <Grid item xs={1} key={exercise._id + 13}>
                        <Tooltip title="completed">
                          <Checkbox aria-label="Completed" color="success" />
                        </Tooltip>
                      </Grid>
                    )}
                  </>
                );
              })}

              <Grid item xs={12} sx={{ alignContent: "center" }}>
                <Button
                  variant="contained"
                  sx={{ borderRadius: 10, ml: 2 }}
                  onClick={() => {
                    // inside a superset so this is a nested array inside of AddExercise/ startworkout
                    //find index of the current superset, create array of all indexes that are supersets
                    console.log(mainArray)
                    const supersets = [];
                    if (inStartWorkout) {
                      mainArray[0].exercises.map((element, i) => {
                        if (Array.isArray(element)) {
                          supersets.push(i);
                        }
                      });
                    } else {
                      mainArray.map((element, i) => {
                        if (Array.isArray(element)) {
                          supersets.push(i);
                        }
                      });
                    }
                    // need to fix ifs
                    console.log("indexs of arrays", supersets);
                    if (inStartWorkout) {
                      supersets.forEach((i) => {
                        mainArray[0].exercises[i].forEach((element, idx) => {
                          //check if the current exercise exists in this superset
                          if (element._id === exercise._id) {
                            setAddExercise((prev) => {
                              // let updated = JSON.parse(JSON.stringify(prev));
                              const updated = JSON.parse(
                                localStorage.getItem("startWorkout")
                              );
                              console.log(updated);
                              const item = updated[0].exercises[i][idx];
                              item.numOfSets.push({ weight: "", reps: "" });
                              updated[0].exercises[i][idx] = item;
                              localStorage.setItem(
                                "startWorkout",
                                JSON.stringify(updated)
                              );
                              return updated;
                            });
                          }
                        });
                      });
                    } else {
                      supersets.forEach((i) => {
                        mainArray[0].exercises[i].forEach((element, idx) => {
                          //check if the current exercise exists in this superset
                          if (element._id === exercise._id) {
                            setAddExercise((prev) => {
                              let update = JSON.parse(JSON.stringify(prev)); // make a deep copy to avoid mutating the original object

                              const item = update[i][idx];
                              item.numOfSets.push({ weight: "", reps: "" });
                              update[i][idx] = item;
                              return update;
                            });
                          }
                        });
                      });
                    }
                  }}
                >
                  Add Set
                </Button>
              </Grid>
            </>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default RenderSuperSet;
