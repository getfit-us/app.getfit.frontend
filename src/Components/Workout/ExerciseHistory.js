import Paper from "@mui/material/Paper";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useState } from "react";


const rows = [];
function findAllByKey(obj, keyToFind) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === "object"
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc,
    []
  );
}

//**********   add a chart showing recent history

//if you check the history on the same day of the history it will not show up correctly
//something not working needs to be checked

const ExerciseHistory = ({ exerciseHistory, currentExercise }) => {
  const [selected, setSelected] = useState(
    exerciseHistory[currentExercise]?.length - 1
  );



  if (Object.keys(exerciseHistory)?.length === 0) {
    return (
      <Paper elevation={5} sx={{ borderRadius: 10 }}>
        <h4 style={{ padding: 1, textAlign: "center" }}>
          {" "}
          No Exercise History Found
        </h4>
      </Paper>
    );
  }

  // extract dates from array
  let dates = exerciseHistory[currentExercise]?.map((exercise) => {
    return findAllByKey(exercise, "dateCompleted");
  });
  return (
    <>
      {" "}
      <Grid item xs={12}>
        <TextField
          select
          label="Date"
          defaultValue={exerciseHistory[currentExercise]?.length - 1}
          fullWidth
          onChange={(e) => {
            setSelected(e.target.value);
          }}
        >
          {exerciseHistory[currentExercise]?.map((exercise, index) => {
            return (
              <MenuItem key={index + 2} value={index}>
                {dates[index]}
              </MenuItem>
            );
          })}
        </TextField>
      </Grid>
      <Paper sx={{ padding: 1 }}>
        <div style={{ padding: 0 }}>
          <h3>{currentExercise}</h3>
          { exerciseHistory[currentExercise][selected]?.map((set, idx) => {
            return (
              <>
                <p key={idx}>
                  Set# {idx + 1} Weight: {set.weight}lbs Reps: {set.reps}
                </p>
              </>
            );
          })}
        </div>
        {/* <LineChart
          width={300}
          height={250}
          data={exerciseHistory[currentExercise][selected]}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="d" />
          <YAxis />
          <Tooltip />
          <Legend />
          {exerciseHistory[currentExercise][selected]?.map((set, idx) => {
            return (
              <>
          <Line type="monotone" dataKey={set.weight} stroke="#8884d8" />
          <Line type="monotone" dataKey={set.reps} stroke="#82ca9d" />
          
          </>)
          })}
        </LineChart> */}
      </Paper>
    </>
  );
};

export default ExerciseHistory;
