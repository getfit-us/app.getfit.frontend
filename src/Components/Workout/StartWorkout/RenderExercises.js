import { Add, History } from "@mui/icons-material";
import {
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Switch,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
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
  const [type, setType] = useState("number");

  const generateChartData = useCallback((exerciseHistory) => {
    if (!exerciseHistory) return;
    let numbers = /\d+/g;
    let currentData = new Map();
    let chartData = [];

    let temp =
      exerciseHistory?.history?.map((history, index) => {
        //each history is an exercise completed on a specific date
        //loop over each set and find max weight and reps for that date

        let maxWeight = 0;
        let reps = 0;
        let minutes = 0;
        let heartRate = 0;
        let level = 0;

        //if exercise type is cardio
        if (history.type === "cardio") {
          let set = history.numOfSets[0];

          //extract number from beginning of string
          minutes = set.minutes;
          heartRate = set.heartRate;
          level = set.level;

          //if weight and reps are not undefined and index is less than 15 (only going to chart the last 15 top sets)
          if (index <= 20) {
            chartData.push({
              date: new Date(history.dateCompleted).toLocaleDateString(),
              minutes: minutes !== undefined || minutes !== "" ? minutes : 0,
              heartRate: heartRate !== undefined ? heartRate : 0,
              level: level !== undefined ? level : 0,
            });
          } else {
            return false;
          }
        } else {
          //find max weight and save reps from that set
          history.numOfSets.forEach((set, i) => {
            //extract top weight and reps from all the sets for that exercise on that date

            if (
              set.weight &&
              set.weight !== "" &&
              set.weight.match(numbers) > maxWeight
            ) {
              maxWeight = set.weight.match(numbers)[0];
              reps = set.reps;
            }
            //if we have weight and reps that are not undefined then we will add them to our map with the date as the key
            if (
              maxWeight !== 0 &&
              reps !== 0 &&
              i === history.numOfSets.length - 1
            ) {
              if (
                !currentData.has(
                  new Date(history.dateCompleted).toLocaleDateString()
                )
              ) {
                currentData.set(
                  new Date(history.dateCompleted).toLocaleDateString(),
                  {
                    weight: maxWeight,
                    reps: reps,
                  }
                );
                chartData.push({
                  date: new Date(history.dateCompleted).toLocaleDateString(),
                  weight: maxWeight,
                  reps: reps,
                });
              }
            }
          });
        }

        //if our map has more then 15 entries we will exit the loop
        if (currentData.size > 20) {
          return false;
        }
      }) || {};

    return chartData;
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
            key={exercise[0]._id + "superset"}
           
          />
        ) : exercise.type === "cardio" ? ( // going to show a different output for cardio
          <RenderCardio
            e={exercise}
            index={index}
            setStartWorkout={setStartWorkout}
            startWorkout={startWorkout}
            inStartWorkout={inStartWorkout}
            key={exercise._id + "cardio"}
            clientId={clientId}
            getHistory={getHistory}
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
              maxWidth: { xs: "100%", sm: "100%", md: "60%", lg: "600px" },
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
                width: "100%",
              }}
              key={exercise._id + "container div"}
            >
              <span
                key={exercise._id + "span"}
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
                    textAlign: "center",
                  }}
                  key={exercise._id + "h3"}
                >
                  {exercise.name}
                </h3>{" "}
                <IsolatedMenu
                  setFunctionMainArray={setStartWorkout}
                  mainArray={startWorkout}
                  exercise={exercise}
                  inStartWorkout={inStartWorkout}
                  key={exercise._id + "isolated menu"}
                />
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  gap: "1rem",
                }}
                key={exercise._id + "div change order"}
              >
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
                  key={exercise._id + "exercise Order"}
                >
                  {startWorkout[0].exercises.map((position, posindex) => (
                    <MenuItem key={posindex} value={posindex}>
                      #{posindex + 1}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={<Switch defaultChecked
                      value={type}
                      onChange={(e) => setType(e.target.checked)}
                    />}
                  label="Numeric Input"
                />
              </div>
              {/* map sets */}
              <RenderSets
                exercise={exercise}
                index={index}
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
                key={exercise._id + "render sets"}
                type={type}
              />
              <div
                style={{
                  display: "flex",

                  alignItems: "center",
                  gap: ".5rem",
                }}
                key={exercise._id + "button div"}
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
