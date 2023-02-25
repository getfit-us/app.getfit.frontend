import { useState } from "react";

import { Fab, Grid } from "@mui/material";
import { useProfile, useWorkouts } from "../Store/Store";
import { DirectionsRun, Flag } from "@mui/icons-material";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import ActivityFeed from "./Notifications/ActivityFeed";
import Goals from "./Notifications/Goals";
import CalendarModal from "./Calendar/CalendarModal";
import { Calendar } from "react-calendar";
import CalendarInfo from "./Calendar/CalendarInfo";
import { getSWR } from "../Api/services";
import useSWR from "swr";

import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const calendar = useProfile((store) => store.calendar);
  const profile = useProfile((store) => store.profile);
  const setTrainer = useProfile((store) => store.setTrainer);
  const setClients = useProfile((store) => store.setClients);
  const setActiveNotifications = useProfile(
    (store) => store.setActiveNotifications
  );

  const [openCalendar, setOpenCalendar] = useState(false);
  const handleCalendarModal = () => setOpenCalendar((prev) => !prev);

  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);

  const { data: dataTrainer, error: errorTrainer } = useSWR(
    profile.trainerId ? `/trainers/${profile.trainerId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      onSuccess: (data) => setTrainer(data.data),
    }
  );
  //api call to get all the current trainers clients if the user is a trainer

  const { data: dataClient, error: errorClient } = useSWR(
    profile.roles.includes(2) ? `/clients/all/${profile.clientId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: true,
      revalidateOnMount: false,
      onSuccess: (data) => setClients(data.data),
    }
  );

  const {
    data: activeNotifications,
    error: errorActiveNotificaitons,
    isLoading: loadingActiveNotifications,
  } = useSWR(
    `/notifications/active/${profile.clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: true,
      revalidateOnMount: false,
      onSuccess: (data) => setActiveNotifications(data.data),
    }
  );

  const { data: singleCustomWorkout, error: errorSingleCustomWorkout } = useSWR(
    currentEvent?.activityId
      ? `/custom-workout/${currentEvent.activityId}`
      : null,
    (url) => getSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      onSuccess: (data) => {
        setManageWorkout({
          ...data.data,
          taskId: currentEvent._id,
        });
        if (localStorage.getItem("startWorkout")) {
          // console.log('deleting localstorage')
          localStorage.removeItem("startWorkout");
        }
        navigate("/dashboard/start-workout");
      },
    }
  );

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

  const handleEvent = (event) => {
    if (event.type === "task") {
      setCurrentEvent(event);
    }
  };

  const renderTile = ({ activeStartDate, date, view }) => {
    //find duplicate events on the same day

    return calendar?.map((event, index, arr) => {
      // need to check if multiple events are on the same day
      // if so, Text Saying "Multiple Events"
      // if not, display event title
      // if no events, display nothing

      if (
        new Date(event.end).toDateString() === new Date(date).toDateString()
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
            <Fab
              color={
                event.title.includes("Cardio")
                  ? "warning"
                  : event.title.includes("Workout")
                  ? "primary"
                  : "success"
              }
              size="small"
              component="span"
              onClick={() => handleEvent(event)}
            >
              {event.title.includes("Cardio") ? (
                <DirectionsRun />
              ) : event.title.includes("Workout") ? (
                <FitnessCenterIcon />
              ) : (
                <Flag />
              )}
            </Fab>
            {event.title.includes("Cardio") ? (
              <span style={{ fontSize: 11 }}>Cardio</span>
            ) : event.title.includes("Workout") ? (
              <span style={{ fontSize: 11 }}>Workout</span>
            ) : (
              <span style={{ fontSize: 11 }}>Finish Goal</span>
            )}
          </div>
        );
      }
    });
  };

  document.title = "GetFit Dashboard | Overview";


  return (
    <div style={{ marginTop: "3rem", minWidth: "100%", marginBottom: "3rem" }}>
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
          <Goals setCurrentEvent={setCurrentEvent} />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          style={{ display: "flex", justifyContent: "start" }}
        >
          <ActivityFeed />
        </Grid>
      </Grid>

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
          <CalendarInfo
            currentEvent={currentEvent}
            setCurrentEvent={setCurrentEvent}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Overview;
