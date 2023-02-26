import { DeleteForever } from "@mui/icons-material";
import {  InputAdornment, TextField } from "@mui/material";
import React from "react";

const RenderSets = ({
  exercise,
  superSetIndex,
  inStartWorkout,
  exerciseIndex,
  setFunctionMainArray,
  type
}) => {
  const handleDeleteSet = () => {
    // this is inside a superset so we need to go deeper
    // find corresponding superset

    setFunctionMainArray((prev) => {
      let updated = [];
      if (inStartWorkout) {
        updated = JSON.parse(localStorage.getItem("startWorkout"));
        const item = updated[0].exercises[superSetIndex][exerciseIndex];
        item.numOfSets.splice(exerciseIndex, 1);
        updated[0].exercises[superSetIndex][exerciseIndex] = item;
        localStorage.setItem("startWorkout", JSON.stringify(updated));
      } else {
        updated = JSON.parse(localStorage.getItem("NewWorkout"));
        const item = updated[superSetIndex][exerciseIndex];
        item.numOfSets.splice(exerciseIndex, 1);
        updated[superSetIndex][exerciseIndex] = item;
        localStorage.setItem("NewWorkout", JSON.stringify(updated));
      }

      return updated;
    });
  };

  const handleRepsChange = (event, setIndex) => {
    if (inStartWorkout) {
      const updated = JSON.parse(localStorage.getItem("startWorkout"));
      updated[0].exercises[superSetIndex][exerciseIndex].numOfSets[
        setIndex
      ].reps = event.target.value;
      localStorage.setItem("startWorkout", JSON.stringify(updated));
    } else {
      const updated = JSON.parse(localStorage.getItem("NewWorkout"));
      updated[superSetIndex][exerciseIndex].numOfSets[setIndex].reps =
        event.target.value;
      localStorage.setItem("NewWorkout", JSON.stringify(updated));
    }
  };

  const handleWeightChange = (event, setIndex) => {
    if (inStartWorkout) {
      const updated = JSON.parse(localStorage.getItem("startWorkout"));
      updated[0].exercises[superSetIndex][exerciseIndex].numOfSets[
        setIndex
      ].weight = event.target.value;
      localStorage.setItem("startWorkout", JSON.stringify(updated));
    } else {
      const updated = JSON.parse(localStorage.getItem("NewWorkout"));
      updated[superSetIndex][exerciseIndex].numOfSets[setIndex].weight =
        event.target.value;
      localStorage.setItem("NewWorkout", JSON.stringify(updated));
    }
  };

  return (
    <>
      {exercise.numOfSets.map((num, setIndex) => {
        return (
          <div
            key={exercise._id + "div Container" + setIndex}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: ".3rem",
            }}
          >
            <TextField
              type="input"
              variant="outlined"
              label="Set"
              style={{
                minWidth: "50px",
              }}
              name={`Set${setIndex}`}
              value={setIndex + 1}
              size="small"
              key={setIndex + "set input" + exercise._id}
            />

            <TextField
               type={type ? "number" : "text"}
              key={setIndex + "weight input" + exercise._id}
              fullWidth
              name="weight"
              variant="outlined"
              autoComplete="off"
              label="Weight"
              size="small"
              style={{
                minWidth: "90px",
              }}
              defaultValue={num.weight}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">lb</InputAdornment>
                ),
              }}
              onChange={(event) => handleWeightChange(event, setIndex)}
            />

            <TextField
              key={setIndex + exercise._id + "reps"}
              fullWidth
              type={type ? "number" : "text"}
              variant="outlined"
              label="Reps"
              name="reps"
              style={{
                minWidth: "60px",
              }}
              size="small"
              autoComplete="off"
              defaultValue={num.reps}
              onChange={(e) => handleRepsChange(e, setIndex)}
            />

            {setIndex >= 1 ? (
              <DeleteForever
                key={setIndex + exercise._id + "delete icon"}
                onClick={() => handleDeleteSet()}
                sx={{ color: "#db4412", cursor: "pointer" }}
              />
            ) : (
              <DeleteForever
                onClick={() => handleDeleteSet()}
                sx={{
                  color: "#db4412",
                  cursor: "pointer",
                  visibility: "hidden",
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default RenderSets;
