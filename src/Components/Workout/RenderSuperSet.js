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
  superSet,
  register,
  setAddExercise,
  unregister,
  mainArray,
}) => {
  const { state, dispatch } = useProfile();

 const inSuperSet = true;

  console.log("nested array superset", superSet);

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
                        {...register(`${exercise.name}-weight-${idx}`)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">lb</InputAdornment>
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
                                // remove inputs from react-form-hook
                                unregister(`${exercise.name}-reps-${idx}`);
                                unregister(`${exercise.name}-weight-${idx}`);
                              });
                            });
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
                  onClick={() => {
                    // inside a superset so this is a nested array inside of AddExercise/ startworkout
                    //find index of the current superset, create array of all indexes that are supersets
                    const supersets = [];
                    mainArray.map((element, i) => {
                      if (Array.isArray(element)) {
                        supersets.push(i);
                      }
                    });
                    console.log("indexs of arrays", supersets);

                    supersets.forEach((i) => {
                      mainArray[i].forEach((element, idx) => {
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
