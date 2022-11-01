import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchExerciseTab from "./SearchExerciseTab";
import {
  
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
 
  MenuItem,
 
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateExercise from "../Exercise/CreateExercise";

//Tab view page for add exercise Form

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

function AddExerciseForm({
  setShowTabs,
  addExercise,
  setAddExercise,
  checkedExerciseList,
  setCheckedExerciseList,
  inStartWorkout,
  setShowAddExercise,
}) {
  const [value, setValue] = useState(0);
  const [numOfSets, setNumOfSets] = useState(3);
  const [selectionModel, setSelectionModel] = useState([]);

  const changeNumOfSets = (event) => {
    setNumOfSets(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: "100%", mb: 5,   position: "relative",}}>
    
          <Typography
            variant="h5"
            sx={{ textAlign: "start",mb: 2  }}
          >
            Add exercise
          </Typography>
          <Button
            aria-label="Close"
            variant="contained"
            color="warning"
            onClick={() => {
              //if inside start workout then hide addExerciseform, else must be in create workout and hide tabs
              inStartWorkout
                ? setShowAddExercise(false)
                : setShowTabs((prev) => !prev);
            }}
            endIcon={<CloseIcon />}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            Close
          </Button>

            <TextField
              select
              fullWidth
              size='small'
              id="Number of Sets"
              value={numOfSets}
              label="Number Of Sets"
              onChange={changeNumOfSets}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </TextField>
         

          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Create Workout tabs"
            variant="fullWidth"
          >
            <Tab label="Search" {...a11yProps(0)} />
            <Tab label="Create new" {...a11yProps(1)} />
            <Tab
              label={`Current Selection (${checkedExerciseList.length})`}
              {...a11yProps(2)}
            />
          </Tabs>
       
        <TabPanel value={value} index={0}>
          <SearchExerciseTab
            checkedExerciseList={checkedExerciseList}
            setCheckedExerciseList={setCheckedExerciseList}
            setAddExercise={setAddExercise}
            addExercise={addExercise}
            numOfSets={numOfSets}
            inStartWorkout={inStartWorkout}
            setSelectionModel={setSelectionModel}
            selectionModel={selectionModel}
          />
        </TabPanel>
      
        <TabPanel value={value} index={1} sx={{}}>
          <CreateExercise />
        </TabPanel>
        <TabPanel value={value} index={2}>
          {checkedExerciseList.map((exercise, index) => {
            return (
              <Grid item key={exercise._id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        if (!e.target.checked)
                          setCheckedExerciseList((checkedExerciseList) =>
                            checkedExerciseList.filter((exercise) => {
                              return exercise._id !== e.target.value;
                            })
                          );
                          setSelectionModel((prev) => prev.filter(id => id !== e.target.value))

                      }}
                      defaultChecked
                      key={exercise._id}
                    />
                  }
                  label={exercise.name}
                  value={exercise._id}
                  key={exercise._id}
                />
              </Grid>
            );
          })}
        </TabPanel>
      {/* add footer visible once you have added exercises needs to display a save changes button to submit the workout to global state and mongodb */}
    </Box>
  );
}

export default AddExerciseForm;
