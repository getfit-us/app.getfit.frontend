import { Button, Grid } from "@mui/material";
import { useState, useTheme } from "react";
import AddExerciseForm from "../Components/AddExerciseForm";
import useProfile from "../utils/useProfile";

const CreateWorkout = ({ newWorkoutName }) => {
  const { state, dispatch } = useProfile();
  const [exerciseList, setExerciseList] = useState([]);
  const [showTabs, setShowTabs] = useState(false);


  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',

    },
    buttonExercise: {
      borderRadius: '10px'
    }
  };

  return (
    <Grid container style={styles.container} sx={{ marginTop: 10 }}>
      <Grid item style={styles.header}>
        <h3> {newWorkoutName}</h3>
      </Grid>

      {showTabs ? <AddExerciseForm/> : <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
        <Button variant='contained' 
        onClick={() => setShowTabs(prev => !prev)}
        
        style={styles.buttonExercise}>Add Exercise</Button>
      </Grid>}

    </Grid>
  );
};

export default CreateWorkout;
