import { useEffect, useMemo, useState } from "react";
import useProfile from "../../utils/useProfile";
import useAxiosPrivate from "../../utils/useAxiosPrivate";
import {
  Button,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import PropTypes from "prop-types";
import SearchCustomWorkout from "./SearchCustomWorkout";
import { Delete, MoreVert, Remove } from "@mui/icons-material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StartWorkout = () => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const [tabValue, setTabValue] = useState(0);
  const [startWorkout, setStartWorkout] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const isMenuOpen = Boolean(anchorMenu);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const openMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };
  useEffect(() => {
    //grab customWorkouts assigned to user/ client
    const getCustomWorkouts = async () => {
      let isMounted = true;
      //add logged in user id to data and workout name
      //   values.id = state.profile.clientId;

      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/custom-workout/client/${state.profile.clientId}`,
          {
            signal: controller.signal,
          }
        );
        console.log(response.data);
        dispatch({ type: "SET_CUSTOM_WORKOUTS", payload: response.data });
        // reset();
      } catch (err) {
        console.log(err);
        if (err.response.status === 409) {
          //     setSaveError((prev) => !prev);
          //     setTimeout(() => setSaveError((prev) => !prev), 5000);
          //   }
        }
        return () => {
          isMounted = false;

          controller.abort();
        };
      }
    };

    if (state.customWorkouts.length === 0) {
      getCustomWorkouts();
    }
  }, [state.customWorkouts]);


  return (
    <>
      {startWorkout?.length > 0 ? (
        <>
          <Grid container sx={{mb:5}}>
            <Grid item xs={12} sx={{ mt: 10, justifyContent: "center", }}>
              <h3 style={{ textAlign: "center" }}> {startWorkout[0]?.name}</h3>
            </Grid>

            {startWorkout[0]?.exercises?.map((e) => {
              return (
                <Paper
                  elevation={4}
                  sx={{ padding: 2, mt: 1, mb: 1, borderRadius: 10 }}
                >
                  <form>
                    <Grid
                      container
                      spacing={1}
                      justifyContent="flex-start"
                      alignItems="center"
                      sx={{
                        marginBottom: 2,
                      }}
                    >
                      <Grid item xs={12} sx={{}}>
                        <h3>{Object.keys(e).toString()}</h3>
                        <IconButton

                      onClick={openMenu}
                      // onClick={() => {
                      //   // need to make menu for adding notes , deleting exercise and grouping exercises into superset
                      //   // menu does not work with current setup... position does not work. needs to be fixed for now its just a delete button instead of menu.
                      //   setAddExercise((prev) => {
                      //     const updated = prev.filter(
                      //       (e) => e._id !== exercise._id
                      //     );
                      //     return updated;
                      //   });
                      // }}
                      aria-controls={isMenuOpen ? "Options" : undefined}
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen ? "true" : undefined}
                      >
                        {/* <Remove /> */}
                        <MoreVert  key={Math.random(e)}/> 
                      </IconButton>
                      <Menu
                        key={Math.random(e)}
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
                          // onClick={() => {
                          //   // need to make menu for adding notes , deleting exercise and grouping exercises into superset

                          //   setAddExercise((prev) => {
                          //     const updated = prev.filter(
                          //       (e) => e._id !== exercise._id
                          //     );
                          //     return updated;
                          //   });
                          // }}
                        >
                          Delete
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                          My account
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
                      </Menu>
                      </Grid>
                       {/* map sets */}
                      {Object.entries(e).map((set, index) => {
                        return set[1].map((s,idx) => {

                          return (
                            <>
                              <Grid
                                item
                                xs={3}
                                sm={3}
                                key={Math.random(index)}
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
                              <Grid item xs={4} sm={4}>
                                <TextField
                                  type="input"
                                  variant="outlined"
                                  label="Weight"
                                  fullWidth
                                  name={"weight"}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        lb
                                      </InputAdornment>
                                    ),
                                  }}
                                  defaultValue={s.weight}
                                  key={Math.random(set)}
                                />
                              </Grid>
                              <Grid item xs={3} sm={3}>
                                <TextField
                                  type="text"
                                  variant="outlined"
                                  label="Reps"
                                  fullWidth
                                  name="reps"
                                  defaultValue={s.reps}
                                  key={Math.random(set)}
                                />
                              </Grid>
                              {idx >= 1 ? (
                                //instead of delete I need a check box to mark completed.. 
                                //maybe put this inside of a table. Clicking the top should check all the boxes on the exercise
                            <Grid item xs={1} key={Math.random(idx)}>
                              <Fab
                                key={Math.random(idx)}
                                size="small"
                                variant="contained"
                                color="warning"
                                sx={{ ml: 1 }}
                                // onClick={() => {
                                //   setAddExercise((prev) => {
                                //     //make copy of array of objects
                                //     //remove array set and replace object in array and set state
                                //     const update = [...prev];
                                //     const item = update[index];

                                //     item.numOfSets.splice(idx, 1);
                                //     update[index] = {
                                //       ...item,
                                //     };
                                //     return update;
                                //   });

                                //   //remove inputs from react-form-hook
                                //   unregister(`${exercise.name}-reps-${idx}`);
                                //   unregister(`${exercise.name}-weight-${idx}`);
                                // }}
                              >
                                <Delete />
                              </Fab>
                            </Grid>
                          ) : null}
                            </>
                          );
                        });
                      })}
                       <Grid
                      item
                      xs={6}
                      key={Math.random(e)}
                      sx={{ alignContent: "center" }}
                    >
                      <Button
                        key={Math.random(e)}
                        variant="contained"
                        sx={{ borderRadius: 10, ml: 2 }}
                        // onClick={() => {
                        //   //Update Num of sets for exercise
                        //   //use local state for component to store form data. save button will update global state or just send to backend

                        //   setAddExercise((prev) => {
                        //     const update = [...prev];
                        //     const item = update[index];
                        //     item.numOfSets.push({ weight: "", reps: "" });
                        //     update[index] = {
                        //       ...item,
                        //     };
                        //     return update;
                        //   });
                        // }}
                      >
                        Add Set
                      </Button>
                    </Grid>
                    <Grid item xs={6}><Button variant='contained'>Exercise History</Button></Grid>
                    </Grid>
                  </form>
                </Paper>
              );
            })}
            <Grid item xs={12} sx={{textAlign: 'center', mt:2}}><Button variant='contained' >Add Exercise</Button></Grid>
            <Grid item xs={12} sx={{textAlign: 'center',  mt:3}}><Button variant='contained'>Finish Workout</Button></Grid>
          </Grid>
        </>
      ) : (
        <Grid container justifyContent="center" sx={{ mt: 6 }}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <h4 style={{ textAlign: "center" }}>Start Session</h4>
          </Grid>

          <Grid item>
            {" "}
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Start Workout now?"
              />
            </FormGroup>
          </Grid>

          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Assigned" {...a11yProps(0)} />
                <Tab label="Created" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <SearchCustomWorkout
                setStartWorkout={setStartWorkout}
                startWorkout={startWorkout}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              Item Two
            </TabPanel>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default StartWorkout;
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
  },
  buttonExercise: {
    borderRadius: "10px",
  },
};
