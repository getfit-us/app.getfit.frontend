import {  useState } from "react";
import PropTypes from "prop-types";

import { Grid, CircularProgress, Button, Box, Tabs, Tab } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";

import ViewWorkoutModal from "../Modals/ViewWorkoutModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import DataGridViewWorkouts from "./DataGridViewWorkouts";
import { useWorkouts } from "../../../Store/Store";
import useApiCallOnMount from "../../../hooks/useApiCallOnMount";
import {
  getCustomWorkouts,
  getAssignedCustomWorkouts,
  getCompletedWorkouts,
} from "../../../Api/services";
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

const ViewWorkouts = ({ trainerWorkouts, clientId }) => {
  const delCustomWorkout = useWorkouts((state) => state.delCustomWorkout);
  const delCompletedWorkout = useWorkouts((state) => state.delCompletedWorkout);
  const [loadingCustomWorkouts, customWorkouts, errorCustomWorkouts] =
    useApiCallOnMount(getCustomWorkouts);
  const [
    loadingAssignedCustomWorkouts,
    assignedCustomWorkouts,
    errorAssignedCustomWorkouts,
  ] = useApiCallOnMount(getAssignedCustomWorkouts);
  const [loadingCompletedWorkouts, completedWorkouts, errorCompletedWorkouts] =
    useApiCallOnMount(getCompletedWorkouts);

  const stateCustomWorkouts = useWorkouts((state) => state.customWorkouts);
  const stateCompletedWorkouts = useWorkouts(
    (state) => state.completedWorkouts
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [selectionModel, setSelectionModel] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [viewWorkout, setViewWorkout] = useState([]);
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const [status, setStatus] = useState({
    loading: false,
    error: null,
  });
  const handleModal = () => setOpen((prev) => !prev);
  const handleChange = (event, tabValue) => {
    setValue(tabValue);
    setSelectionModel([]);
  };

  const handleView = (event) => {
    if (value === 0) {
      //for tab 0 completedWorkouts
      if (clientId) {
        setViewWorkout(
          trainerWorkouts?.completedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      } else {
        setViewWorkout(
          completedWorkouts.filter((w) => w._id === selectionModel[0])
        );
      }
    } else if (value === 1) {
      //for tab assignedWorkouts
      if (clientId) {
        setViewWorkout(
          trainerWorkouts?.assignedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )
        );
      } else {
        setViewWorkout(
          assignedCustomWorkouts.filter((w) => w._id === selectionModel[0])
        );
      }
    } else if (value === 2) {
      //for created workouts
      setViewWorkout(customWorkouts.filter((w) => w._id === selectionModel[0]));
    }
    setSelectionModel([]);
    handleModal();
  };

  const onDelete = async (id, type) => {
    let path = type === "custom" ? "/custom-workout/" : "/completed-workouts/";

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`${path}${id}`, {
        signal: controller.signal,
      });
      if (type === "custom") {
        delCustomWorkout({ _id: id });
      } else {
        delCompletedWorkout({ _id: id });
      }
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  ///need to add notes and info to view modal
  return (
    <>
      <ViewWorkoutModal
        open={open}
        viewWorkout={viewWorkout}
        handleModal={handleModal}
      />

      <Grid
        container
        spacing={0}
        mt={3}
        display="flex"
        justifyContent="center"
        minWidth="100%"
        padding="0"
        marginTop={"4rem"}
      >
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Create Workout tabs"
            variant="fullWidth"
          >
            <Tab label="Completed Workouts" {...a11yProps(0)} />
            <Tab label="Assigned Workouts" {...a11yProps(1)} />
            <Tab label="Created Workouts" {...a11yProps(2)} />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {/* Completed Workouts */}

          <TabPanel value={value} index={0}>
            <h2 className="page-title">Completed Workouts</h2>

            {loadingCompletedWorkouts ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={
                  clientId
                    ? trainerWorkouts?.completedWorkouts
                    : stateCompletedWorkouts
                }
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
              />
            )}
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          {/* Assigned Workouts */}
          <TabPanel value={value} index={1}>
            <h2 className="page-title">Assigned Workouts</h2>
            {loadingAssignedCustomWorkouts ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={
                  clientId
                    ? trainerWorkouts?.assignedWorkouts
                    : assignedCustomWorkouts
                }
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
              />
            )}
          </TabPanel>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={value} index={2}>
            {/* Created Workouts */}
            <h2 className="page-title">Created Workouts</h2>
            {loadingCustomWorkouts ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={stateCustomWorkouts}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
              />
            )}
          </TabPanel>

          <Grid
            item
            sx={{
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
              mb: 4,
            }}
            id="button-container"
          >
            {selectionModel.length !== 0 && (
              <Button
                sx={{ borderRadius: "10px", mb: 1 }}
                variant="contained"
                onClick={handleView}
              >
                View
              </Button>
            )}
            {selectionModel?.length !== 0 && value !== 1 && (
              <Button
                sx={{ borderRadius: "10px", mb: 1, ml: 20 }}
                variant="contained"
                onClick={() => {
                  onDelete(
                    selectionModel[0],
                    value === 2 ? "custom" : "completed"
                  );
                  setSelectionModel([]);
                }}
                color="error"
              >
                Delete
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ViewWorkouts;
