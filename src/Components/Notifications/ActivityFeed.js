import {
  DeleteOutline,
  Remove,
  ThumbUp,
  ThumbUpOffAlt,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";
import ViewMeasurementModal from "../Measurements/ViewMeasurementModal";
import ViewWorkoutModal from "../Workout/ViewWorkoutModal";
import usePagination from "../../hooks/usePagination";

//this is going to show a feed with updates from clients (added measurements, completed workouts, added workouts, etc)
const ActivityFeed = () => {
  const { state, dispatch } = useProfile();
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [notifications, setNotifications] = useState(null);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  let [page, setPage] = useState(1);

  const [status, setStatus] = useState({
    isLoading: false,
    error: false,
    success: false,
  });
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    getNotifications();
  }, []);

  // ----get all the user activity from notification state --- sort only activity from notification state
  let userActivity = state.notifications.filter((notification) => {
    if (notification.type === "activity") {
    
      return true;
    }
  });
  console.log(userActivity);

  userActivity = userActivity.sort(function (a, b) {
    if (a.createdAt > b.createdAt) return -1;
  });
  //----------------------------------------------------------------

  //---- deals with pagination ------------------------
  const data = usePagination(userActivity, 10);
  const count = Math.ceil(userActivity.length / 10);

  const handleChangePage = (e, p) => {
    setPage(p);
    data.jump(p);
  };
  //----------------------------------------------------------------
  const getNotifications = async () => {
    const controller = new AbortController();
    setStatus({ isLoading: true, error: false, success: false });
    try {
      const response = await axiosPrivate.get(
        `/notifications/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );
      setNotifications(response.data);
      setStatus({ isLoading: true, error: false, success: false });

    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };
  //api call to get user measurement
  const getMeasurement = async (id) => {
    setStatus({ isLoading: true, error: false, success: false });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/${id}`, {
        signal: controller.signal,
      });
      setViewMeasurement([response.data]);
      setStatus({ isLoading: false, error: false, success: true });
    } catch (err) {
      console.log(err);
      setStatus({ isLoading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };

  //apu call to get users completed workouts
  const getCompletedWorkout = async (id) => {
    setStatus({ isLoading: true, error: false, success: false });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/completed-workouts/${id}`, {
        signal: controller.signal,
      });
      setViewWorkout([response.data]);
      setStatus({ isLoading: false, error: false, success: true });

      // console.log(state.workouts)
    } catch (err) {
      console.log(err);
      setStatus({ isLoading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };

  //api call to get created custom workout by user
  const getCustomWorkout = async (id) => {
    setStatus({ isLoading: true, error: false, success: false });

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      setViewWorkout([response.data]);

      setStatus({ isLoading: false, error: false, success: true });

      // reset();
    } catch (err) {
      console.log(err);
      setStatus({ isLoading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };

  //api call to Update Notification
  const updateNotification = async (message, liked) => {
    message.is_read = true;
    //if liked set to true
    message.liked = liked;
    console.log(message);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/notifications", message, {
        signal: controller.signal,
      });
      console.log(response.data);
      dispatch({ type: "UPDATE_NOTIFICATION", payload: response.data });
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  //api call to send notification
  const sendMessage = async (message, id) => {
    //set type to message
    let data = {};
    data.type = "message";
    data.message = message;
    data.id = id;
    //set sender
    data.sender = {};
    data.receiver = {};
    data.sender.id = state.profile.clientId;
    data.sender.name = state.profile.firstName + " " + state.profile.lastName;
    data.receiver.id = id;
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/notifications", data, {
        signal: controller.signal,
      });

      // dispatch({ type: "ADD_NOTIFICATION", payload: response.data });
      // setSent((prev) => ({ ...prev, success: true }));

      // setTimeout(() => {
      //   setSent((prev) => ({ ...prev, success: false }));
      // }, 3000);

      // reset(); //reset form values
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  console.count("render");

  //need to send feed back and view user activity (like pull up completed workout or created and measurements)

  return (
    <Paper
      sx={{
        padding: 2,
        marginBottom: 3,
      }}
    >
      <ViewWorkoutModal
        open={openWorkout}
        viewWorkout={viewWorkout}
        handleModal={handleWorkoutModal}
        status={status}
      />
      <ViewMeasurementModal
        open={openMeasurement}
        viewMeasurement={viewMeasurement}
        handleModal={handleMeasurementModal}
        status={status}

      />
      <Grid container style={styles.container}>
        <Grid item xs={12}>
          <h2 className="page-title">Activity Feed</h2>
        </Grid>

        {userActivity &&
          data.currentData().map((activity, index) => {
            return (
              <>
                <Grid item xs={12} key={activity.id}>
                  <Typography variant="p" style={styles.message}>
                    <span className="message-date">{activity.createdAt}:</span>{" "}
                    <span className="message">{activity.message}</span>{" "}
                  </Typography>
                </Grid>

                <Grid item xs={12} key={activity.id}>
                  {activity.activityID && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          if (activity.message.includes("measurement")) {
                            getMeasurement(activity.activityID);
                            handleMeasurementModal();

                            if (!activity.is_read) updateNotification(activity);
                          } // checks for created custom workouts
                          if (
                            activity.message.includes("created") ||
                            activity.message.includes("assigned")
                          ) {
                            getCustomWorkout(activity.activityID);
                            handleWorkoutModal();

                            if (!activity.is_read) updateNotification(activity);
                          }

                          if (activity.message.includes("completed")) {
                            getCompletedWorkout(activity.activityID);
                            handleWorkoutModal();

                            if (!activity.is_read) updateNotification(activity);
                          }
                        }}
                        color={activity.is_read ? "primary" : "success"}
                        sx={{ display: "inline" }}
                      >
                        View
                      </Button>
                      {activity.sender.id !== state.profile.clientId && (
                        <IconButton
                          sx={{ ml: 1 }}
                          onClick={() => {
                            //check if user is trainer or client
                            if (
                              state.profile.roles.includes(5) ||
                              state.profile.roles.includes(10)
                            ) {
                              sendMessage(`Great Job! `, activity.sender.id);
                              updateNotification(activity, true);
                            } else if (state.profile.roles.includes(2)) {
                              updateNotification(activity, true);
                            }
                          }}
                        >
                          {" "}
                          {activity.liked ? <ThumbUp /> : <ThumbUpOffAlt />}
                        </IconButton>
                      )}
                    </>
                  )}
                </Grid>
              </>
            );
          })}

        {!userActivity ||
          (userActivity.length === 0 && (
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h5">No Recent Activity</Typography>
            </Grid>
          ))}
        <Pagination
          page={page}
          count={count}
          variant="outlined"
          color="primary"
          onChange={handleChangePage}
          sx={{ mt: 2 }}
        />
      </Grid>
    </Paper>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
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
  message: {},
};

export default ActivityFeed;
