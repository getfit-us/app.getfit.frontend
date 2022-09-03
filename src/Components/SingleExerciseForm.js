import { Delete } from "@mui/icons-material";
import { Button, Fab, Grid, InputAdornment, Paper, TextField } from "@mui/material";
import { add } from "date-fns";
import React, { useState, useEffect } from "react";

//Returns individual Exercise Forms
//need to fix styling 

const SingleExerciseForm = ({ addExercise, setAddExercise }) => {

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
           
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            sx={{  

              marginBottom: 2 }}
            key={index}

          >
            <Grid item xs={12} key={index}>
              <h3>{exercise.name}</h3>
            </Grid>

            {/* add dynamic fields */}
            {exercise.numOfSets.map((num, idx) => {
              return (
                <>
                  <Grid item  xs={3}  sm={3} key={Math.random(exercise._id)} sx={{justifyContent: 'flex-start'}}>
                    <TextField
                      type="input"
                      variant="outlined"
                      label="Set"
                      fullWidth
                      name={`Set${num}`}
                      value={idx+ 1}
                    />
                    </Grid>
                    <Grid item   xs={4} sm={4} key={Math.random(exercise._id)} sx={{}}>
                    <TextField
                      type="text"
                      fullWidth
                      name={`Weight${num}`}
                      variant="outlined"
                      label="Weight"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">lb</InputAdornment>
                        ),
                      }}
                    />
                    </Grid>
                    <Grid item  xs={3} sm={3} key={Math.random(exercise._id)} >
                    <TextField
                     fullWidth
                      type="text"
                      variant="outlined"
                      label="Reps"
                      name={`Reps${num}`}
                    />
                 </Grid>
                  {num > 1 ? (
                    
                    <Grid item  xs={1} key={Math.random(exercise._id)} >
                    <Fab
                    size="small"
                    variant='contained'
                    color='warning'
                    sx={{ml : 1, }}
                      onClick={() => {
                        setAddExercise((prev) => {
                          //make copy of array of objects
                          //remove array set and replace object in array and set state
                          const update = [...prev];
                          const item = update[index];

                          item.numOfSets.splice(idx, 1);
                          update[index] = {
                            ...item,
                          };
                          return update;
                        });
                      }}
                    >
                     <Delete/>
                    </Fab>
                    </Grid>
                  ) : null}
                  
                </>
              );
            })}

            <Grid item xs={12} key={Math.random(exercise._id)} sx={{alignContent: 'center'}} >
              <Button
                variant="outlined"
                sx={{ borderRadius: 10, ml: 2}}
               
                onClick={() => {
                  //Update Num of sets for exercise
                  setAddExercise((prev) => {
                    const update = [...prev];
                    const item = update[index];
                    update[index] = {
                      ...item,
                      numOfSets: [
                        ...item.numOfSets,
                        item.numOfSets.push(item.numOfSets.length + 1),
                      ],
                    };
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
