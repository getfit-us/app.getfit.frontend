import {
  CircularProgress,
  Grid,
  IconButton,
  keyframes,
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
import { useEffect } from "react";
import { useProfile, useWorkouts } from "../../Store/Store";
import { Check } from "@mui/icons-material";
import {
  addNotificationApi,
  completeGoal,
  getCalendarData,
  getSingleCustomWorkout,
  getNotifications
} from "../../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { styled } from "@mui/material";

const Goals = ({ trainerManagedGoals }) => {
  const setManageWorkout = useWorkouts((state) => state.setManageWorkout);
  const deleteCalendarEvent = useProfile((state) => state.deleteCalendarEvent);
  const deleteNotification = useProfile((state) => state.deleteNotification);
  const addNotification = useProfile((state) => state.addNotification);
  const calendar = useProfile((state) => state.calendar);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const [tasks, setTasks] = useState(
    activeNotifications?.filter((notification) => notification?.type === "task")
      ?.length
  );
  const profile = useProfile((state) => state.profile);
  const [loadingCalendar, calendarData, calendarError] = useApiCallOnMount(getCalendarData);
  const [loadingNotifications, notifications, notificationsError] = useApiCallOnMount(getNotifications);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [goalData, setGoalData] = useState([]);
  const today = new Date().getTime();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    // find overdue tasks and add them to the notifications
    if (calendar?.length > 0 && !loadingCalendar && !loadingNotifications) {
      const overDueTasks = calendar.filter((goal) => {
        if (
          new Date(goal.end).getTime() < today &&
          activeNotifications.find(
            (notification) => notification.goalId === goal._id
          ) === undefined
        ) {
          return goal;
        }
      });

      overDueTasks.forEach((task) => {
        addNotificationApi(axiosPrivate, {
          is_read: false,
          message:
            task.type === "goal"
              ? `You have an overdue goal: ${task.title}. `
              : `Complete ${task.title}.`,
          type: "task",
          sender: { id: profile.clientId, name: profile.firstname },
          activityId: task.activityId, // this is the id of the workout
          goalId: task._id, // this is the id of the goal so we can remove it from state after completion because we may have multiple goals for the same workout
          receiver: { id: profile?.clientId },
        }).then((res) => {
          setStatus({ loading: res.loading });
          if (!res.loading && !res?.error) {
            console.log(res.data);
            addNotification(res.data);
          }
        });
      });
    }
  }, [loadingCalendar, loadingNotifications]);

  useEffect(() => {
    setTasks(
      activeNotifications?.filter(
        (notification) => notification.type === "task"
      ).length
    );

    setGoalData(trainerManagedGoals?.length > 0 ? trainerManagedGoals : calendar);
  }, [activeNotifications, calendar, trainerManagedGoals]);

  console.log(activeNotifications)

  return (
    <Paper
      sx={{
        padding: 2,

        marginBottom: 3,
        minWidth: "100%",
      }}
      style={tasks > 0 ? styles.goalsOverDue : styles.goals}
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
            <CircularProgress />
          ) : calendar?.length === 0 && trainerManagedGoals?.length === 0 ? (
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
          ) : (
            <Grid item xs={12}>
              <List>
                {goalData?.map((event, index) => {
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
                                completeGoal(axiosPrivate, event._id).then(
                                  (status) => {
                                    console.log(status);
                                    if (
                                      !status.loading &&
                                      status.error === false
                                    ) {
                                      deleteCalendarEvent({ _id: event._id });

                                      //need to delete from notifications also
                                      deleteNotification({ _id: event._id });
                                    }
                                  }
                                );
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
                        onClick={() => {
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
                                    Finish: {new Date(event.end).toDateString()}
                                  </span>
                                ) : (
                                  <span>
                                    Finish: {new Date(event.end).toDateString()}
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
          )}
        </Grid>
      </form>
    </Paper>
  );
};

const blink = keyframes`
from { opacity: 0; }
to { opacity: 1; }
`;

const flashingGoalHeader = styled("h2")({
  fontWeight: "bold",
  fontSize: "1.2em",
  backgroundColor: "red",
  borderRadius: "20px",
  textAlign: "center",
  padding: "4px",
  color: "white",
  alignSelf: "center",
  boxShadow:
    "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px rgba(0, 0, 0, 0.3) 0px 30px 60px -30px rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
  animation: `${blink} 1s linear infinite`,
});

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
  goalsOverDue: {
    border: "3px solid red",
  },
  goals: {
    border: "1px solid #e0e0e0",
  },
};

export default Goals;
