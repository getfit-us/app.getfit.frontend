import { Add, DeleteForever } from "@mui/icons-material";
import { Button, Grid, InputAdornment, MenuItem, Paper, TextField } from "@mui/material";
import IsolatedMenu from "../IsolatedMenu";
import RenderSuperSet from "../RenderSuperSet";
import Cardio from "./Cardio";
import RenderSets from "./RenderSets";


const RenderExercises = ({addExercise, setAddExercise}) => {
  return (
    <>
     {addExercise.map((exercise, index) => {
            // check if the exercise is a superset array of exercises
            return Array.isArray(exercise) ? (
              <RenderSuperSet
                superSet={exercise} //this is the nested array of exercises for the superset
                setFunctionMainArray={setAddExercise}
                mainArray={addExercise} // this is the main state array top level........................
                inStartWorkout={false}
                superSetIndex={index}
              />
            ) : exercise.type === "cardio" ? ( // going to show a different output for cardio
             <Cardio exercise={exercise} index={index} />
            ) : (
              <Paper
                elevation={4}
                sx={{
                  padding: 2,
                  mt: 1,
                  mb: 1,
                  borderRadius: 10,
                  width: { xs: "100%", sm: "100%", md: "60%" },
                }}
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
                    <Grid item xs={12} sx={{ position: "relative" }}>
                      <h3>{exercise.name}</h3>

                      <IsolatedMenu
                        setFunctionMainArray={setAddExercise}
                        mainArray={addExercise}
                        exercise={exercise}
                      
                      />
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          fullWidth
                          select
                          label="Exercise Order"
                          value={index}
                          onChange={(e) => {
                            let _workout = JSON.parse(
                              localStorage.getItem("NewWorkout")
                            );
                            const currentExercise = _workout.splice(
                              index,
                              1
                            )[0];
                            _workout.splice(e.target.value, 0, currentExercise);
                            localStorage.setItem(
                              "NewWorkout",
                              JSON.stringify(_workout)
                            );
                            setAddExercise(_workout);
                          }}
                        >
                          {addExercise.map((position, posindex) => (
                            <MenuItem key={posindex} value={posindex}>
                              #{posindex + 1}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>

                    {/* add dynamic fields */}
                    <RenderSets exercise={exercise} index={index} setAddExercise={setAddExercise} />

                    <Grid item xs={12} sx={{ alignContent: "center" }}>
                      <Button
                        variant="contained"
                        sx={{ borderRadius: 10, ml: 2 }}
                        endIcon={<Add />}
                        size="small"
                        onClick={() => {
                          //Update Num of sets for exercise
                          //use local state for component to store form data. save button will update global state or just send to backend

                          const updated = JSON.parse(
                            localStorage.getItem("NewWorkout")
                          );

                          setAddExercise((prev) => {
                            const item = updated[index];
                            item.numOfSets.push({ weight: "", reps: "" });
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
                      >
                        Set
                      </Button>
                    </Grid>
                  </Grid>
              </Paper>
            );
          })}
    </>
  )
}

export default RenderExercises