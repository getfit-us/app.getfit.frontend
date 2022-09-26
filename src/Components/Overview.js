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
import { Agriculture, NoEncryption } from "@mui/icons-material";
import StraightenIcon from "@mui/icons-material/Straighten";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ViewWorkoutModal from "./Workout/ViewWorkoutModal";
import ViewMeasurementModal from "./Measurements/ViewMeasurementModal";
import Messages from "./Notifications/Messages";
import ActivityFeed from "./Notifications/ActivityFeed";

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

        return updated;
      });
    }
   

    document.title = "My Overview";
  }, [state.measurements, state.completedWorkouts]);

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

  console.log(state.notifications)

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
      <ActivityFeed />
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
