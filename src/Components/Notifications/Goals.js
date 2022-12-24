import {
  Avatar,
  Button,
  Fab,
  Grid,
  IconButton,
  keyframes,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useProfile, useWorkouts } from "../../Store/Store";
import { Check, DirectionsRun, FitnessCenter, Flag } from "@mui/icons-material";
import {
  addNotificationApi,
  completeGoal,
  getCalendarData,
  getSingleCustomWorkout,
  getNotifications,
} from "../../Api/services";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { useTheme } from "@mui/material";
import { colors } from "../../Store/colors";

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
  const [loadingCalendar, calendarData, calendarError] =
    useApiCallOnMount(getCalendarData);
  const [loadingNotifications, notifications, notificationsError] =
    useApiCallOnMount(getNotifications);
  const [status, setStatus] = useState({ loading: false, error: null });
  const [goalData, setGoalData] = useState([]);
  const today = new Date().getTime();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const theme = useTheme();


  useEffect(() => {
    // find overdue tasks and add them to the notifications
    if (calendar?.length > 0 && !loadingCalendar && !loadingNotifications) {
      const overDueTasks = calendarData?.filter((goal) => {
        if (
          new Date(goal.end).getTime() < today &&
          activeNotifications.find(
            (notification) => notification.goalId === goal._id
          ) === undefined
        ) {
          return goal;
        }
      });

      overDueTasks?.forEach((task) => {
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
            addNotification(res.data);
          }
        });
      });
    }
    setGoalData(
      trainerManagedGoals?.length > 0 ? trainerManagedGoals : calendar
    );
  }, [loadingCalendar, loadingNotifications]);

  useEffect(() => {
    setTasks(
      activeNotifications?.filter(
        (notification) => notification.type === "task"
      ).length
    );
  }, [activeNotifications, calendar, trainerManagedGoals]);

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
          ) : calendar?.length > 0 || trainerManagedGoals?.length > 0 ? (
            <Grid item xs={12}>
              <List>
                {goalData?.map((event, index) => {
                  return (
                    <ListItem
                      key={event._id}
                      disablePadding
                      style={styles.listItem}
                     
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
                              <div style={styles.taskContainer}>
                                <h3 style={{   alignSelf: 'center', borderRadius: 10, textDecoration: 'underline'}}>
                                <Fab color={event.title.includes("Workout") ? 'primary' : event.title.includes("Cardio") ? 'warning' : 'success' } sx={{mr: 1}}>
                          {event.title.includes("Workout") ? (
                            <FitnessCenter />
                          ) : event.title.includes("Cardio") ? (
                            <DirectionsRun  />
                ) : <Flag />}
                        </Fab>
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
                         
                        />
                     
                      </ListItemButton>
                      {event.type !== "task" && (
                          <Tooltip title="Mark Completed">
                            <Button
                              startIcon={<Check />}
                              aria-label="comments"
                              variant="contained"
                              
                              onClick={() => {
                                completeGoal(axiosPrivate, event._id).then(
                                  (status) => {
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
                              Mark Completed
                            </Button>
                          </Tooltip>
                        )}
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
  listItem: {
    border: "3px solid",
    borderColor: colors.primary,
    borderRadius: 10,
    padding: 5,
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
};

export default Goals;
