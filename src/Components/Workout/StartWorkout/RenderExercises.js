import { Add, History } from "@mui/icons-material";
import { Button, Grid, MenuItem, Paper, TextField } from "@mui/material";
import { useCallback } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useProfile, useWorkouts } from "../../../Store/Store";
import IsolatedMenu from "../IsolatedMenu";
import RenderSuperSet from "../SuperSet/RenderSuperSet";
import RenderCardio from "./RenderCardio";
import RenderSets from "./RenderSets";

const RenderExercises = ({
  startWorkout,
  setStartWorkout,
  clientId,
  status,
  setStatus,
  handleModalHistory,
}) => {
  const inStartWorkout = true;
  const profileClientId = useProfile((state) => state.profile.clientId);
  const axiosPrivate = useAxiosPrivate();
  const setExerciseHistory = useWorkouts((state) => state.setExerciseHistory);

  const generateChartData = useCallback((exerciseHistory) => {
    if (!exerciseHistory) return;
    let numbers = /^[0-9]+$/;
    let _chartData =
      exerciseHistory?.history?.map((history, index) => {
        let maxWeight = 0;
        let reps = 0;

        //find max weight and save reps from that set
        history.numOfSets.forEach((set) => {
          //extract number from beginning of string

          //fix for when weight is not a number or is undefined
          if (set.weight && parseInt(set?.weight?.split(" ")[0]) > maxWeight) {
            maxWeight = parseInt(set?.weight?.split(" ")[0]);
            reps = set.reps;
          }
        });
        //if weight and reps are not undefined and index is less than 15
        if (
          (maxWeight && reps) !== undefined &&
          (maxWeight && reps) !== 0 &&
          index < 15
        ) {
          return {
            date: new Date(history.dateCompleted).toLocaleDateString(),
            weight: maxWeight,

            reps: reps,
          };
        }
      }) || {};

    return _chartData;
  }, []);

  const getHistory = async (exerciseId, buttonId, curInnerHtml) => {
    const currButton = document.getElementById(buttonId);

    const controller = new AbortController();
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      const response = await axiosPrivate.get(
        `/clients/history/${clientId ? clientId : profileClientId}/${exerciseId}
          `,
        {
          signal: controller.signal,
        }
      );
      const chartData = generateChartData(response.data);
      setExerciseHistory({ ...response.data, chartData });
      setStatus((prev) => ({ ...prev, loading: false }));
      currButton.innerHTML = curInnerHtml;
      handleModalHistory();
      // reset();
    } catch (err) {
      console.log(err);
      if (err?.response?.status === 404) {
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

  const handleExerciseOrder = (e, index) => {
    let _workout = JSON.parse(localStorage.getItem("startWorkout"));
    const currentExercise = _workout[0].exercises.splice(index, 1)[0];
    _workout[0].exercises.splice(e.target.value, 0, currentExercise);
    localStorage.setItem("startWorkout", JSON.stringify(_workout));
    setStartWorkout(_workout);
  };

  const handleAddSet = (index) => {
    setStartWorkout((prev) => {
      const updated = JSON.parse(localStorage.getItem("startWorkout"));
      updated[0].exercises[index].numOfSets.push({
        weight: "",
        reps: "",
        completed: false,
      });
      localStorage.setItem("startWorkout", JSON.stringify(updated));
      return updated;
    });
  };

  const handleHistory = (index, exerciseId) => {
    const currButton = document.getElementById(`historyButton${index}`);
    const curInnerHtml = currButton.innerHTML;
    currButton.innerHTML = "Loading...";

    getHistory(exerciseId, `historyButton${index}`, curInnerHtml);
  };

  return (
    <>
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
            status={status}
            clientId={clientId}
            key={exercise[0]._id + 'superset'}
          />
        ) : exercise.type === "cardio" ? ( // going to show a different output for cardio
          <RenderCardio
            e={exercise}
            index={index}
            setStartWorkout={setStartWorkout}
            startWorkout={startWorkout}
            inStartWorkout={inStartWorkout}
            key={exercise._id + 'cardio'}
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                flexDirection: "column",
                gap: ".5rem",
                position: "relative",
              }}
              key={exercise._id + 'container div'}
            >
              <span key={exercise._id + 'span'}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "1rem",

                  flexDirection: 'column',
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
                  key={exercise._id + 'h3'}
                >
                  {exercise.name}
                </h3>{" "}
                <IsolatedMenu
                  setFunctionMainArray={setStartWorkout}
                  mainArray={startWorkout}
                  exercise={exercise}
                  inStartWorkout={inStartWorkout}
                  key={exercise._id + 'isolated menu'}
                />
              </span>
              <TextField
                size="small"
                fullWidth
                select
                label="Exercise Order"
                value={index}
                style={{
                  minWidth: "120px",
                  maxWidth: "120px",
                }}
                onChange={(e) => handleExerciseOrder(e, index)}
                key={exercise._id + 'exercise Order'}
              >
                {startWorkout[0].exercises.map((position, posindex) => (
                  <MenuItem key={posindex} value={posindex}>
                    #{posindex + 1}
                  </MenuItem>
                ))}
              </TextField>
              {/* map sets */}
              <RenderSets
                exercise={exercise}
                index={index}
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
                key={exercise._id + 'render sets'}
              />
              <div
                style={{
                  display: "flex",

                  alignItems: "center",
                  gap: ".5rem",
                }}
                key={exercise._id + 'button div'}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: 10, pr: 1 }}
                  endIcon={<Add />}
                  onClick={() => handleAddSet(index)}
                >
                  Add Set
                </Button>
                <Button
                  size="small"
                  id={`historyButton${index}`}
                  color="primary"
                  variant="contained"
                  endIcon={<History />}
                  sx={{ borderRadius: 10 }}
                  onClick={() => handleHistory(index, exercise._id)}
                >
                  History
                </Button>
              </div>
            </div>
          </Paper>
        );
      })}
    </>
  );
};

export default RenderExercises;
