import { Grid, InputAdornment, MenuItem, Paper, TextField } from "@mui/material";
import IsolatedMenu from "../IsolatedMenu";

const RenderCardio = ({e, index, setStartWorkout, startWorkout, inStartWorkout}) => {
  return (
    <><Paper
    elevation={4}
    sx={{
      padding: 2,
      mt: 1,
      mb: 1,
      borderRadius: 10,
      width: { xs: "100%", sm: "100%", md: "60%" },
    }}
    key={e._id}
  >
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="start"
      alignItems="center"
      sx={{
        marginBottom: 2,
        position: "relative",
      }}
    >
      <Grid item xs={12}>
                  <h3 >{e.name}</h3>

                  <IsolatedMenu
                    setFunctionMainArray={setStartWorkout}
                    mainArray={startWorkout}
                    exercise={e}
                    inStartWorkout={inStartWorkout} 
                  /> 
                  <Grid item xs={4} sm={3}>
                    {" "}
                    <TextField
                      size="small"
                      fullWidth
                      select
                      label="Order"
                      value={index}
                      onChange={(e) => {
                        let _workout = JSON.parse(
                          localStorage.getItem("startWorkout")
                        );
                        const currentExercise =
                          _workout[0].exercises.splice(index, 1)[0];
                        _workout[0].exercises.splice(
                          e.target.value,
                          0,
                          currentExercise
                        );
                        localStorage.setItem(
                          "startWorkout",
                          JSON.stringify(_workout)
                        );
                        setStartWorkout(_workout);
                      }}
                    >
                      {startWorkout[0].exercises.map(
                        (position, posindex) => (
                          <MenuItem key={posindex} value={posindex}>
                            #{posindex + 1}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>
                </Grid>
      {e.numOfSets.map((num, idx) => {
        return (
          <>
            <Grid
              item
              xs={3}
              sm={3}
              key={e._id + "cardio"}
              sx={{}}
            >
              <TextField
                type="number"
                fullWidth
                name="level"
                size="small"
                variant="outlined"
                label="Level"
                defaultValue={startWorkout[0].exercises[index].numOfSets[idx].level}

                onChange={(event) => {
                  const updated = JSON.parse(
                    localStorage.getItem("startWorkout")
                  );
                  updated[0].exercises[index].numOfSets[
                    idx
                  ].level = event.target.value;
                  localStorage.setItem(
                    "startWorkout",
                    JSON.stringify(updated)
                  );
                }}
              />
            </Grid>
            <Grid item xs={4} sm={4} key={e._id + "cardio time"}>
              <TextField
                type="number"
                fullWidth
                name="time"
                size="small"
                variant="outlined"
                label="Time"
                defaultValue={startWorkout[0].exercises[index].numOfSets[idx].minutes}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      Min
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  const updated = JSON.parse(
                    localStorage.getItem("startWorkout")
                  );
                  updated[0].exercises[index].numOfSets[
                    idx
                  ].minutes = event.target.value;
                  localStorage.setItem(
                    "startWorkout",
                    JSON.stringify(updated)
                  );
                }}
              />
            </Grid>
            <Grid
              item
              xs={5}
              sm={4}
              key={e._id + "cardio heart rate"}
            >
              <TextField
                fullWidth
                type="number"
                variant="outlined"
                label="Heart Rate"
                size="small"
                name="heartRate"
                defaultValue={startWorkout[0].exercises[index].numOfSets[idx].heartRate}

                InputLabelProps={{ shrink: true, required: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      BPM
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  const updated = JSON.parse(
                    localStorage.getItem("startWorkout")
                  );
                  updated[0].exercises[index].numOfSets[
                    idx
                  ].heartRate = event.target.value;
                  localStorage.setItem(
                    "startWorkout",
                    JSON.stringify(updated)
                  );
                }}
              />
            </Grid>
          </>
        );
      })}
    </Grid>
  </Paper></>
  )
}

export default RenderCardio