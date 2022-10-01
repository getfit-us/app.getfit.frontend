import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import useProfile from "../hooks/useProfile";
import { Agriculture, Flag, NoEncryption } from "@mui/icons-material";
import StraightenIcon from "@mui/icons-material/Straighten";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ViewWorkoutModal from "./Workout/ViewWorkoutModal";
import ViewMeasurementModal from "./Measurements/ViewMeasurementModal";
import Messages from "./Notifications/Messages";
import ActivityFeed from "./Notifications/ActivityFeed";
import Goals from "./Notifications/Goals";

const Overview = ({ loadingApi }) => {
  const { state } = useProfile();
  const theme = useTheme();
  const [localMeasurements, setLocalMeasurements] = useState([]);
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);

  //need to update calendar display for small screens to day instead of month!

  useEffect(() => {
    if (state.measurements.length > 0) {
      setLocalMeasurements((prev) => {
        const updated = [];
        state.measurements.map((measurement) => {
          updated.push({
            title: "Measurement",
            id: measurement._id,
            date: measurement.date,
            weight: measurement.weight,
          });
        });
        if (state.completedWorkouts.length > 0) {
          state.completedWorkouts.map((workout) => {
            updated.push({
              title: `${workout.name} Workout`,
              id: workout._id,
              date: workout.dateCompleted,
            });
          });
        }

        //add goals to calendar

        if (state.profile.goals.length > 0) {
          state.profile.goals.map((goal) => {
            updated.push({
              title: `Goal: ${goal.goal} `,
              id: goal.id,
              date: goal.date,
            });
          });
        }

        return updated;
      });
    }

    document.title = "My Overview";
  }, [state.measurements, state.completedWorkouts, state.profile.goals]);

  // need to pull all data and update state.
  //display calendar with workout history and measurements

  const styles = {
    event: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: 4,
      borderRadius: "10px",
      whiteSpace: "wrap",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  console.log(localMeasurements);
  return (
    <div style={{ marginTop: "3rem", minWidth: "100%", marginBottom: "3rem" }}>
      <ViewWorkoutModal
        open={openWorkout}
        viewWorkout={viewWorkout}
        handleModal={handleWorkoutModal}
      />
      <ViewMeasurementModal
        open={openMeasurement}
        viewMeasurement={viewMeasurement}
        handleModal={handleMeasurementModal}
      />

      {/* {messages && <Messages/>} */}
      {loadingApi && <CircularProgress />}
      <Grid container spacing={1} style={{ display: "flex" }}>
        <Grid
          item
          xs={12}
          sm={6}
          style={{ display: "flex", justifyContent: "start" }}
        >
          <ActivityFeed />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          style={{ display: "flex", justifyContent: "start" }}
        >
          <Goals />
        </Grid>
      </Grid>

      {!loadingApi && (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={localMeasurements}
          eventColor={theme.palette.primary.main}
          eventDisplay="list-item"
          eventContent={(info) => {
            return (
              <>
                <Tooltip title={info.event.title} arrow placement="top">
                  {info.event.title.includes("Workout") ? (
                    <Fab
                      color="primary"
                      size="small"
                      onClick={() => {
                        // console.log(info.event._def.publicId);
                        setViewWorkout(
                          state.completedWorkouts.filter(
                            (w) => w._id === info.event._def.publicId
                          )
                        );

                        handleWorkoutModal();
                      }}
                    >
                      <FitnessCenterIcon fontSize="small" />
                    </Fab>
                  ) : info.event.title.includes("Goal") ? (
                    <Fab
                      color="success"
                      size="small"
                      // onClick={() => {
                      //   // console.log(info.event._def.publicId);
                      //   setViewMeasurement(
                      //     state.measurements.filter(
                      //       (m) => m._id === info.event._def.publicId
                      //     )
                      //   );

                      //   handleMeasurementModal();
                      // }}
                    >
                      <Flag fontSize="small" />
                    </Fab>
                  ) : (
                    <Fab
                      color="success"
                      size="small"
                      onClick={() => {
                        // console.log(info.event._def.publicId);
                        setViewMeasurement(
                          state.measurements.filter(
                            (m) => m._id === info.event._def.publicId
                          )
                        );

                        handleMeasurementModal();
                      }}
                    >
                      <StraightenIcon fontSize="small" />
                    </Fab>
                  )}
                </Tooltip>
              </>
            );
          }}
        />
      )}
    </div>
  );
};

export default Overview;

const styles = {
  goals: {
    display: "flex",

    justifyContent: "end",
  },
};
