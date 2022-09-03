import { Button, Grid, InputAdornment, Paper, TextField } from "@mui/material";
import { add } from "date-fns";
import React, { useState, useEffect } from "react";

//Returns individual Exercise Forms
//need to fix add set functions

const SingleExerciseForm = ({ addExercise , setAddExercise}) => {




  console.log(addExercise)

  return addExercise.map((exercise, index) => {
   
    return (
      <Paper
        elevation={4}
        sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
        key={index}
      >
        <form>
          <Grid
            container
            spacing={1}
            sx={{ display: "flex", marginBottom: 2 }}
            key={index}
          >
            <Grid item xs={12} key={index}>
              <h3>{exercise.name}</h3>
            </Grid>
         
            {/* add dynamic fields */}
            {exercise.numOfSets.map((num, index) => {
              return (
                <>
                  <Grid item xs={2} key={Math.random(exercise._id)}>
                    <TextField
                      type="input"
                      variant="outlined"
                      label='Set'
                      name={`Set${num}`}
                      value={num}
                    />
                  </Grid>
                  <Grid item xs={4} key={Math.random(exercise._id)}>
                    <TextField
                      type="text"
                      name={`Weight${num}`}
                      variant="outlined"
                      label='Weight'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">lb</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} key={Math.random(exercise._id)}>
                    <TextField type="text" variant="outlined" label='Reps' name={`Reps${num}`}/>
                  </Grid>
                  {index >= 1  ? <Button onClick={() => {
                    console.log(exercise.index)
                    //   setAddExercise((prev) => {
                        
                     
                    // const update = [...prev];
                    // const item = update[index];
                    // update[index] = {...item, numOfSets: [...item.numOfSets, item.numOfSets.slice(index)] }
                    // return update;
    
    
                        
                    //   });

                  }}>Delete</Button> : null}
                </>
              );
            })}

            <Grid item key={Math.random(exercise._id)}>
              <Button
                variant="outlined"
                sx={{ borderRadius: 10 }}
                onClick={() => {
               
                  //Update Num of sets for exercise
                  setAddExercise((prev) => {
                  

                    const update = [...prev];
                    const item = update[index];
                    update[index] = {...item, numOfSets: [...item.numOfSets, item.numOfSets.push(item.numOfSets.length + 1)] }
                    return update;


                    
                  });
                      
                  
                  }}
              >
               
                Add Set
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  });
};
export default SingleExerciseForm;
