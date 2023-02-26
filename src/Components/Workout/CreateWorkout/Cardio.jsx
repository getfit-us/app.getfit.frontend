import {
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import IsolatedMenu from "../IsolatedMenu";

const Cardio = ({ setAddExercise, addExercise, exercise, index }) => {
  return (
    <>
      <Paper
        elevation={4}
        sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
        key={exercise._id}
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
          <Grid item xs={12} sx={{ position: "relative" }}>
            <h3>{exercise.name}</h3>

            <IsolatedMenu
              setFunctionMainArray={setAddExercise}
              mainArray={addExercise}
              exercise={exercise}
            />
            <Grid item xs={4} sm={3}>
              <TextField
                size="small"
                fullWidth
                select
                label="Order"
                value={index}
                onChange={(e) => {
                  let _workout = JSON.parse(localStorage.getItem("NewWorkout"));
                  const currentExercise = _workout.splice(index, 1)[0];
                  _workout.splice(e.target.value, 0, currentExercise);
                  localStorage.setItem("NewWorkout", JSON.stringify(_workout));
                  setAddExercise(_workout);
                }}
              >
                {addExercise.map((position, posindex) => (
                  <MenuItem key={posindex} value={posindex}>
                    #{posindex + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          {exercise.numOfSets.map((num, idx) => {
            return (
              <>
                <Grid item xs={3} sm={3} key={exercise._id + "level"} sx={{}}>
                  <TextField
                    type="number"
                    fullWidth
                    name="level"
                    variant="outlined"
                    label="Level"
                    size="small"
                    defaultValue={addExercise[index].numOfSets[idx].level}
                    onChange={(event) => {
                      const updated = JSON.parse(
                        localStorage.getItem("NewWorkout")
                      );
                      updated[index].numOfSets[idx].level = event.target.value;
                      localStorage.setItem(
                        "NewWorkout",
                        JSON.stringify(updated)
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={4} sm={4} key={exercise._id + "time"} sx={{}}>
                  <TextField
                    type="number"
                    fullWidth
                    name="time"
                    variant="outlined"
                    label="Time"
                    size="small"
                    defaultValue={addExercise[index].numOfSets[idx].minutes}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">M</InputAdornment>
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
                <Grid item  xs={5}
              sm={4} key={exercise._id + "heart rate"}>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label="HR"
                    size="small"
                    name="heartRate"
                    defaultValue={addExercise[index].numOfSets[idx].heartRate}

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
    </>
  );
};

export default Cardio;
