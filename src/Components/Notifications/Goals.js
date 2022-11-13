import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import NotificationSnackBar from "./SnackbarNotify";
import { useEffect } from "react";
import { useProfile, useWorkouts } from "../../Store/Store";
import { Check } from "@mui/icons-material";

const Goals = ({ trainerManagedGoals }) => {
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const deleteCalendarEvent = useProfile((state) => state.deleteCalendarEvent);
  const addNotification = useProfile((state) => state.addNotification);
  const deleteNotification = useProfile((state) => state.deleteNotification);
  const calendar = useProfile((state) => state.calendar);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const profile = useProfile((state) => state.profile);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tasks, setTasks] = useState(
    activeNotifications?.filter((notification) => notification.type === "task")
      .length
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const today = new Date().getTime();
  const navigate = useNavigate();

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });
  const [snackMsg, setSnackMsg] = useState({
    message: "",
    error: false,
  });
  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const getCustomWorkout = async (id) => {
    setStatus({ loading: true, error: false, success: false });

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      setManageWorkout(response.data);
      setStatus({ loading: false, error: false, success: true });

      //check localstorage for workout and if it exists delete it
      if (localStorage.getItem("startWorkout")) {
        // console.log('deleting localstorage')
        localStorage.removeItem("startWorkout");
      }
      navigate("/dashboard/start-workout");

      // reset();
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };
  const handleCompleteGoal = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/users/calendar/${id}`, {
        signal: controller.signal,
        withCredentials: true,
      });

      deleteCalendarEvent({ _id: id });

      //need to delete from notifications also
      deleteNotification({ _id: id });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  const handleAddNotification = async (notification) => {
    console.log(notification);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/notifications", notification, {
        signal: controller.signal,
      });
      console.log(response.data);
      addNotification(response.data);
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    const overDue = trainerManagedGoals?.length // find any overdue goals
      ? trainerManagedGoals?.filter((goal) => {
          return new Date(goal.end).getTime() < today;
        })
      : calendar?.filter((goal) => {
          return new Date(goal.end).getTime() < today;
        });

    //if overdue goals exist add notifications to state
    if (overDue?.length) {
      overDue.forEach((item) => {
        //check if state already contains notification before adding
        if (
          activeNotifications.filter((notification) => {
            return (
              notification.activityID === item.activityId ||
              notification.activityId === item.activityId
            );
          }).length === 0
        ) {
          console.log("adding notification");

          if (item.type === "goal") {
            let notification = {
              is_read: false,
              message: `You have an overdue goal: ${item.title}. `,
              type: "task",
              sender: { id: profile.clientId, name: profile.firstname },
              activityId: item.activityId,
              receiver: { id: profile?.clientId },
            };
            handleAddNotification(notification);
          } else if (item.type === "task") {
            let notification = {
              is_read: false,
              message: `Complete ${item.title}.`,
              type: "task",
              sender: { id: profile.clientId, name: profile.name },
              activityId: item.activityId,

              receiver: { id: profile?.clientId },
            };
            handleAddNotification(notification);
          }
        }
      });
    }
    setTasks(
      activeNotifications?.filter(
        (notification) => notification.type === "task"
      ).length
    );
  }, [calendar, trainerManagedGoals, activeNotifications, profile]);

  console.log(activeNotifications);
  return (
    <Paper
      sx={{
        padding: 2,

        marginBottom: 3,
        minWidth: "100%",
        border: tasks > 0 ? "3px solid red" : "1px solid #e0e0e0",
      }}
    >
      <NotificationSnackBar
        message={snackMsg.message}
        openSnackbar={openSnackbar}
        setOpenSnackbar={setOpenSnackbar}
        type={snackMsg.error ? "error" : "success"}
      />{" "}
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
              Goals
            </h2>
          </Grid>
          <Grid item xs={12}>
            <List>
              {trainerManagedGoals?.length > 0
                ? trainerManagedGoals.map((event, index) => {
                    return (
                      <ListItem
                        key={event._id}
                        disablePadding
                        secondaryAction={
                          event.type !== "task" && (
                            <Tooltip title="Mark Completed">
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  handleCompleteGoal(event._id);
                                }}
                              >
                                <Check />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                      >
                        <ListItemButton
                          role={undefined}
                          // selected={selectedIndex === index}
                          onClick={() => {
                            if (event.type === "task") {
                              getCustomWorkout(event.activityId);
                            }
                          }}
                        >
                          <ListItemText
                            id={event._id}
                            primary={
                              event.type === "goal" ? (
                                <div>
                                  <h3 style={{ textDecoration: "underline" }}>
                                    GOAL
                                  </h3>

                                  <span style={{ fontWeight: "bolder" }}>
                                    {event.title.toUpperCase()}{" "}
                                  </span>
                                  <span>Start: </span>
                                  <span>
                                    {new Date(event.start).toDateString()}{" "}
                                  </span>
                                  {new Date(event.end).getTime() < today ? (
                                    <span style={styles.late}>
                                      Finish:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  ) : (
                                    <span>
                                      Finish:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <h3 style={{ textDecoration: "underline" }}>
                                    TASK
                                  </h3>
                                  <span style={{ fontWeight: "bolder" }}>
                                    {event.title.toUpperCase()}{" "}
                                  </span>

                                  {new Date(event.end).getTime() < today ? (
                                    <span style={styles.late}>
                                      Past Due:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  ) : (
                                    <span>
                                      Complete by:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  )}
                                </div>
                              )
                            }
                            secondary={`Created: ${event.created}`}
                            className="goal-message"
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                : calendar?.map((event, index) => {
                    return (
                      <ListItem
                        key={event._id}
                        disablePadding
                        secondaryAction={
                          event.type !== "task" && (
                            <Tooltip title="Mark Completed">
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => {
                                  handleCompleteGoal(event._id);
                                }}
                              >
                                <Check />
                              </IconButton>
                            </Tooltip>
                          )
                        }
                      >
                        <ListItemButton
                          role={undefined}
                          // selected={selectedIndex === index}
                          onClick={() => {
                            if (event.type === "task") {
                              getCustomWorkout(event.activityId);
                            }
                          }}
                        >
                          <ListItemText
                            id={event._id}
                            primary={
                              event.type === "goal" ? (
                                <div>
                                  <h3 style={{ textDecoration: "underline" }}>
                                    GOAL
                                  </h3>

                                  <span style={{ fontWeight: "bolder" }}>
                                    {event.title.toUpperCase()}{" "}
                                  </span>
                                  <span>Start: </span>
                                  <span>
                                    {new Date(event.start).toDateString()}{" "}
                                  </span>
                                  {new Date(event.end).getTime() < today ? (
                                    <span style={styles.late}>
                                      Finish:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  ) : (
                                    <span>
                                      Finish:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <h3 style={{ textDecoration: "underline" }}>
                                    TASK
                                  </h3>
                                  <span style={{ fontWeight: "bolder" }}>
                                    {event.title.toUpperCase()}{" "}
                                  </span>

                                  {new Date(event.end).getTime() < today ? (
                                    <span style={styles.late}>
                                      Past Due:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  ) : (
                                    <span>
                                      Complete by:{" "}
                                      {new Date(event.end).toDateString()}
                                    </span>
                                  )}
                                </div>
                              )
                            }
                            secondary={`Created: ${event.created}`}
                            className="goal-message"
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
            </List>
          </Grid>
          {calendar?.length === 0 && !trainerManagedGoals?.length === 0 && (
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
    // height: 400,
    // overflowY: "scroll",
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
    color: "red",
  },
};

export default Goals;
