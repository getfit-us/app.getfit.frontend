import { Add, DeleteForever, History } from "@mui/icons-material";
import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import IsolatedMenu from "../IsolatedMenu";
import ExerciseHistory from "../Modals/ExerciseHistory";
import RenderSets from "./RenderSets";

//this will be used to render the superset selection

const RenderSuperSet = ({
  superSet, // this is the nested superset array
  setFunctionMainArray,
  mainArray, // top level array
  inStartWorkout,
  superSetIndex,
  exerciseHistory,
  clientId,
  getHistory,
  setModalHistory,
  modalHistory,
  status,
}) => {
  // create local state for superset inputs for controlled inputs
  const [superSetState, setSuperSetState] = useState({});

  const inSuperSet = true;
  return (
    <>
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
          <Grid item xs={4} sm={3}>
            <h3>SuperSet</h3>
            <TextField
              size="small"
              fullWidth
              select
              label="Exercise Order"
              value={superSetIndex}
              onChange={(e) => {
                if (inStartWorkout) {
                  let _workout = JSON.parse(
                    localStorage.getItem("startWorkout")
                  );
                  const currentExercise = _workout[0].exercises.splice(
                    superSetIndex,
                    1
                  )[0];
                  _workout[0].exercises.splice(
                    e.target.value,
                    0,
                    currentExercise
                  );
                  localStorage.setItem(
                    "startWorkout",
                    JSON.stringify(_workout)
                  );
                  setFunctionMainArray(_workout);
                } else {
                  let _workout = JSON.parse(localStorage.getItem("NewWorkout"));
                  const currentExercise = _workout.splice(superSetIndex, 1)[0];
                  _workout.splice(e.target.value, 0, currentExercise);
                  localStorage.setItem("NewWorkout", JSON.stringify(_workout));
                  setFunctionMainArray(_workout);
                }
              }}
            >
              {inStartWorkout
                ? mainArray[0].exercises.map((position, posindex) => (
                    <MenuItem key={posindex} value={posindex}>
                      #{posindex + 1}
                    </MenuItem>
                  ))
                : mainArray.map((position, posindex) => (
                    <MenuItem key={posindex} value={posindex}>
                      #{posindex + 1}
                    </MenuItem>
                  ))}
            </TextField>
          </Grid>

          {superSet.map((exercise, exerciseIndex) => {
            return (
              <>
                <ExerciseHistory
                  setModalHistory={setModalHistory}
                  modalHistory={modalHistory}
                  exerciseHistory={exerciseHistory}
                  status={status}
                  clientId={clientId}
                />
                <Grid item xs={12} sx={{ position: "relative" }}>
                  <h3>{exercise.name}</h3>

                  <IsolatedMenu
                    setFunctionMainArray={setFunctionMainArray}
                    inSuperSet={inSuperSet}
                    superSet={superSet}
                    mainArray={mainArray}
                    superSetIndex={superSetIndex}
                    inStartWorkout={inStartWorkout}
                    exercise={exercise}
                  />
                </Grid>

                {/* add dynamic fields */}
                <RenderSets
                  exercise={exercise}
                  setFunctionMainArray={setFunctionMainArray}
                  superSetIndex={superSetIndex}
                  inStartWorkout={inStartWorkout}
                  exerciseIndex={exerciseIndex}
                />

                <Grid item lg={4} sm={3} sx={{ alignContent: "center" }}>
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<Add />}
                    sx={{ borderRadius: 10 }}
                    onClick={() => {
                      setFunctionMainArray((prev) => {
                        let updated = [];
                        if (inStartWorkout) {
                          updated = JSON.parse(
                            localStorage.getItem("startWorkout")
                          );
                          const item =
                            updated[0].exercises[superSetIndex][exerciseIndex];
                          item.numOfSets.push({ weight: "", reps: "" });
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
                          item.numOfSets.push({ weight: "", reps: "" });
                          updated[superSetIndex][exerciseIndex] = item;
                          localStorage.setItem(
                            "NewWorkout",
                            JSON.stringify(updated)
                          );
                        }

                        return updated;
                      });
                    }}
                  >
                    Set
                  </Button>
                </Grid>
                {inStartWorkout && (
                  <>
                    <Grid item lg={4} sx={{ alignContent: "center" }}>
                      <Button
                        id={`historyButton${superSetIndex}${exerciseIndex}`}
                        size="small"
                        color={"primary"}
                        variant="contained"
                        endIcon={<History />}
                        sx={{ borderRadius: 10 }}
                        onClick={() => {
                          const currButton = document.getElementById(
                            `historyButton${superSetIndex}${exerciseIndex}`
                          );
                          const curInnerHtml = currButton.innerHTML;
                          currButton.innerHTML = "Loading...";
                          getHistory(
                            exercise._id,
                            `historyButton${superSetIndex}${exerciseIndex}`,
                            curInnerHtml
                          );
                        }}
                      >
                        History
                      </Button>
                    </Grid>
                  </>
                )}
              </>
            );
          })}
        </Grid>
      </Paper>
    </>
  );
};

export default RenderSuperSet;
