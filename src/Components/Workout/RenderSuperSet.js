import { Add, Done, History } from '@mui/icons-material';
import { Button, Checkbox, Grid, InputAdornment, Paper, TextField, Tooltip } from '@mui/material';
import React from 'react'
import useProfile from '../../utils/useProfile';
import IsolatedMenu from './IsolatedMenu';

//this will be used to render the superset selection

const RenderSuperSet = ({superSet, numOfSuperSets}) => {
    const {state, dispatch} = useProfile();

    console.log(superSet);

  return (
    
    <Paper elevation={4} sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10, borderLeft: '7px solid #689ee1' }}>
        
    <Grid container   spacing={1}
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{
                        marginBottom: 2,
                        position: "relative",
                      }}>
        <Grid item xs={12}><h3>SuperSet</h3></Grid>
        
        {/* <IsolatedMenu
                          e={e}
                          index={index}
                          startWorkout={startWorkout}
                          setStartWorkout={setStartWorkout}
                          setSuperSet={setSuperSet}
                          superSet={superSet}
                        /> */}
        
    {false && superSet.map((superSet, index) => {
        return (
            <>
            <Grid item xs={12}>
        <h3>{Object.keys(superSet)[0].toString()}</h3>
        </Grid>
        {/* map sets */}
        {Object.entries(superSet).map((set) => {
                        if (set[0] !== "notes")
                          return set[1].map((s, idx) => {
                            return (
                              <>
                                <Grid
                                  item
                                  xs={3}
                                  sm={3}
                                  key={idx + 2}
                                  sx={{ justifyContent: "flex-start" }}
                                >
                                  <TextField
                                    type="input"
                                    variant="outlined"
                                    label="Set"
                                    fullWidth
                                    name={`Set`}
                                    value={idx + 1}
                                  />
                                </Grid>
                                <Grid item xs={4} sm={4} key={idx + 5}>
                                  <TextField
                                    type="input"
                                    variant="outlined"
                                    label="Weight"
                                    fullWidth
                                    name="weight"
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          lb
                                        </InputAdornment>
                                      ),
                                    }}
                                    defaultValue={s.weight}
                                    id={`${
                                      Object?.keys(superSet)?.toString() + idx
                                    }weight`}
                                  />
                                </Grid>
                                <Grid item xs={3} sm={3} key={idx + 6}>
                                  <TextField
                                    type="text"
                                    variant="outlined"
                                    label="Reps"
                                    fullWidth
                                    name="reps"
                                    id={`${
                                      Object?.keys(superSet)?.toString() + idx
                                    }reps`}
                                    defaultValue={s.reps}
                                  />
                                </Grid>

                                <Grid item xs={1} key={idx + 3}>
                                  <Tooltip title="completed">
                                    <Checkbox
                                    //   checked={
                                    //     checked[
                                    //       Object?.keys(superSet)[0]?.toString() + idx
                                    //     ]
                                    //       ? (checked[
                                    //           Object?.keys(superSet)[0]?.toString() +
                                    //             idx
                                    //         ] = true)
                                    //       : (checked[
                                    //           Object?.keys(superSet)[0]?.toString() +
                                    //             idx
                                    //         ] = false)
                                    //   }
                                      aria-label="Completed"
                                      color="success"
                                    //   onClick={() => {
                                    //     setChecked((prev) => {
                                    //       let updated = { ...prev };
                                    //       let previousValue =
                                    //         updated[
                                    //           Object?.keys(superSet)[0]?.toString() +
                                    //             idx
                                    //         ];
                                    //       updated[
                                    //         Object?.keys(superSet)[0]?.toString() + idx
                                    //       ] = !previousValue;

                                    //       return updated;
                                    //     });

                                    //     setStartWorkout((prev) => {
                                    //       //set items completed and log weight and reps to state
                                    //       const updated = [...prev];
                                    //       const weight =
                                    //         document.getElementById(
                                    //           `${
                                    //             Object?.keys(e)?.toString() +
                                    //             idx
                                    //           }weight`
                                    //         ).value;
                                    //       const reps = document.getElementById(
                                    //         `${
                                    //           Object?.keys(superSet)?.toString() + idx
                                    //         }reps`
                                    //       ).value;

                                    //       updated[0].exercises[index][
                                    //         Object?.keys(superSet)[0]?.toString()
                                    //       ][idx].completed =
                                    //         !checked[
                                    //           Object?.keys(superSet)[0]?.toString() +
                                    //             idx
                                    //         ];
                                    //       //if check is true (checked) then save value
                                    //       if (
                                    //         updated[0].exercises[index][
                                    //           Object?.keys(e)[0]?.toString()
                                    //         ][idx].completed
                                    //       ) {
                                    //         updated[0].exercises[index][
                                    //           Object?.keys(superSet)[0]?.toString()
                                    //         ][idx].weight = weight;
                                    //         updated[0].exercises[index][
                                    //           Object?.keys(superSet)[0]?.toString()
                                    //         ][idx].reps = reps;
                                    //       }

                                    //       return updated;
                                    //     });

                                    //     //Update State to show completed so when sent to backend we can see this
                                    //     // const test = [...startWorkout];
                                    //     // const bool = test[0].exercises[index][Object?.keys(e)?.toString()][idx]?.completed
                                    //     // test[0].exercises[index][Object?.keys(e)?.toString()][idx].completed = !bool;
                                    //     // console.log(test[0].exercises[index][Object?.keys(e)?.toString()][idx])
                                    //   }}
                                    //   value={
                                    //     checked[
                                    //       Object?.keys(superSet)[0]?.toString() + idx
                                    //     ]
                                    //   }
                                    />
                                  </Tooltip>
                                </Grid>
                              </>
                            );
                          });
                      })}
                      <Grid item lg={4}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ borderRadius: 10, pr: 1 }}
                        endIcon={<Add/>}
                        //   onClick={() => {
                        //     //Update Num of sets for exercise
                        //     //use local state for component to store form data. save button will update global state or just send to backend

                        //     setSuperSet((prev) => {
                        //       const updated = [...prev];
                        //       updated[0].exercises[index][
                        //         Object?.keys(e)?.toString()
                        //       ].push({
                        //         weight: "",
                        //         reps: "",
                        //         completed: false,
                        //       });
                        //       return updated;
                        //     });
                        //   }}
                        >
                          Set
                        </Button>
                      </Grid>
                      <Grid item lg={4}>
                        <Button
                          size="small"
                          variant="contained"
                          endIcon={<History />}
                          sx={{ borderRadius: 10 }}
                        //   onClick={() => {
                        //     //need to grab all the exercise history from user and display dates in small table modal.
                        //     // console.log(state.completedWorkouts)

                        //     const test = [...state.completedWorkouts];

                        //     //Check if already grabbed exercise history in state to save memory and eliminate duplicates
                        //     if (!exerciseHistory[Object?.keys(e)?.toString()]) {
                        //       test.map((finishedWorkouts, index) => {
                        //         //search for exercise, if found grab data and DateCompleted
                        //         //grab index of map loop to get dateCompleted
                        //         //logic is flawed... need to check for duplicate dates

                        //         finishedWorkouts.exercises.filter(
                        //           (exercise, i, arr) => {
                        //             // find out if exercise is the same as current on button selected
                        //             if (
                        //               Object.keys(exercise)[0].toString() ===
                        //               Object?.keys(e)?.toString()
                        //             ) {
                        //               //if it is same exercise then look for dateCompleted
                        //               if (
                        //                 arr[i][
                        //                   Object.keys(exercise)[0].toString()
                        //                 ].findIndex(
                        //                   (cur) => cur.dateCompleted
                        //                 ) === -1
                        //               ) {
                        //                 // if we do NOT find the date we are pushing it to end of the array
                        //                 arr[i][
                        //                   Object.keys(exercise)[0].toString()
                        //                 ].push({
                        //                   dateCompleted:
                        //                     finishedWorkouts.dateCompleted,
                        //                 });
                        //                 //add to history array
                        //               }

                        //               //testing
                        //               //2 workouts loops through twice..

                        //               setExerciseHistory((prev) => {
                        //                 const updated = { ...prev };
                        //                 // if object with exercise name already exists then we are pushing array
                        //                 if (
                        //                   updated[
                        //                     Object.keys(exercise)[0].toString()
                        //                   ]
                        //                 ) {
                        //                   //check if current state already has this array
                        //                   let dateIndexOfArray = arr[i][
                        //                     Object.keys(exercise)[0].toString()
                        //                   ].findIndex(
                        //                     (cur) => cur.dateCompleted
                        //                   );
                        //                   //Loop through current array and get dates to compare for duplicate
                        //                   let dates = updated[
                        //                     Object.keys(exercise)[0].toString()
                        //                   ].map((set) => {
                        //                     return findAllByKey(
                        //                       set,
                        //                       "dateCompleted"
                        //                     );
                        //                   });
                        //                   //convert date array to strings and see if current date already exists inside the string

                        //                   // console.log(
                        //                   //   dates
                        //                   //     .toString()
                        //                   //     .includes(
                        //                   //       arr[i][
                        //                   //         Object.keys(
                        //                   //           exercise
                        //                   //         )[0].toString()
                        //                   //       ][dateIndexOfArray]
                        //                   //         .dateCompleted
                        //                   //     )
                        //                   // );

                        //                   //if date already exists then do not push it ..
                        //                   if (
                        //                     !dates
                        //                       .toString()
                        //                       .includes(
                        //                         arr[i][
                        //                           Object.keys(
                        //                             exercise
                        //                           )[0].toString()
                        //                         ][dateIndexOfArray]
                        //                           .dateCompleted
                        //                       )
                        //                   ) {
                        //                     updated[
                        //                       Object.keys(
                        //                         exercise
                        //                       )[0].toString()
                        //                     ].push(
                        //                       arr[i][
                        //                         Object.keys(
                        //                           exercise
                        //                         )[0].toString()
                        //                       ]
                        //                     );
                        //                   }
                        //                 } else {
                        //                   updated[
                        //                     Object.keys(exercise)[0].toString()
                        //                   ] = [];
                        //                   updated[
                        //                     Object.keys(exercise)[0].toString()
                        //                   ].push(
                        //                     arr[i][
                        //                       Object.keys(
                        //                         exercise
                        //                       )[0].toString()
                        //                     ]
                        //                   );
                        //                 }

                        //                 return updated;
                        //               });

                        //               return true;
                        //             }
                        //           }
                        //         );
                        //       });
                        //     }
                        //     //set current exercise state to handle modal

                        //     setCurrentExercise(Object?.keys(e)?.toString());
                        //     handleOpenHistoryModal();
                        //   }}
                        >
                          {" "}
                          Exercise
                        </Button>
                      </Grid>
                      <Grid item lg={4}>
                        {" "}
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<Done />}
                          sx={{ borderRadius: 10 }}
                        //   onClick={() => {
                        //     Object.entries(checked).map((checkboxSet, idx) => {
                        //       //find corresponding checkbox that match exercisename and set to  true

                        //       if (
                        //         checkboxSet[0].includes(
                        //           Object?.keys(e)[0]?.toString()
                        //         ) &&
                        //         !checkboxSet[0].includes("note")
                        //       ) {
                        //         setChecked((prev) => {
                        //           let updated = { ...prev };
                        //           let previousValue = updated[checkboxSet[0]];
                        //           updated[checkboxSet[0]] = true;
                        //           return updated;
                        //         });
                        //       }
                        //       setStartWorkout((prev) => {
                        //         //loop through sets and set completed to true
                        //         //add input values to state
                        //         const updated = [...prev];

                        //         updated[0].exercises[index][
                        //           Object?.keys(e)[0]?.toString()
                        //         ].map((set, idx) => {
                        //           //get input values for current set
                        //           const weight = document.getElementById(
                        //             `${Object?.keys(e)?.toString() + idx}weight`
                        //           ).value;
                        //           const reps = document.getElementById(
                        //             `${Object?.keys(e)?.toString() + idx}reps`
                        //           ).value;
                        //           //update state
                        //           updated[0].exercises[index][
                        //             Object?.keys(e)[0]?.toString()
                        //           ][idx].weight = weight;
                        //           updated[0].exercises[index][
                        //             Object?.keys(e)[0]?.toString()
                        //           ][idx].reps = reps;
                        //           set.completed = true;
                        //         });
                        //         return updated;
                        //       });
                        //     });
                        //   }}
                        >
                          {" "}
                          Completed
                        </Button>
                      </Grid>
        </>

      )
    })}
                    
    </Grid>
    </Paper>
    
    )
}

export default RenderSuperSet