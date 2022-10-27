import { DeleteForever } from "@mui/icons-material";
import { Grid, InputAdornment, TextField } from "@mui/material";

//render sets

const RenderSets = ({exercise, index, setAddExercise}) => {
  return (
    <>
    {exercise.numOfSets.map((set, idx) => {
                      return (
                        <>
                          <Grid
                            item
                            xs={2}
                            sm={2}
                            key={exercise._id + "set" + idx}
                            sx={{ justifyContent: "flex-start" }}
                          >
                            <TextField
                              type="input"
                              variant="outlined"
                              label="Set"
                              fullWidth
                              size="small"
                              name={`Set${idx}`}
                              value={idx + 1}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            sm={6}
                            key={exercise._id + "weight"}
                            sx={{}}
                          >
                            <TextField
                              type="text"
                              fullWidth
                              name="weight"
                              size="small"
                              variant="outlined"
                              label="Weight"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    lb
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(event) => {
                                const updated = JSON.parse(
                                  localStorage.getItem("NewWorkout")
                                );
                                updated[index].numOfSets[idx].weight =
                                  event.target.value;
                                localStorage.setItem(
                                  "NewWorkout",
                                  JSON.stringify(updated)
                                );
                              }}
                            />
                          </Grid>
                          <Grid item xs={3} sm={3} key={exercise._id + "reps"}>
                            <TextField
                              fullWidth
                              type="text"
                              variant="outlined"
                              label="Reps"
                              name="reps"
                              size="small"
                              onChange={(event) => {
                                const updated = JSON.parse(
                                  localStorage.getItem("NewWorkout")
                                );
                                updated[index].numOfSets[idx].reps =
                                  event.target.value;
                                localStorage.setItem(
                                  "NewWorkout",
                                  JSON.stringify(updated)
                                );
                              }}
                            />
                          </Grid>
                          {idx >= 1 ? (
                            <Grid item xs={1} key={exercise._id + "delete"}>
                              <DeleteForever
                                onClick={() => {
                                  const updated = JSON.parse(
                                    localStorage.getItem("NewWorkout")
                                  );
                                  setAddExercise((prev) => {
                                    //make copy of array of objects
                                    //remove array set and replace object in array and set state

                                    const item = updated[index];

                                    item.numOfSets.splice(idx, 1);
                                    updated[index] = {
                                      ...item,
                                    };
                                    localStorage.setItem(
                                      "NewWorkout",
                                      JSON.stringify(updated)
                                    );
                                    return updated;
                                  });

                               
                                }}
                                sx={{ color: "#db4412", cursor: "pointer" }}
                              />
                            </Grid>
                          ) : null}
                        </>
                      );
                    })}
    </>
  )
}

export default RenderSets