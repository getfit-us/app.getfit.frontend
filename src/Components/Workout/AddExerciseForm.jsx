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
} from "@mui/material";
import { colors } from "../../Store/colors";
import CreateExercise from "../Exercise/CreateExercise";
import { Close } from "@mui/icons-material";

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
          {children}
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
    <Box sx={{ width: "100%", mb: 5, position: "relative" }}>
      <div style={{
        display: "flex",
        justifyContent: 'center'
      }}>
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
          sx={{ marginTop: 1, marginBottom: 1 }}
        >
          Close Search
        </Button>
      </div>

      <Typography
        variant="h5"
        sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}
      >
        Search for exercise
      </Typography>

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Create Workout tabs"
        variant="fullWidth"
      >
        <Tab label="Search" {...a11yProps(0)} />
        <Tab
          label={`Current Selection (${checkedExerciseList.length})`}
          {...a11yProps(1)}
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

      {/* <TabPanel value={value} index={1} sx={{}}>
        <CreateExercise />
      </TabPanel> */}
      <TabPanel value={value} index={1}>
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
                      setSelectionModel((prev) =>
                        prev.filter((id) => id !== e.target.value)
                      );
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
