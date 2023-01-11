import { History } from "@mui/icons-material";
import {
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import IsolatedMenu from "../IsolatedMenu";

const RenderCardio = ({
  e,
  index,
  setStartWorkout,
  startWorkout,
  inStartWorkout,

  getHistory,
}) => {
  const handleExerciseOrder = (e) => {
    let _workout = JSON.parse(localStorage.getItem("startWorkout"));
    const currentExercise = _workout[0].exercises.splice(index, 1)[0];
    _workout[0].exercises.splice(e.target.value, 0, currentExercise);
    localStorage.setItem("startWorkout", JSON.stringify(_workout));
    setStartWorkout(_workout);
  };

  const handleLevelChange = (event, idx) => {
    const updated = JSON.parse(localStorage.getItem("startWorkout"));
    updated[0].exercises[index].numOfSets[idx].level = event.target.value;
    localStorage.setItem("startWorkout", JSON.stringify(updated));
  };

  const handleMinutesChange = (event, idx) => {
    const updated = JSON.parse(localStorage.getItem("startWorkout"));
    updated[0].exercises[index].numOfSets[idx].minutes = event.target.value;
    localStorage.setItem("startWorkout", JSON.stringify(updated));
  };

  const handleBpmChange = (event, idx) => {
    const updated = JSON.parse(localStorage.getItem("startWorkout"));
    updated[0].exercises[index].numOfSets[idx].heartRate = event.target.value;
    localStorage.setItem("startWorkout", JSON.stringify(updated));
  };

  const handleHistory = (index, exerciseId) => {
    const currButton = document.getElementById(`historyButton${index}`);
    const curInnerHtml = currButton.innerHTML;
    currButton.innerHTML = "Loading...";

    getHistory(exerciseId, `historyButton${index}`, curInnerHtml);
  };
  return (
    <Paper
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: ".5rem",
          position: "relative",
        }}
        key={e._id + "container div"}
      >
        <span
          key={e._id + "span"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",

            flexDirection: "column",
          }}
        >
          <h3
            style={{
              display: "inline-block",
              padding: ".5rem .5rem ",
              borderRadius: "10px",
              backgroundColor: "#34adff",
              backgroundImage:
                "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
              boxShadow: "0px 0px 6px 1px rgba(0,0,0,0.75)",
              maxWidth: "265px",
            }}
            key={e._id + "h3"}
          >
            {e.name}
          </h3>{" "}
          <IsolatedMenu
            setFunctionMainArray={setStartWorkout}
            mainArray={startWorkout}
            exercise={e}
            inStartWorkout={inStartWorkout}
          />
        </span>

        <TextField
          size="small"
          fullWidth
          select
          label="Exercise Order"
          value={index}
          onChange={handleExerciseOrder}
          style={{
            minWidth: "120px",
            maxWidth: "120px",
          }}
        >
          {startWorkout[0].exercises.map((position, posindex) => (
            <MenuItem key={posindex} value={posindex}>
              #{posindex + 1}
            </MenuItem>
          ))}
        </TextField>

        {e.numOfSets.map((num, idx) => {
          return (
            <div
              key={e._id + "div Container" + idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: ".3rem",
                marginBottom: "1rem",
                marginTop: "1rem",
              }}
            >
              <TextField
                key={e._id + "cardioInput"}
                name="level"
                size="small"
                type={"number"}
                variant="outlined"
                style={{
                  minWidth: "40px",
                }}
                label="Level"
                defaultValue={
                  startWorkout[0].exercises[index].numOfSets[idx].level
                }
                onChange={(event) => handleLevelChange(event, index)}
              />

              <TextField
                key={e._id + "cardioInputMinutes"}
                type="number"
                fullWidth
                name="time"
                size="small"
                variant="outlined"
                label="Time"
                style={{
                  minWidth: "100px",
                }}
                defaultValue={
                  startWorkout[0].exercises[index].numOfSets[idx].minutes
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Min</InputAdornment>
                  ),
                }}
                onChange={(event) => handleMinutesChange(event, index)}
              />

              <TextField
                key={e._id + "cardioInputHeartRate"}
                fullWidth
                type="number"
                variant="outlined"
                label="Heart Rate"
                size="small"
                name="heartRate"
                style={{
                  minWidth: "90px",
                }}
                defaultValue={
                  startWorkout[0].exercises[index].numOfSets[idx].heartRate
                }
                InputLabelProps={{ shrink: true, required: true }}
                onChange={(event) => handleBpmChange(event, index)}
              />
            </div>
          );
        })}
        <Button
          size="small"
          id={`historyButton${index}`}
          color="primary"
          variant="contained"
          endIcon={<History />}
          sx={{ borderRadius: 10, alignSelf: "center" }}
          onClick={() => handleHistory(index, e._id)}
        >
          History
        </Button>
      </div>
    </Paper>
  );
};

export default RenderCardio;
