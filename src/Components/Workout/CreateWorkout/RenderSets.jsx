import { DeleteForever } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

//render sets

const RenderSets = ({ exercise, index, setAddExercise, addExercise }) => {
  const handleWeightChange = (event, index, idx) => {
    const updated = JSON.parse(localStorage.getItem("NewWorkout"));
    updated[index].numOfSets[idx].weight = event.target.value;
    localStorage.setItem("NewWorkout", JSON.stringify(updated));
  };

  const handleRepsChange = (event, index, idx) => {
    const updated = JSON.parse(localStorage.getItem("NewWorkout"));
    updated[index].numOfSets[idx].reps = event.target.value;
    localStorage.setItem("NewWorkout", JSON.stringify(updated));
  };

  const handleDeleteSet = (index, idx) => {
    const updated = JSON.parse(localStorage.getItem("NewWorkout"));
    setAddExercise((prev) => {
      //make copy of array of objects
      //remove array set and replace object in array and set state

      const item = updated[index];

      item.numOfSets.splice(idx, 1);
      updated[index] = {
        ...item,
      };
      localStorage.setItem("NewWorkout", JSON.stringify(updated));
      return updated;
    });
  };

  const [type, setType] = useState("text");

  return exercise.numOfSets.map((set, idx) => {
    return (
      <div
        key={exercise._id + "div Container" + idx}
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
          size="small"
          name={`Set${idx}`}
          value={idx + 1}
        />

        <TextField
          fullWidth
          name="weight"
          type={type === "text" ? "text" : "number"}
          size="small"
          autoComplete="off"
          variant="outlined"
          defaultValue={addExercise[index].numOfSets[idx].weight}
          label="Weight"
          style={{
            minWidth: "90px",
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">lb</InputAdornment>,
          }}
          onChange={(event) => handleWeightChange(event, index, idx)}
        />

        <TextField
          fullWidth
          type={type === "text" ? "text" : "number"}
          defaultValue={addExercise[index].numOfSets[idx].reps}
          variant="outlined"
          label="Reps"
          autoComplete="off"
          name="reps"
          size="small"
          style={{
            minWidth: "60px",
          }}
          onChange={(event) => handleRepsChange(event, index, idx)}
        />

        {idx >= 1 ? (
          <DeleteForever
            onClick={() => handleDeleteSet(index, idx)}
            sx={{ color: "#db4412", cursor: "pointer" }}
          />
        ) : (
          <DeleteForever style={{ visibility: "hidden" }} />
        )}
      </div>
    );
  });
};

export default RenderSets;
