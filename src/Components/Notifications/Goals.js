import { CatchingPokemonSharp, Check } from "@mui/icons-material";
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
import useProfile from "../../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import NotificationSnackBar from "./SnackbarNotify";
import { useEffect } from "react";

const Goals = ({ goals }) => {
  const { state, dispatch } = useProfile();
  const [selectedIndex, setSelectedIndex] = useState(0);
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

      dispatch({
        type: "MANAGE_WORKOUT",
        payload: [response.data],
      });
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
    console.log(id);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/users/calendar/${id}`, {
        signal: controller.signal,
        withCredentials: true,
      });

      dispatch({
        type: "DELETE_CALENDAR_EVENT",
        payload: id,
      });

      //need to delete from notifications also
      dispatch({ type: "DELETE_NOTIFICATION", payload: {_id: id} });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  useEffect(() => {
    const overDue = goals?.length
      ? goals?.filter((goal) => {
          return new Date(goal.end).getTime() < today;
        })
      : state?.calendar?.filter((goal) => {
          return new Date(goal.end).getTime() < today;
        });

    //if overdue goals exist add notifications to state
    if (overDue?.length) {
      overDue.forEach((goal) => {
        //check if state already contains notification before adding
        if (
          state.notifications.filter((notification) => {
            return notification._id === goal._id;
          }).length === 0
        ) {
          if (goal.type === "goal") {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                is_read: false,
                message: `You have an overdue goal: ${goal.title}. Complete the goal and mark completed.`,
                type: "task",
                _id: goal._id,
                receiver: { id: state?.profile?.clientId },
              },
            });
          } else if (goal.type === "task") {
            dispatch({
              type: "ADD_NOTIFICATION",
              payload: {
                is_read: false,
                message: `Complete ${goal.title} and mark completed.`,
                type: "task",
                _id: goal._id,
                receiver: { id: state?.profile?.clientId },
              },
            });
          }
        }
      });
    }
  }, [state.calendar, goals]);

  // console.log(state.calendar);
  //find over due goals / tasks

  // need to do check for if today is the end date of goal. going to ask user to complete?

  //also need to check if goal is this week

  //or if goal is within two days of completion date

  //also if goal is not this week or within two days of completion date ask user if they are on track ?
  return (
    <Paper
      sx={{
        padding: 2,

        marginBottom: 3,
        minWidth: "100%",
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
            <h2 className="page-title">Goals</h2>
          </Grid>
          <Grid item xs={12}>
            <List>
              {goals?.length > 0
                ? goals.map((event, index) => {
                    return (
                      <ListItem
                        key={event._id}
                        disablePadding
                        secondaryAction={
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
                        }
                      >
                        <ListItemButton
                          role={undefined}
                          // selected={selectedIndex === index}
                          onClick={() => {
                            console.log(event);
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
                : state?.calendar.map((event, index) => {
                    return (
                      <ListItem
                        key={event._id}
                        disablePadding
                        secondaryAction={
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
                        }
                      >
                        <ListItemButton
                          role={undefined}
                          // selected={selectedIndex === index}
                          onClick={() => {
                            console.log(event);
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
          {state?.calendar?.length === 0 && !goals && (
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
