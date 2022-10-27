import { Grid, InputAdornment, Paper, TextField, Typography } from "@mui/material";

const RenderCardio = ({e, index}) => {
  return (
    <div><Paper
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
      justifyContent="center"
      alignItems="center"
      sx={{
        marginBottom: 2,
      }}
    >
      <Grid item xs={12}>
        <Typography
          variant="h5"
          sx={{ color: "#3070af", padding: 2, borderRadius: 5 }}
        >
          {e.name}
        </Typography>
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
  </Paper></div>
  )
}

export default RenderCardio