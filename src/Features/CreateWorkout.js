import { Button, Grid } from "@mui/material";
import { useState, useTheme } from "react";
import AddExerciseForm from "../Components/AddExerciseForm";
import useProfile from "../utils/useProfile";
import SingleExerciseForm from "../Components/SingleExerciseForm";

const CreateWorkout = ({ newWorkoutName }) => {
  const { state, dispatch } = useProfile();
  const [showTabs, setShowTabs] = useState(false);
  const [addExercise, setAddExercise] = useState([]);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
    },
    buttonExercise: {
      borderRadius: "10px",
    },
  };

  return (
    <Grid container style={styles.container} sx={{ marginTop: 10 }}>
      <Grid item style={styles.header}>
        <h3> {newWorkoutName}</h3>
      </Grid>
      {addExercise.length !== 0 && (
        <>
          <SingleExerciseForm
            addExercise={addExercise}
            setAddExercise={setAddExercise}
          />

          <Grid item sx={{ textAlign: "center", margin: 5 }}>
            <Button
              
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                console.log(e);
              }}
              sx={{ borderRadius: 10 }}
            >
              Save Changes
            </Button>
          </Grid>
        </>
      )}

      {showTabs ? (
        <AddExerciseForm
          setShowTabs={setShowTabs}
          addExercise={addExercise}
          setAddExercise={setAddExercise}
          checkedExerciseList={checkedExerciseList}
          setCheckedExerciseList={setCheckedExerciseList}
        />
      ) : (
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" , marginBottom: 5}}>
          <Button
            variant="contained"
            onClick={() => setShowTabs((prev) => !prev)}
            style={styles.buttonExercise}
          >
            Add Exercise
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default CreateWorkout;
