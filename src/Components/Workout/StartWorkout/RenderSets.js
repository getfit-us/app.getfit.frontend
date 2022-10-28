import { DeleteForever } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";

const RenderSets = ({exercise, index, setStartWorkout, startWorkout}) => {
  return (
    <>{exercise.numOfSets.map((set, i) => {
        return (
          <>
            <Grid
              item
              xs={2}
              sm={2}
              key={exercise._id + index + i + "set"}
              sx={{ justifyContent: "flex-start" }}
            >
              <TextField
                type="input"
                variant="outlined"
                label="Set"
                fullWidth
                name={`Set`}
                value={i + 1}
                size="small"
              />
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              key={exercise._id + index + i + "weight"}
            >
              <TextField
                type="input"
                variant="outlined"
                label="Weight"
                fullWidth
                name="weight"
                defaultValue={startWorkout[0].exercises[index].numOfSets[i].weight}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      lb
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  //update changes to local storage
                  const updated = JSON.parse(
                    localStorage.getItem("startWorkout")
                  );

                  updated[0].exercises[index].numOfSets[
                    i
                  ].weight = event.target.value;
                  localStorage.setItem(
                    "startWorkout",
                    JSON.stringify(updated)
                  );
                }}
              />
            </Grid>
            <Grid
              item
              xs={3}
              sm={3}
              key={exercise._id + index + i + "rep"}
            >
              <TextField
                type="text"
                variant="outlined"
                label="Reps"
                fullWidth
                name="reps"
                size="small"
                defaultValue={startWorkout[0].exercises[index].numOfSets[i].reps}
                onChange={(event) => {
                  //update changes to local storage

                  const updated = JSON.parse(
                    localStorage.getItem("startWorkout")
                  );

                  updated[0].exercises[index].numOfSets[
                    i
                  ].reps = event.target.value;
                  localStorage.setItem(
                    "startWorkout",
                    JSON.stringify(updated)
                  );
                }}
              />
            </Grid>
            {i >= 1 && (
              <Grid
                item
                xs={1}
                key={exercise._id + index + i + "delete"}
              >
                <DeleteForever
                  onClick={() => {
                    setStartWorkout((prev) => {
                      let updated = JSON.parse(
                        localStorage.getItem("startWorkout")
                      );
                      const selectedExercise =
                        updated[0].exercises[index];

                      selectedExercise.numOfSets.splice(i, 1);
                      updated[0].exercises[index] =
                        selectedExercise;
                      localStorage.setItem(
                        "startWorkout",
                        JSON.stringify(updated)
                      );

                      return updated;
                    });
                  }}
                  sx={{ color: "#db4412", cursor: "pointer" }}
                />
              </Grid>
            )}
          </>
        );
      })}</>
  )
}

export default RenderSets