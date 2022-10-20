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
  Agriculture,
  CalendarViewDayRounded,
  Flag,
  FlagCircle,
  FlagRounded,
  NoEncryption,
  Start,
} from "@mui/icons-material";
import StraightenIcon from "@mui/icons-material/Straighten";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ViewWorkoutModal from "./Workout/Modals/ViewWorkoutModal";
import ViewMeasurementModal from "./Measurements/ViewMeasurementModal";
import Messages from "./Notifications/Messages";
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
  const [localMeasurements, setLocalMeasurements] = useState([]);
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openGoal, setOpenGoal] = useState(false);
  const [goal, setGoal] = useState(null);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleCalendarModal = () => setOpenCalendar((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const handleGoalModal = () => setOpenGoal((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  const smScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const handleCalendar = (value, event) => {
    // check if date has event
    let match = state.calendar.filter(
      (event) =>
        new Date(event.start).toDateString() === new Date(value).toDateString()
    );
    console.log(match, value);
    if (match.length > 0) {
      console.log(match);
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
        console.log("found goal start");
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
      }
    });
  };

  // console.log(data, state.calendar);

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
            type: "measurement",
          });
        });
      }
      if (state.completedWorkouts?.length > 0) {
        state.completedWorkouts.map((workout) => {
          updated.push({
            title: `Workout`,
            id: workout._id,
            date: new Date(workout.dateCompleted).toISOString(),
            type: "workout",
          });
        });
      }

      //add goals to calendar

      state.calendar.map((calendar) => {
        calendar.id = calendar._id;
        console.log(calendar);
        updated.push(calendar);
      });

      return updated;
    });

    document.title = "My Overview";
  }, [
    state.measurements.length,
    state.completedWorkouts.length,
    state.profile.goals.length,
    state.calendar.length,
  ]);

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

  const handleEventClick = (info) => {
    if (info.event.extendedProps.type === "workout") {
      setViewWorkout(
        state.completedWorkouts.filter(
          (w) => w._id === info.event._def.publicId
        )
      );

      handleWorkoutModal();
    } else if (info.event.extendedProps.type === "measurement") {
      setViewMeasurement(
        state.measurements.filter((m) => m._id === info.event._def.publicId)
      );

      handleMeasurementModal();
    } else if (info.event.extendedProps.type === "goal") {
      setGoal(info.event);
      handleGoalModal();
    }
  };

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

      <GoalModal open={openGoal} goal={goal} handleModal={handleGoalModal} />
      <CalendarModal open={openCalendar} handleModal={handleCalendarModal} />

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

      {state.status.loading ? (
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
                onChange={handleCalendar}
                tileContent={renderTile}
                // value={[new Date('10/18/2022'), new Date('10/31/2022')]}
                // tileContent={({ activeStartDate, date, view }) => view === 'month' && date.getDay() === 0 ? <div className="container" style={{p: 1}}><p >Sunday!</p></div> : null}
                onClickDay={handleCalendarModal}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <CalendarInfo /> */}
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
