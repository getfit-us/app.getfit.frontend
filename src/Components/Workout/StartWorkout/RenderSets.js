import { DeleteForever } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";

const RenderSets = ({ exercise, index, setStartWorkout, startWorkout }) => {
  const handleChangeWeight = (e, index, i) => {
    //update changes to local storage
    const updated = JSON.parse(localStorage.getItem("startWorkout"));

    updated[0].exercises[index].numOfSets[i].weight = e.target.value;
    localStorage.setItem("startWorkout", JSON.stringify(updated));
  };

  const handleChangeReps = (e, index, i) => {
    //update changes to local storage

    const updated = JSON.parse(localStorage.getItem("startWorkout"));

    updated[0].exercises[index].numOfSets[i].reps = e.target.value;
    localStorage.setItem("startWorkout", JSON.stringify(updated));
  };

  const handleDeleteSet = (index, i) => {
    setStartWorkout((prev) => {
      let updated = JSON.parse(localStorage.getItem("startWorkout"));
      const selectedExercise = updated[0].exercises[index];

      selectedExercise.numOfSets.splice(i, 1);
      updated[0].exercises[index] = selectedExercise;
      localStorage.setItem("startWorkout", JSON.stringify(updated));

      return updated;
    });
  };

  return (
    <>
      {exercise.numOfSets.map((set, i) => {
        return (
          <div
            key={exercise._id + "div Container" + i}
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
              name={`Set`}
              value={i + 1}
              size="small"
            />

            <TextField
              type="input"
              variant="outlined"
              label="Weight"
              fullWidth
              name="weight"
              autoComplete="off"
              defaultValue={
                startWorkout[0].exercises[index].numOfSets[i].weight
              }
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">lb</InputAdornment>
                ),
              }}
              onChange={(e) => handleChangeWeight(e, index, i)}
              style={{
                minWidth: "90px",
              }}
            />

            <TextField
              type="text"
              variant="outlined"
              label="Reps"
              autoComplete="off"
              fullWidth
              name="reps"
              size="small"
              style={{
                minWidth: "60px",
              }}
              defaultValue={startWorkout[0].exercises[index].numOfSets[i].reps}
              onChange={(e) => handleChangeReps(e, index, i)}
            />

            {i >= 1 ? (
              <DeleteForever
                onClick={() => handleDeleteSet(index, i)}
                sx={{ color: "#db4412", cursor: "pointer" }}
              />
            ) : (
              <DeleteForever
                onClick={() => handleDeleteSet(index, i)}
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
