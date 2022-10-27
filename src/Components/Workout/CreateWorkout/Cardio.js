import { Grid, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import React from 'react'

const Cardio = ({exercise, index}) => {
  return (
    <>
     <Paper
                elevation={4}
                sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                key={exercise._id}
              >
                <Grid
                  container
                  spacing={1}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  sx={{
                    marginBottom: 2,
                  }}
                >
                  <Grid item xs={12}>
                    <Typography variant="h5">{exercise.name}</Typography>
                  </Grid>
                  {exercise.numOfSets.map((num, idx) => {
                    return (
                      <>
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          key={exercise._id + "level"}
                          sx={{}}
                        >
                          <TextField
                            type="number"
                            fullWidth
                            name="level"
                            variant="outlined"
                            label="Level of intensity"
                         
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  Lvl
                                </InputAdornment>
                              ),
                            }}
                            onChange={(event) => {
                              const updated = JSON.parse(
                                localStorage.getItem("NewWorkout")
                              );
                              updated[index].numOfSets[idx].level =
                                event.target.value;
                              localStorage.setItem(
                                "NewWorkout",
                                JSON.stringify(updated)
                              );
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          key={exercise._id + "time"}
                          sx={{}}
                        >
                          <TextField
                            type="number"
                            fullWidth
                            name="time"
                            variant="outlined"
                            label="Time Completed"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  Minutes
                                </InputAdornment>
                              ),
                            }}
                            onChange={(event) => {
                              const updated = JSON.parse(
                                localStorage.getItem("NewWorkout")
                              );
                              updated[index].numOfSets[idx].minutes =
                                event.target.value;
                              localStorage.setItem(
                                "NewWorkout",
                                JSON.stringify(updated)
                              );
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          key={exercise._id + "heart rate"}
                        >
                          <TextField
                            fullWidth
                            type="number"
                            variant="outlined"
                            label="Heart Rate"
                            name="heartRate"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  BPM
                                </InputAdornment>
                              ),
                            }}
                            onChange={(event) => {
                              const updated = JSON.parse(
                                localStorage.getItem("NewWorkout")
                              );
                              updated[index].numOfSets[idx].heartRate =
                                event.target.value;
                              localStorage.setItem(
                                "NewWorkout",
                                JSON.stringify(updated)
                              );
                            }}
                          />
                        </Grid>
                      </>
                    );
                  })}
                </Grid>
              </Paper>
    </>
  )
}

export default Cardio