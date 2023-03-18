import {
  Button,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Paper,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useProfile, useWorkouts } from "../../Store/Store";
import { DirectionsRun, FitnessCenter, Flag } from "@mui/icons-material";

import { colors } from "../../Store/colors";
import usePagination from "../../hooks/usePagination";
import "./Goals.css";
import { getSWR } from "../../Api/services";
import useSWR from "swr";

const Goals = ({ trainerManagedGoals, setCurrentEvent }) => {
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const clientId = useProfile((state) => state.profile.clientId);
  const [workoutId, setWorkoutId] = useState(null);

  const {
    data: calendarData,
    isLoading: calendarLoading,
    error: calendarError,
  } = useSWR(
    `/users/calendar/${clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (data) => {
        setCalendar(data);
      },
    }
  );

  const {
    data: singleWorkout,
    isLoading: singleWorkoutLoading,
    error: singleWorkoutError,
  } = useSWR(
    workoutId ? `/custom-workout/${workoutId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (data) => {
        handleGetSingleWorkout(data);
      },
    }
  );

  const today = new Date().getTime();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  let [page, setPage] = useState(1);

  const data = usePagination(
    trainerManagedGoals ? trainerManagedGoals : calendarData,
    3
  );
  const count = Math.ceil(
    trainerManagedGoals ? trainerManagedGoals : calendarData?.length / 3
  );

  const handleChangePage = (e, p) => {
    setPage(p);
    data.jump(p);
  };

  const handleGetSingleWorkout = (data) => {
    if (data) {
      setManageWorkout({
        ...data,
        taskId: workoutId,
      });

      //check localstorage for workout and if it exists delete it
      if (localStorage.getItem("startWorkout")) {
        // console.log('deleting localstorage')
        localStorage.removeItem("startWorkout");
      }
      navigate("/dashboard/start-workout");
    }
  };

  const renderGoal = (event) => (
    <div style={styles.taskContainer}>
      <h3 style={{ textDecoration: "underline", alignSelf: "center" }}>
        <Fab color="success" size="small" sx={{ mr: 1 }}>
          <Flag />
        </Fab>
        GOAL
      </h3>

      <span style={{ fontWeight: "bolder", display: "block" }}>
        Goal: {event.title.toUpperCase()}{" "}
      </span>

      <span>
        Start: {new Date(event.start).toDateString()}{" "}
        {new Date(event.end).getTime() < today ? (
          <span style={styles.late}>
            Finish: {new Date(event.end).toDateString()}
          </span>
        ) : (
          <>
            <span style={{ display: "block" }}>
              Finish: {new Date(event.end).toDateString()}
            </span>
            <span style={{ display: "block" }}>
              You have{" "}
              {Math.floor(
                (new Date(event.end).getTime() - today) / (1000 * 60 * 60 * 24)
              ) + 1}{" "}
              days left to complete your goal
            </span>
          </>
        )}
      </span>
    </div>
  );

  const renderTask = (event) => (
    <div style={styles.taskContainer}>
      <h3
        style={{
          alignSelf: "center",
          borderRadius: 10,
          textDecoration: "underline",
        }}
      >
        <Fab
          color={
            event.title.includes("Workout")
              ? "primary"
              : event.title.includes("Cardio")
              ? "warning"
              : "success"
          }
          size="small"
          sx={{ mr: 1 }}
        >
          {event.title.includes("Workout") ? (
            <FitnessCenter />
          ) : event.title.includes("Cardio") ? (
            <DirectionsRun />
          ) : (
            <Flag />
          )}
        </Fab>
        TASK
      </h3>

      <span style={{ fontWeight: "bolder", display: "block" }}>
        {event.title.toUpperCase()}{" "}
      </span>

      {new Date(event.end).getTime() < today ? (
        <>
          <span style={styles.late}>
            Past Due: {new Date(event.end).toDateString()}
          </span>
          <span style={styles.late}>Click to load and complete task</span>
        </>
      ) : (
        <>
          <span>Complete by: {new Date(event.end).toDateString()}</span>
          <span style={{ display: "block" }}>
            You have{" "}
            {Math.floor(
              (new Date(event.end).getTime() - today) / (1000 * 60 * 60 * 24)
            ) + 1}{" "}
            days left to complete your task
          </span>
        </>
      )}
      {event?.notes && (
        <>
          <h5 style={{ textDecoration: "underline" }}>Notes</h5>
          <span style={{ display: "block", marginBottom: 1 }}>
            {event.notes}
          </span>
        </>
      )}
    </div>
  );

  const handleClick = (event) => {
    if (event.type === "task") {
      setWorkoutId(event.activityId);
      handleGetSingleWorkout(singleWorkout);
    } else if (event.type === "goal") {
      const calendarInfo = document.getElementById("calendar-info");
      setTimeout(() => {
        calendarInfo.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <Paper
      sx={{
        marginBottom: 3,
        minWidth: "100%",
       

      }}
      style={styles.goals}
    >
      <div className="goals-container">
        <h2 className="page-title" id="goals">
          Goals / Tasks
        </h2>
        <span style={styles.help}>
          {calendarData?.length > 0 &&
            "Need Help ? (click on the task / goal to load and complete)"}
        </span>

        {calendarData?.length === 0 && calendarLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={60}
              animation="wave"
              sx={{ mt: 1, mb: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={60}
              animation="wave"
              sx={{ mt: 1, mb: 1 }}
            />
            <Skeleton
              variant="rectangular"
              width={"100%"}
              animation="wave"
              height={60}
              sx={{ mt: 1, mb: 1 }}
            />
          </>
        ) : trainerManagedGoals?.length > 0 ? (
          <>
            <List>
              {trainerManagedGoals?.map((event, index) => {
                return (
                  <ListItem
                    key={event._id}
                    disablePadding
                    style={styles.listItem}
                  >
                    <ListItemButton
                     
                      onClick={() => {
                        setCurrentEvent(event);
                        handleClick(event);
                      }}
                    >
                      <ListItemText
                        id={event._id}
                        primary={
                          event.type === "goal"
                            ? renderGoal(event)
                            : renderTask(event)
                        }
                        secondary={`Created: ${event.created}`}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </>
        ) : calendarData?.length > 0 ? (
          <>
            <List>
              {data.currentData().map((event, index) => {
                return (
                  <ListItem
                    key={event._id}
                    disablePadding
                    style={
                      new Date(event.end).getTime() < today
                        ? styles.taskOverDue
                        : styles.listItem
                    }
                  >
                    <ListItemButton
                      role={undefined}
                      onClick={() => handleClick(event)}
                    >
                      <ListItemText
                        id={event._id}
                        primary={
                          event.type === "goal"
                            ? renderGoal(event)
                            : renderTask(event)
                        }
                        secondary={`Created: ${event.created}`}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            {trainerManagedGoals?.length > 0 && (
              <Button onClick={handleDeleteAllGoals} variant="outlined">
                Delete All Goals
              </Button>
            )}
          </>
        ) : (
          <>
            <h2>No Goals or Tasks Found</h2>
            <p>Click on the calendar to set a goal!</p>
          </>
        )}
        <Pagination
          hidden={count ? false : true}
          page={page ? page : 1}
          count={count || 0}
          variant="outlined"
          color="primary"
          onChange={handleChangePage}
          sx={{ mt: 2, alignItems: "center", justifyContent: "center" }}
        />
      </div>
    </Paper>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "start",
    marginBottom: 3,
    spacing: 1,
    gap: 1,
    overflow: "hidden",

    scrollBehavior: "smooth",
    width: "100%",
  },
  header: {
    padding: "10px",
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#3070af",
    color: "white",
  },
  help: {
    fontStyle: "italic",
  },
  late: {
    color: colors.error,
    display: "block",
  },
  listItem: {
    border: "3px solid",
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 1,
    marginTop: 5,
  },
  goalsOverDue: {
    border: "3px solid red",
  },
  goals: {
    border: '3px solid #689ee1',
    boxShadow: '4px 8px 8px hsl(0deg 0% 0% / 0.38)',

  borderRadius: '10px',
  },
  taskContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  taskOverDue: {
    border: "3px solid",
    borderColor: colors.error,
    borderRadius: 10,
    padding: 5,
    marginTop: 5,
  },
};

export default Goals;
