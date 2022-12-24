import { useState } from "react";

import { Fab, Grid } from "@mui/material";
import { useProfile, useWorkouts } from "../Store/Store";
import { DirectionsRun, Flag } from "@mui/icons-material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ViewWorkoutModal from "./Workout/Modals/ViewWorkoutModal";
import ViewMeasurementModal from "./Measurements/ViewMeasurementModal";
import ActivityFeed from "./Notifications/ActivityFeed";
import Goals from "./Notifications/Goals";
import CalendarModal from "./Calendar/CalendarModal";
import { Calendar } from "react-calendar";
import CalendarInfo from "./Calendar/CalendarInfo";
import useApiCallOnMount from "../hooks/useApiCallOnMount";
import { getTrainerInfo, getClientData, getSingleCustomWorkout } from "../Api/services";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const calendar = useProfile((store) => store.calendar);
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
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const [loadingTrainer, dataTrainer, errorTrainer] = useApiCallOnMount(getTrainerInfo);
  const [loadingClient, dataClient, errorClient] = useApiCallOnMount(getClientData);



  const handleCalendar = (value, event) => {
    // check if date has event and set current event if it does
    let match = calendar.filter(
      (event) =>
        new Date(event.end).toDateString() === new Date(value).toDateString()
    );

    if (match.length > 0) {
      setCurrentEvent(match[0]);
      // console.log(match);
    } else {
      setCurrentEvent(null);
      setCurrentDate(new Date(value).toISOString().split("T")[0]);
      handleCalendarModal(); //open modal to add event
    }
  };

  const handleClick = (event) => {
    if (event.type === "task") {
      getSingleCustomWorkout(
        axiosPrivate,
        event.activityId
      ).then((status) => {
        if (
          status.error === false &&
          status.data !== null
        ) {
          setManageWorkout({
            ...status.data,
            taskId: event._id,
          });

          //check localstorage for workout and if it exists delete it
          if (localStorage.getItem("startWorkout")) {
            // console.log('deleting localstorage')
            localStorage.removeItem("startWorkout");
          }
          navigate("/dashboard/start-workout");
        }
      });
    }
  };


  const renderTile = ({ activeStartDate, date, view }) => {
    return calendar?.map((event) => {
      if (
        new Date(event.end).toDateString() === new Date(date).toDateString() &&
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
            key={event._id}
          >
            {" "}
            <Fab color="success" size="small">
              <Flag />
            </Fab>
            <span style={{fontSize: 11}}>Finish Goal</span>
          </div>
        );
      } else if (
        new Date(event.end).toDateString() === new Date(date).toDateString() &&
        event.type === "task"
        
      ) {
        console.log(event.title);
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
            }}
            key={event._id}

          >
            {" "}
            <Fab
              color={event.title.includes("Cardio") ? "warning" : "primary"}
              size="small"
              onClick={() => {handleClick(event)}}
            >
              {event.title.includes("Cardio") ? (
                <DirectionsRun />
              ) : (
                <FitnessCenterIcon />
              )}
            </Fab>
            {event.title.includes("Cardio") ? (
              <span style={{fontSize: 11}}>Cardio</span>
            ) : (
              <span style={{fontSize: 11}}>Workout</span>
            )}
          </div>
        );
      }
    });
  };

  document.title = "GetFit Dashboard | Overview";

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
        currentDate={currentDate}
      />

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
            
              onClickDay={handleCalendar}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CalendarInfo currentEvent={currentEvent} />
          </Grid>
        </Grid>
      </>
    </div>
  );
};

export default Overview;


