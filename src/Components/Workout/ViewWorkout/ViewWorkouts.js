import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Grid,
  Typography,
  CircularProgress,
  Button,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

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

const ViewWorkouts = ({ trainerWorkouts, clientId }) => {
  const delCustomWorkout = useWorkouts((state) => state.delCustomWorkout);
  const [loadingCustomWorkouts, customWorkouts, errorCustomWorkouts] =
    useApiCallOnMount(getCustomWorkouts);
  const [
    loadingAssignedCustomWorkouts,
    assignedCustomWorkouts,
    errorAssignedCustomWorkouts,
  ] = useApiCallOnMount(getAssignedCustomWorkouts);
  const [loadingCompletedWorkouts, completedWorkouts, errorCompletedWorkouts] =
    useApiCallOnMount(getCompletedWorkouts);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [workoutType, setWorkoutType] = useState([]);
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
    if (clientId) {
      //being managed so adjust workoutType
      tabValue === 0
        ? setWorkoutType(trainerWorkouts?.completedWorkouts)
        : tabValue === 1
        ? setWorkoutType(trainerWorkouts?.assignedWorkouts)
        : setWorkoutType(customWorkouts);
    } else {
      tabValue === 0
        ? setWorkoutType(completedWorkouts)
        : tabValue === 1
        ? setWorkoutType(assignedCustomWorkouts)
        : setWorkoutType(customWorkouts);
    }

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
      console.log(response.data);
      delCustomWorkout({ _id: id });
      setWorkoutType((prev) => prev);
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    document.title = "View Workouts";
    clientId
      ? setWorkoutType(trainerWorkouts?.completedWorkouts)
      : setWorkoutType(completedWorkouts);

    if (
      loadingAssignedCustomWorkouts ||
      loadingCompletedWorkouts ||
      loadingCustomWorkouts
    )
      setStatus({ loading: true, error: null });
    else if (
      errorAssignedCustomWorkouts ||
      errorCompletedWorkouts ||
      errorCustomWorkouts
    )
      setStatus({
        loading: false,
        error:
          errorAssignedCustomWorkouts ||
          errorCompletedWorkouts ||
          errorCustomWorkouts,
      });
    else setStatus({ loading: false, error: null });
  }, [
    loadingAssignedCustomWorkouts,
    loadingCompletedWorkouts,
    loadingCustomWorkouts,
  ]);

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

            {status.loading ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={workoutType}
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
            {status.loading ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={workoutType}
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
            {status.loading ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={workoutType}
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
          >
            {selectionModel.length !== 0 ? (
              <Button
                sx={{ borderRadius: "10px", mb: 1 }}
                variant="contained"
                onClick={handleView}
              >
                View
              </Button>
            ) : (
              <Grid item sx={{ mb: 10 }}>
                {" "}
              </Grid>
            )}
            {selectionModel?.length !== 0 && (
              <Button
                sx={{ borderRadius: "10px", mb: 1, ml: 20 }}
                variant="contained"
                onClick={() => {
                  onDelete(
                    selectionModel[0],
                    value === 2 ? "custom" : value === 0 ? "completed" : ""
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
