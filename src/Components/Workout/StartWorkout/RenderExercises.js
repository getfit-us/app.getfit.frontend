import { Add,  History } from "@mui/icons-material";
import {
  Button,
  Grid,
  
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useProfile } from "../../../Store/Store";
import IsolatedMenu from "../IsolatedMenu";
import ExerciseHistory from "../Modals/ExerciseHistory";
import RenderSuperSet from "../SuperSet/RenderSuperSet";
import RenderCardio from "./RenderCardio";
import RenderSets from "./RenderSets";

const RenderExercises = ({
  startWorkout,
  setStartWorkout,
  clientId,
  status,
  setStatus
}) => {
  const [exerciseHistory, setExerciseHistory] = useState(null);
  const [modalHistory, setModalHistory] = useState(false);
  const inStartWorkout = true;
  const profileClientId = useProfile((state) => state.profile.clientId);
  const axiosPrivate = useAxiosPrivate();
  const handleOpenHistoryModal = () => setModalHistory(true);



  const getHistory = async (exerciseId, buttonId, curInnerHtml) => {
    const currButton = document.getElementById(buttonId);

    const controller = new AbortController();
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axiosPrivate.get(
        `/clients/history/${
          clientId ? clientId : profileClientId
        }/${exerciseId}
          `,
        {
          signal: controller.signal,
        }
      );
      setExerciseHistory(response.data);
      setStatus((prev) => ({ ...prev, loading: false }));
      currButton.innerHTML = curInnerHtml;
      handleOpenHistoryModal();
      // reset();
    } catch (err) {
      console.log(err);
      if (err?.response.status === 404) {
        // if not found display not found on button
        setStatus({
          error: "404",
          message: "No History found",
          loading: false,
          success: false,
        });
        currButton.innerHTML = "Nothing Found";

        setTimeout(() => {
          // reset button after 2sec
          currButton.innerHTML = curInnerHtml;
          setStatus({
            error: false,
            message: "",
            loading: false,
            success: false,
          });
        }, 2000);
      } else {
        //display error please try again
        currButton.innerHTML = "Error Try Again";
        setTimeout(() => {
          // reset button after 2sec
          currButton.innerHTML = curInnerHtml;
          setStatus({
            error: false,
            message: "",
            loading: false,
            success: false,
          });
        }, 2000);
      }

      setStatus((prev) => ({ ...prev, loading: false }));
      return () => {
        controller.abort();
      };
    }
  };
  return (
    <>
      <ExerciseHistory
        setModalHistory={setModalHistory}
        modalHistory={modalHistory}
        exerciseHistory={exerciseHistory}
        clientId={clientId}
        status={status}
      />
      <Grid container sx={{ justifyContent: "center" }}>
        {" "}
        {startWorkout[0]?.exercises?.map((exercise, index) => {
          return Array.isArray(exercise) ? (
            <RenderSuperSet
              superSet={exercise} //this is the nested array of exercises for the superset
              setFunctionMainArray={setStartWorkout}
              mainArray={startWorkout} // this is the main state array top level........................
              inStartWorkout={inStartWorkout}
              superSetIndex={index} //}
              getHistory={getHistory}
              exerciseHistory={exerciseHistory}
              status={status}
              clientId={clientId}
              setModalHistory={setModalHistory}
              modalHistory={modalHistory}
            />
          ) : exercise.type === "cardio" ? ( // going to show a different output for cardio
            <RenderCardio
              e={exercise}
              index={index}
              setStartWorkout={setStartWorkout}
              startWorkout={startWorkout}
              inStartWorkout={inStartWorkout}
            />
          ) : (
            <Paper
              elevation={4}
              sx={{
                padding: 2,
                mt: 1,
                mb: 1,
                borderRadius: 10,
                width: { xs: "100%", sm: "100%", md: "60%" },
              }}
              key={exercise._id}
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
                  <h3>{exercise.name}</h3>

                  <IsolatedMenu
                    setFunctionMainArray={setStartWorkout}
                    mainArray={startWorkout}
                    exercise={exercise}
                    inStartWorkout={inStartWorkout}
                  />
                  <Grid item xs={4} sm={3}>
                    {" "}
                    <TextField
                      size="small"
                      fullWidth
                      select
                      label="Exercise Order"
                      value={index}
                      onChange={(e) => {
                        let _workout = JSON.parse(
                          localStorage.getItem("startWorkout")
                        );
                        const currentExercise = _workout[0].exercises.splice(
                          index,
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
                        setStartWorkout(_workout);
                      }}
                    >
                      {startWorkout[0].exercises.map((position, posindex) => (
                        <MenuItem key={posindex} value={posindex}>
                          #{posindex + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                {/* map sets */}
                <RenderSets
                  exercise={exercise}
                  index={index}
                  setStartWorkout={setStartWorkout}
                  startWorkout={startWorkout}
                />

                <Grid item lg={4} sm={3}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 10, pr: 1 }}
                    endIcon={<Add />}
                    onClick={() => {
                      //Update Num of sets for exercise
                      //use local state for component to store form data. save button will update global state or just send to backend
                      setStartWorkout((prev) => {
                        const updated = JSON.parse(
                          localStorage.getItem("startWorkout")
                        );
                        updated[0].exercises[index].numOfSets.push({
                          weight: "",
                          reps: "",
                          completed: false,
                        });
                        localStorage.setItem(
                          "startWorkout",
                          JSON.stringify(updated)
                        );
                        return updated;
                      });
                    }}
                  >
                    Set
                  </Button>
                </Grid>
                <Grid item lg={4}>
                  <Button
                    size="small"
                    id={`historyButton${index}`}
                    color="primary"
                    variant="contained"
                    endIcon={<History />}
                    sx={{ borderRadius: 10 }}
                    onClick={() => {
                      const currButton = document.getElementById(
                        `historyButton${index}`
                      );
                      const curInnerHtml = currButton.innerHTML;
                      currButton.innerHTML = "Loading...";

                      getHistory(
                        exercise._id,
                        `historyButton${index}`,
                        curInnerHtml
                      );
                    }}
                  >
                    History
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </Grid>
    </>
  );
};

export default RenderExercises;
