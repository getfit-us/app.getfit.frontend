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
  IconButton,
  InputAdornment,
  Paper,
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
}) {
  const [value, setValue] = useState(0);
  const [recentlyUsedExercises, setRecentlyUsedExercises] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" , mb:5}}>
      
      <Paper>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            p: 2,
            position: "relative",
          }}
        >
          
          <Typography variant="h5">Add Exercise</Typography>
          <IconButton
            aria-label="Close"
            onClick={() => setShowTabs((prev) => !prev)}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon />
          </IconButton>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Create Workout tabs"
            variant="fullWidth"
          >
            <Tab label="Search" {...a11yProps(0)} />
            <Tab label="Recently Used" {...a11yProps(1)} />
            <Tab label="Create new" {...a11yProps(2)} />
            <Tab
              label={`Current Selection (${checkedExerciseList.length})`}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <SearchExerciseTab
            checkedExerciseList={checkedExerciseList}
            setCheckedExerciseList={setCheckedExerciseList}
            setAddExercise={setAddExercise}
            addExercise={addExercise}
            setRecentlyUsedExercises={setRecentlyUsedExercises}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Recently Used
          {recentlyUsedExercises.map((exercise, index) => {
            return (
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        if (!e.target.checked)
                          setRecentlyUsedExercises((prev) =>
                            prev.filter((exercise) => {
                              return exercise._id !== e.target.value;
                            })
                          );
                      }}
                      defaultChecked
                    />
                  }
                  label={exercise.name}
                  value={exercise._id}
                />
              </Grid>
            );
          })}
        </TabPanel>
        <TabPanel value={value} index={2} sx={{}}>
          <CreateExercise/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          {checkedExerciseList.map((exercise, index) => {
            return (
              <Grid item>
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
                      }}
                      defaultChecked
                    />
                  }
                  label={exercise.name}
                  value={exercise._id}
                />
              </Grid>
            );
          })}
        </TabPanel>
      </Paper>
      {/* add footer visible once you have added exercises needs to display a save changes button to submit the workout to global state and mongodb */}
    </Box>
  );
}

export default AddExerciseForm;
