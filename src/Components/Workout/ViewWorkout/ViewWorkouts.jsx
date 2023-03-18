import { useState } from "react";

import { Grid, CircularProgress, Button, Box, Tabs, Tab } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery";

import ViewWorkoutModal from "../Modals/ViewWorkoutModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import DataGridViewWorkouts from "./DataGridViewWorkouts";
import { useProfile, useWorkouts } from "../../../Store/Store";
import useSWR from "swr";
import { getSWR, InitialWorkout } from "../../../Api/services";
import TabPanel from "../../TabPanel";
import { a11yProps } from "../../TabPanel";

const ViewWorkouts = ({ trainerWorkouts, trainerClientId }) => {
  const delCustomWorkout = useWorkouts((state) => state.delCustomWorkout);
  const delCompletedWorkout = useWorkouts((state) => state.delCompletedWorkout);
  const clientId = useProfile((state) => state.profile.clientId);

  const { data: customWorkouts, isLoading: loadingCustomWorkouts } = useSWR(
    `/custom-workout/client/${clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      fallbackData: InitialWorkout,
    }
  );

  const { data: assignedCustomWorkouts, isLoading: loadingAssignedWorkouts } =
    useSWR(
      `/custom-workout/trainer/${clientId}`,
      (url) => getSWR(url, axiosPrivate),
      {
        fallbackData: InitialWorkout,
      }
    );

  const { data: completedWorkouts, isLoading: loadingCompletedWorkouts } =
    useSWR(
      `/completed-workouts/client/${clientId}`,
      (url) => getSWR(url, axiosPrivate),
      {
        fallbackData: InitialWorkout,
      }
    );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [selectionModel, setSelectionModel] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const [viewWorkout, setViewWorkout] = useState({});
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
      if (trainerClientId) {
        setViewWorkout(
          trainerWorkouts?.completedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )[0]
        );
      } else {
        setViewWorkout(
          completedWorkouts.filter((w) => w._id === selectionModel[0])[0]
        );
      }
    } else if (value === 1) {
      //for tab assignedWorkouts
      if (trainerClientId) {
        setViewWorkout(
          trainerWorkouts?.assignedWorkouts.filter(
            (w) => w._id === selectionModel[0]
          )[0]
        );
      } else {
        setViewWorkout(
          assignedCustomWorkouts.filter((w) => w._id === selectionModel[0])[0]
        );
      }
    } else if (value === 2) {
      //for created workouts
      setViewWorkout(
        customWorkouts.filter((w) => w._id === selectionModel[0])[0]
      );

      console.log(customWorkouts.filter((w) => w._id === selectionModel[0]))
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
        <h2 className="page-title">View Workout</h2>

          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Create Workout tabs"
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Completed" {...a11yProps(0)} />
            <Tab label="Assigned" {...a11yProps(1)} />
            <Tab label="Created" {...a11yProps(2)} />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          {/* Completed Workouts */}

          <TabPanel value={value} index={0}>
            {loadingCompletedWorkouts ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={
                  trainerClientId
                    ? trainerWorkouts?.completedWorkouts
                    : completedWorkouts
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
            {loadingAssignedWorkouts ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={
                  trainerClientId
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
            {loadingCustomWorkouts ? (
              <CircularProgress />
            ) : (
              <DataGridViewWorkouts
                tabValue={value}
                workoutType={customWorkouts}
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
