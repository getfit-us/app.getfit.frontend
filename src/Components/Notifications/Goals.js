import {
  Fab,
  Grid,
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
import { DirectionsRun, FitnessCenter, Flag, Help } from "@mui/icons-material";
import {
  getCalendarData,
  getSingleCustomWorkout,
  getActiveNotifications,
} from "../../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { colors } from "../../Store/colors";
import usePagination from "../../hooks/usePagination";

const Goals = ({ trainerManagedGoals, setCurrentEvent }) => {
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const calendar = useProfile((state) => state.calendar);

  const [loadingCalendar, calendarData, calendarError] =
    useApiCallOnMount(getCalendarData);
  const [
    loadingActiveNotifications,
    activeNotifications,
    activeNotificationsError,
  ] = useApiCallOnMount(getActiveNotifications);
  const [status, setStatus] = useState({ loading: false, error: null });
  const today = new Date().getTime();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  let [page, setPage] = useState(1);

  const data = usePagination(
    trainerManagedGoals ? trainerManagedGoals : calendar,
    3
  );
  const count = Math.ceil(
    trainerManagedGoals ? trainerManagedGoals : calendar.length / 3
  );

  const handleChangePage = (e, p) => {
    setPage(p);
    data.jump(p);
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
      ) : (<>
        <span>Complete by: {new Date(event.end).toDateString()}</span>
        <span style={{ display: "block" }}>
        You have{" "}
        {Math.floor(
          (new Date(event.end).getTime() - today) / (1000 * 60 * 60 * 24)
        ) + 1}{" "}
        days left to complete your goal
      </span>
      </>
      )}
    </div>
  );



  const handleClick = (event) => {
    if (event.type === "task") {
      getSingleCustomWorkout(axiosPrivate, event.activityId).then((status) => {
        if (status.error === false && status.data !== null) {
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
    } else if (event.type === "goal") {
      setCurrentEvent(event);
      const calendarInfo = document.getElementById("calendar-info");
      setTimeout(() => {
        calendarInfo.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <Paper
      sx={{
        padding: 2,

        marginBottom: 3,
        minWidth: "100%",
      }}
      style={styles.goals}
    >
      <form>
        <Grid
          container
          spacing={1}
          style={styles.container}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Grid item xs={12}>
            <h2 className="page-title" id="goals">
              Goals / Tasks
            </h2>
          </Grid>
          {calendar?.length === 0 && loadingCalendar ? (
            <Grid item xs={12}>
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
            </Grid>
          ) : trainerManagedGoals?.length > 0 ? (
            <Grid item xs={12}>
              <List>
                {trainerManagedGoals?.map((event, index) => {
                  return (
                    <ListItem
                      key={event._id}
                      disablePadding
                      style={styles.listItem}
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
            </Grid>
          ) : calendar?.length > 0 ? (
            <Grid item xs={12}>
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
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              style={{
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h2>No Goals or Tasks Found</h2>
              <p>Click on the calendar to set a goal!</p>
            </Grid>
          )}
          <Pagination
            page={page}
            count={count}
            variant="outlined"
            color="primary"
            onChange={handleChangePage}
            sx={{ mt: 2, alignItems: "center", justifyContent: "center" }}
          />
        </Grid>
      </form>
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
    border: "1px solid #e0e0e0",
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
