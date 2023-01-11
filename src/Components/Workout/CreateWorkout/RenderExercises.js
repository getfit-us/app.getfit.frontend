import { Add, DeleteForever } from "@mui/icons-material";
import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import IsolatedMenu from "../IsolatedMenu";
import RenderSuperSet from "../SuperSet/RenderSuperSet";
import Cardio from "./Cardio";
import RenderSets from "./RenderSets";

const RenderExercises = ({ addExercise, setAddExercise }) => {

  const handleExerciseOrder = (e, index) => {
    let _workout = JSON.parse(localStorage.getItem("NewWorkout"));
    const currentExercise = _workout.splice(index, 1)[0];
    _workout.splice(e.target.value, 0, currentExercise);
    localStorage.setItem("NewWorkout", JSON.stringify(_workout));
    setAddExercise(_workout);
  };

  const handleAddSet = (index) => {
    const updated = JSON.parse(localStorage.getItem("NewWorkout"));

    setAddExercise((prev) => {
      const item = updated[index];
      item.numOfSets.push({ weight: "", reps: "" });
      updated[index] = {
        ...item,
      };
      localStorage.setItem("NewWorkout", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      {addExercise?.map((exercise, index) => {
        // check if the exercise is a superset array of exercises
        return Array.isArray(exercise) ? (
          <RenderSuperSet
            superSet={exercise} //this is the nested array of exercises for the superset
            setFunctionMainArray={setAddExercise}
            mainArray={addExercise} // this is the main state array top level........................
            inStartWorkout={false}
            superSetIndex={index}
          />
        ) : exercise.type === "cardio" ? ( // going to show a different output for cardio
          <Cardio
            exercise={exercise}
            index={index}
            setAddExercise={setAddExercise}
            addExercise={addExercise}
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
                </h3>

                <IsolatedMenu
                  setFunctionMainArray={setAddExercise}
                  mainArray={addExercise}
                  exercise={exercise}
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
                onChange={(e) => handleExerciseOrder(e,index)}
              >
                {addExercise.map((position, posindex) => (
                  <MenuItem key={posindex} value={posindex}>
                    #{posindex + 1}
                  </MenuItem>
                ))}
              </TextField>

              {/* add dynamic fields */}
              <RenderSets
                exercise={exercise}
                index={index}
                addExercise={addExercise}
                setAddExercise={setAddExercise}
              />

              <Button
                variant="contained"
                sx={{ borderRadius: 10, ml: 2 }}
                endIcon={<Add />}
                size="small"
                onClick={() => handleAddSet(index)}
              >
                Set
              </Button>
            </div>
          </Paper>
        );
      })}
    </>
  );
};

export default RenderExercises;
