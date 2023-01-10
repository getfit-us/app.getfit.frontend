import { Add, History } from "@mui/icons-material";
import { Button, Grid, MenuItem, Paper, TextField } from "@mui/material";
import IsolatedMenu from "../IsolatedMenu";
import RenderSets from "./RenderSets";

//this will be used to render the superset selection

const RenderSuperSet = ({
  superSet, // this is the nested superset array
  setFunctionMainArray,
  mainArray, // top level array
  inStartWorkout,
  superSetIndex,

  clientId,
  getHistory,
}) => {
  const handleOrderChange = (e) => {
    if (inStartWorkout) {
      let _workout = JSON.parse(localStorage.getItem("startWorkout"));
      const currentExercise = _workout[0].exercises.splice(superSetIndex, 1)[0];
      _workout[0].exercises.splice(e.target.value, 0, currentExercise);
      localStorage.setItem("startWorkout", JSON.stringify(_workout));
      setFunctionMainArray(_workout);
    } else {
      let _workout = JSON.parse(localStorage.getItem("NewWorkout"));
      const currentExercise = _workout.splice(superSetIndex, 1)[0];
      _workout.splice(e.target.value, 0, currentExercise);
      localStorage.setItem("NewWorkout", JSON.stringify(_workout));
      setFunctionMainArray(_workout);
    }
  };

  const handleAddSet = (exerciseIndex) => {
    setFunctionMainArray((prev) => {
      let updated = [];
      if (inStartWorkout) {
        updated = JSON.parse(localStorage.getItem("startWorkout"));
        const item = updated[0].exercises[superSetIndex][exerciseIndex];
        item.numOfSets.push({ weight: "", reps: "" });
        updated[0].exercises[superSetIndex][exerciseIndex] = item;
        localStorage.setItem("startWorkout", JSON.stringify(updated));
      } else {
        updated = JSON.parse(localStorage.getItem("NewWorkout"));

        const item = updated[superSetIndex][exerciseIndex];
        item.numOfSets.push({ weight: "", reps: "" });
        updated[superSetIndex][exerciseIndex] = item;
        localStorage.setItem("NewWorkout", JSON.stringify(updated));
      }

      return updated;
    });
  };

  const handleGetHistory = (exericseId, exerciseIndex) => {
    const currButton = document.getElementById(
      `historyButton${superSetIndex}${exerciseIndex}`
    );
    const curInnerHtml = currButton.innerHTML;
    currButton.innerHTML = "Loading...";
    getHistory(
      exericseId,
      `historyButton${superSetIndex}${exerciseIndex}`,
      curInnerHtml
    );
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
        width: { xs: "100%", sm: "100%", md: "60%" },
      }}
    >
      <div>
        <h3>SuperSet</h3>
        <TextField
          size="small"
          fullWidth
          select
          label="SuperSet Order"
          value={superSetIndex}
          onChange={handleOrderChange}
          style={{
            minWidth: "120px",
            maxWidth: "120px",
            marginBottom: "1rem",
          }}
        >
          {inStartWorkout
            ? mainArray[0].exercises.map((position, posindex) => (
                <MenuItem key={"exercise order" + posindex} value={posindex}>
                  #{posindex + 1}
                </MenuItem>
              ))
            : mainArray.map((position, posindex) => (
                <MenuItem key={"exercise order" + posindex} value={posindex}>
                  #{posindex + 1}
                </MenuItem>
              ))}
        </TextField>

        {superSet.map((exercise, exerciseIndex) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                flexDirection: "column",
                gap: ".5rem",
                position: "relative",
                marginTop: "1rem",
              }}
              key={"exercise" + exercise._id}
            >
              <span
                key={"span" + exercise._id}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "1rem",
                  marginTop: "1rem",
                  
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    display: "inline-block ",
                    padding: ".5rem .5rem ",
                    borderRadius: "10px",
                    backgroundColor: "#34adff",
                    backgroundImage:
                      "-webkit-linear-gradient(150deg, #34adff 35%, #4cbfff 35%)",
                    boxShadow: "0px 0px 6px 1px rgba(0,0,0,0.75)",
                    maxWidth: "290px",
                  }}
                >
                  {exercise.name}{" "}
                </h3>
                <IsolatedMenu
                  setFunctionMainArray={setFunctionMainArray}
                  inSuperSet={inSuperSet}
                  superSet={superSet}
                  mainArray={mainArray}
                  superSetIndex={superSetIndex}
                  inStartWorkout={inStartWorkout}
                  exercise={exercise}
                  key={"exercise isolated menu" + exercise._id}
                />{" "}
              </span>

              {/* add dynamic fields */}
              <RenderSets
                exercise={exercise}
                setFunctionMainArray={setFunctionMainArray}
                superSetIndex={superSetIndex}
                inStartWorkout={inStartWorkout}
                exerciseIndex={exerciseIndex}
                key={"exercise render sets" + exercise._id}
              />
              <div
                style={{
                  display: "flex",

                  alignItems: "center",
                  gap: ".5rem",
                }}
                key={"exercise button container" + exercise._id}
              >
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<Add />}
                  sx={{ borderRadius: 10 }}
                  onClick={() => handleAddSet(exerciseIndex)}
                  key={"exercise add set" + exercise._id}
                >
                  Add Set
                </Button>
                {inStartWorkout && (
                  <Button
                    id={`historyButton${superSetIndex}${exerciseIndex}`}
                    size="small"
                    color={"primary"}
                    variant="contained"
                    endIcon={<History />}
                    sx={{ borderRadius: 10 }}
                    onClick={() =>
                      handleGetHistory(exercise._id, exerciseIndex)
                    }
                    key={"exercise history button" + exercise._id}
                  >
                    History
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Paper>
  );
};

export default RenderSuperSet;
