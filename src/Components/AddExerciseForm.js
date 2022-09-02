import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchExerciseTab from "./SearchExerciseTab";
import { Checkbox, FormControlLabel, Grid, InputAdornment, TextField } from "@mui/material";
import SingleExerciseForm from "./SingleExerciseForm";

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

function AddExerciseForm() {
  const [value, setValue] = useState(0);
  const [checkedExerciseList, setCheckedExerciseList] = useState([]);
  const [addExercise, setAddExercise] = useState([]);
  const [numOfSets, setNumOfSets] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {addExercise.length !== 0 &&
       <SingleExerciseForm addExercise={addExercise} />}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5">Add Exercise</Typography>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Create Workout tabs"
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
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Recently Used
      </TabPanel>
      <TabPanel value={value} index={2}>
        Create New{" "}
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
    </Box>
  );
}

export default AddExerciseForm;
