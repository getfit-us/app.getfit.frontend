import { Button, Grid, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";



//Returns individual Exercise Forms 

const SingleExerciseForm = ({ addExercise }) => {
    const [numOfSets, setNumOfSets] = useState(1);

   

  return addExercise.map((exercise) => {
    //going to output exercise form for each
    return (
      <Grid container spacing={1} sx={{ display: "flex", marginBottom: 2 }}>
        <Grid item xs={12} key={exercise.id}>
          <h3>{exercise.name}</h3>
        </Grid>
        <Grid item xs={2}>
          <TextField type="input" variant="outlined" label="Set" value="1" />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="text"
            variant="outlined"
            label="Weight"
            InputProps={{
              endAdornment: <InputAdornment position="end">lb</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={4}>
        <TextField
            type="text"
            variant="outlined"
            label="Reps"
          
          />
        </Grid>
            {/* add sets dynamically here  */}
{numOfSets.map }
            
        <Grid item>
            <Button variant='outlined' sx={{borderRadius: 10}}
            onClick={() => {
                setNumOfSets(prev => prev + 1)
                console.log(numOfSets)
            }}
            >Add Set</Button>
        </Grid>
      </Grid>
    );
  });
};

export default SingleExerciseForm;
