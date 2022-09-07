import {
  Button,
  Fab,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { Delete, MoreVert, Remove } from "@mui/icons-material";

import { useState, useTheme, useRef, useEffect } from "react";
import AddExerciseForm from "../Components/Workout/AddExerciseForm";
import useProfile from "../utils/useProfile";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const CreateWorkout = ({ newWorkoutName, newPage }) => {
  //need to ask if you want to save or leave page for new workout

  const { state, dispatch } = useProfile();
  const [showTabs, setShowTabs] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [addExercise, setAddExercise] = useState([]);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const menuRef = useRef();

  const isMenuOpen = Boolean(anchorMenu);
  const {
    register,
    unregister,
    getValues,
    formState: { errors },
    control,
  } = useForm({ mode: "onSubmit", reValidateMode: "onChange" });
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const openMenu = (event) => {
    setAnchorMenu(menuRef);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  // useEffect(() => {
  //   console.log("rerender", menuRef.current, anchorMenu);
  // }, [anchorMenu]);

  const onSubmit = async (values) => {
    let isMounted = true;
    //add logged in user id to data and workout name
    values.id = state.profile.clientId;
    values.name = newWorkoutName;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/custom-workout", values, {
        signal: controller.signal,
      });
      console.log(response.data);
      dispatch({ type: "ADD_CUSTOM_WORKOUT", payload: response.data });
      navigate('/dashboard', { replace: true });
      // reset();
    } catch (err) {
      console.log(err);
      if (err.response.status === 409) {
        setSaveError((prev) => !prev);
        setTimeout(() => setSaveError((prev) => !prev), 5000);
      }
    }
    return () => {
      isMounted = false;

      controller.abort();
    };
  };

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
          {addExercise.map((exercise, index) => {
            return (
              <Paper
                elevation={4}
                sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                key={Math.random(exercise._id)}
              >
                <form>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    sx={{
                      marginBottom: 2,
                      position: "relative",
                    }}
                    key={Math.random(exercise._id)}
                  >
                    <Grid
                      item
                      xs={12}
                      key={Math.random(exercise._id)}
                      sx={{ position: "relative" }}
                    >
                      <h3>{exercise.name}</h3>
                      <IconButton
                        sx={{ position: "absolute", top: 0, right: 3 }}
                        // onClick={openMenu}
                        onClick={() => {
                          // need to make menu for adding notes , deleting exercise and grouping exercises into superset
                          // menu does not work with current setup... position does not work. needs to be fixed for now its just a delete button instead of menu.
                          setAddExercise((prev) => {
                            const updated = prev.filter(
                              (e) => e._id !== exercise._id
                            );
                            return updated;
                          });
                        }}
                        aria-controls={isMenuOpen ? "Options" : undefined}
                        aria-haspopup="true"
                        aria-expanded={isMenuOpen ? "true" : undefined}
                      >
                        <Remove />
                        {/* <MoreVert  key={Math.random(exercise._id)}/> */}
                      </IconButton>
                      <Menu
                        key={Math.random(exercise._id)}
                        id="Options"
                        aria-labelledby="Options"
                        anchorEl={anchorMenu}
                        open={isMenuOpen}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        sx={{ position: "fixed", top: 0, right: 3 }}
                      >
                        <MenuItem
                          onClick={() => {
                            // need to make menu for adding notes , deleting exercise and grouping exercises into superset

                            setAddExercise((prev) => {
                              const updated = prev.filter(
                                (e) => e._id !== exercise._id
                              );
                              return updated;
                            });
                          }}
                        >
                          Delete
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                          My account
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
                      </Menu>
                    </Grid>

                    {/* add dynamic fields */}
                    {exercise.numOfSets.map((num, idx) => {
                      return (
                        <>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            key={Math.random(exercise._id)}
                            sx={{ justifyContent: "flex-start" }}
                          >
                            <TextField
                              key={Math.random(exercise._id)}
                              type="input"
                              variant="outlined"
                              label="Set"
                              fullWidth
                              name={`Set${idx}`}
                              value={idx + 1}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            sm={4}
                            key={Math.random(exercise._id)}
                            sx={{}}
                          >
                            <TextField
                              key={Math.random(exercise._id)}
                              type="text"
                              fullWidth
                              name="weight"
                              variant="outlined"
                              label="Weight"
                              {...register(`${exercise.name}-weight-${idx}`)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    lb
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            key={Math.random(exercise._id)}
                          >
                            <TextField
                              fullWidth
                              type="text"
                              variant="outlined"
                              label="Reps"
                              name="reps"
                              key={Math.random(exercise._id)}
                              {...register(`${exercise.name}-reps-${idx}`)}
                            />
                          </Grid>
                          {idx >= 1 ? (
                            <Grid item xs={1} key={Math.random(exercise._id)}>
                              <Fab
                                key={Math.random(exercise._id)}
                                size="small"
                                variant="contained"
                                color="warning"
                                sx={{ ml: 1 }}
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

                                  //remove inputs from react-form-hook
                                  unregister(`${exercise.name}-reps-${idx}`);
                                  unregister(`${exercise.name}-weight-${idx}`);
                                }}
                              >
                                <Delete />
                              </Fab>
                            </Grid>
                          ) : null}
                        </>
                      );
                    })}

                    <Grid
                      item
                      xs={12}
                      key={Math.random(exercise._id)}
                      sx={{ alignContent: "center" }}
                    >
                      <Button
                        key={Math.random(exercise._id)}
                        variant="contained"
                        sx={{ borderRadius: 10, ml: 2 }}
                        onClick={() => {
                          //Update Num of sets for exercise
                          //use local state for component to store form data. save button will update global state or just send to backend

                          setAddExercise((prev) => {
                            const update = [...prev];
                            const item = update[index];
                            item.numOfSets.push({ weight: "", reps: "" });
                            update[index] = {
                              ...item,
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
          })}
          ;
          <Grid item sx={{ textAlign: "center", margin: 5 }}>
            {saveError ? (
              <Button variant="contained" color="error">
                Error Duplicate Workout Name
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  const values = getValues();
                  values.exercises = [];
                  // console.log(values);
                  //reformat values for DB
                  for (const [key, value] of Object.entries(values)) {
                    // console.log(`${key}: ${value}`);

                    if (key !== "exercises") {
                      let arr = key.split("-");
                      let end = Number(arr[2]);
                      let duplicate = values.exercises.findIndex(
                        (e) => arr[0] === Object.keys(e).toString()
                      );

                      if (arr[1] === "weight" && duplicate === -1) {
                       
                        const key = arr[0]
                        const obj = {}
                        obj[key]= [ {'weight': value} ]
                        values.exercises.push(obj)
                        

                   
                      } else if (arr[1] === "weight" && duplicate !== -1) {
                       
                        const curArr = values.exercises[duplicate][arr[0]]

                        curArr.push( {'weight': value} )
                        
                      }

                      if (arr[1] === "reps" && duplicate === -1) {
                        const key = arr[0]
                        const obj = {}
                        obj[key]= [ {'reps': value} ]
                        values.exercises.push(obj)

                      
                      } else if (arr[1] === "reps" && duplicate !== -1) {
                        console.log('inside reps else if')
                        
                        values.exercises[duplicate][arr[0]][end].reps = value
                        
                      }
                    }
                  }
                  
                  onSubmit(values);
                }}
                sx={{ borderRadius: 10 }}
              >
                Save Changes
              </Button>
            )}
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
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "center", marginBottom: 5 }}
        >
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
