import { DeleteForever } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";
import React from "react";

const RenderSets = ({
  exercise,
  superSetIndex,
  inStartWorkout,
  exerciseIndex,
  setFunctionMainArray,
}) => {
  return (
    <>
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
                autoComplete="off"
                label="Weight"
                size="small"
                defaultValue={num.weight}
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
                    localStorage.setItem("NewWorkout", JSON.stringify(updated));
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
                size="small"
                autoComplete="off"
                defaultValue={num.reps}
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
                    localStorage.setItem("NewWorkout", JSON.stringify(updated));
                  }
                  //set local state
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
                          updated[0].exercises[superSetIndex][exerciseIndex];
                        item.numOfSets.splice(exerciseIndex, 1);
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
    </>
  );
};

export default RenderSets;
