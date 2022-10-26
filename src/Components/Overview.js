import { useState, useEffect, useRef } from "react";

import {
  Button,
  CircularProgress,
  Fab,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useProfile from "../hooks/useProfile";
import {
  DirectionsRun,
  Event,
  Flag,
  
} from "@mui/icons-material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ViewWorkoutModal from "./Workout/Modals/ViewWorkoutModal";
import ViewMeasurementModal from "./Measurements/ViewMeasurementModal";
import ActivityFeed from "./Notifications/ActivityFeed";
import Goals from "./Notifications/Goals";
import CalendarModal from "./Calendar/CalendarModal";
import useAxios from "../hooks/useAxios";
import GoalModal from "./Calendar/GoalModal";
import { Calendar } from "react-calendar";
import CalendarInfo from "./Calendar/CalendarInfo";

const Overview = () => {
  const { state } = useProfile();
  const theme = useTheme();
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleCalendarModal = () => setOpenCalendar((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);


  const handleCalendar = (value, event) => {
    // check if date has event and set current event if it does
    let match = state.calendar.filter(
      (event) =>
        new Date(event.end).toDateString() === new Date(value).toDateString()
    );
    
    if (match.length > 0) {
      setCurrentEvent(match[0]);
      // console.log(match);
    } else {
      setCurrentEvent(null);
      setCurrentDate(new Date(value).toISOString().split('T')[0]);
      handleCalendarModal(); //open modal to add event
    }
  };

  const { data: calendarData, loading } = useAxios({
    url: `/users/calendar/${state.profile.clientId}`,
    method: "GET",
    type: "SET_CALENDAR",
  });

  const renderTile = ({ activeStartDate, date, view }) => {
    return state?.calendar?.map((event) => {
      if (
        new Date(event.end).toDateString() ===
          new Date(date).toDateString() &&
        event.type === "goal"
      ) {
        
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
            }}
          >
    
            {" "}
            <Fab color="success" size="small">
              <Flag />
            </Fab>
            <span>Finish Goal</span>
          </div>
        );
      } else if (  new Date(event.end).toDateString() ===
      new Date(date).toDateString() &&
    event.type === "task") {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
          }}
        >
  
          {" "}
          <Fab color={event.title === 'cardio' ? 'warning' : 'primary'} size="small">
            {event.title === 'cardio' ? <DirectionsRun/> : <FitnessCenterIcon/>}
          </Fab>
          {event.title === 'cardio' ? <span>Cardio</span> : <span>Workout</span>} 
        </div>
      );
    }
    });
  };

 



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

  console.log(state.notifications);


  return (
    <div style={{ marginTop: "3rem", minWidth: "100%", marginBottom: "3rem" }}>
      <ViewWorkoutModal
        open={openWorkout}
        viewWorkout={viewWorkout}
        handleModal={handleWorkoutModal}
        loading={loading}
      />
      <ViewMeasurementModal
        open={openMeasurement}
        viewMeasurement={viewMeasurement}
        handleModal={handleMeasurementModal}
      />

      <CalendarModal open={openCalendar} handleModal={handleCalendarModal} currentDate={currentDate}/>

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
          <Goals calendarData={calendarData} />
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress size={100} />
      ) : (
        <>
          <Grid container sx={{ display: "flex", justifyContent: "center" }}>
            <Grid item xs={12} sm={6}>
              {" "}
              <Calendar
                minDetail="year"
                maxDetail="month"
                next2Label={null}
                prev2Label={null}
                showNeighboringMonth={false}
                // onChange={handleCalendar}
                tileContent={renderTile}
                // value={[new Date('10/18/2022'), new Date('10/31/2022')]}
                // tileContent={({ activeStartDate, date, view }) => view === 'month' && date.getDay() === 0 ? <div className="container" style={{p: 1}}><p >Sunday!</p></div> : null}
                onClickDay={handleCalendar}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CalendarInfo currentEvent={currentEvent}  />
            </Grid>
          </Grid>
        </>
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
