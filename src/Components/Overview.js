import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'

import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
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
import CalendarModal from "./Calendar/CalendarModal";

const Overview = () => {
  const { state } = useProfile();
  const theme = useTheme();
  const [localMeasurements, setLocalMeasurements] = useState([]);
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleCalendarModal = () => setOpenCalendar((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);

  const smScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  //need to update calendar display for small screens to day instead of month!

  useEffect(() => {
   
      setLocalMeasurements((prev) => {
        const updated = [];
        if (state.measurements?.length > 0) {
        state.measurements.map((measurement) => {
          updated.push({
            title: "Measurement",
            id: measurement._id,
            date: measurement.date,
            weight: measurement.weight,
          });
        });

      } 
      if (state.completedWorkouts?.length > 0) {
          state.completedWorkouts.map((workout) => {
            updated.push({
              title: `${workout.name} Completed Workout`,
              id: workout._id,
              date: new Date(workout.dateCompleted).toISOString(),
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
   
    document.title = "My Overview";
  }, [state.measurements.length, state.completedWorkouts.length, state.profile.goals.length]);

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



  const handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   })
    // }
  }


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
      <CalendarModal
        open={openCalendar}
        handleModal={handleCalendarModal}
      />
      {/* {messages && <Messages/>} */}
      {state.status.loading && <CircularProgress />}
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

      {!state.status.loading && (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView={smScreen ? "dayGridMonth" : 'dayGridWeek' }
          events={localMeasurements}
          eventColor={theme.palette.primary.main}
          select={handleCalendarModal}
          
          // eventContent={renderEventContent} // custom render function
          // eventClick={this.handleEventClick}
          // eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
  /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          eventDisplay="list-item"
          editable={true}
          selectable={true}
          selectMirror={true}
          headerToolbar={{
            left: smScreen ? 'prev,next today' : 'prev,next',
            center: 'title',
            right: smScreen ? 'dayGridMonth,dayGridWeek' : ''
          }}
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
