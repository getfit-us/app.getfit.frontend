import { DeleteOutline, Remove, ThumbUp, ThumbUpOffAlt } from "@mui/icons-material";
import { Button, Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";
import ViewMeasurementModal from "../Measurements/ViewMeasurementModal";
import ViewWorkoutModal from "../Workout/ViewWorkoutModal";

//this is going to show a feed with updates from clients (added measurements, completed workouts, added workouts, etc)
const ActivityFeed = () => {
  const { state, dispatch } = useProfile();
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  const [status, setStatus] = useState({
    isLoading: false,
    error: false,
    success: false,
  });
  const axiosPrivate = useAxiosPrivate();
  //get date 30days in the past
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const timestampThirtyDaysAgo = new Date().getTime() - thirtyDaysInMs;

  //get all the user activity from notification state
  let userActivity = state.notifications.filter((notification) => {
    //***** this needs to be changed to allow the user to show more results from drop down or pick date range */
    // check if the notification is already older then 30days if so do not display notification / also needs to be is_read true
    if (
      notification.type === "activity" &&
      timestampThirtyDaysAgo < new Date(notification.createdAt)
    ) {
      return true;
    }
  });
  
  userActivity = userActivity.sort(function (a, b) { if (a.createdAt > b.createdAt) return -1; });

  //api call to get user measurement
  const getMeasurement = async (id) => {
    setStatus({ isLoading: true, error: false, success: false });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/${id}`, {
        signal: controller.signal,
      });

      setStatus({ isLoading: false, error: false, success: true });
      setViewMeasurement([response.data]);
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
      setStatus({ isLoading: false, error: false, success: true });
      setViewWorkout([response.data]);

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
      setStatus({ isLoading: false, error: false, success: true });
      setViewWorkout([response.data]);

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

 console.log(state.notifications);

  //need to send feed back and view user activity (like pull up completed workout or created and measurements)

  return (
    <Paper
      sx={{
        padding: 2,
        marginBottom: 3,
        width: { xs: "100%", sm: "50%", lg: "50%" },
      }}
    >
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
      <Grid container style={styles.container} disableEqualOverflow>
        <Grid item xs={12}>
          <h3 style={styles.header}>Activity Feed</h3>
        </Grid>

        {userActivity &&
          userActivity.map((activity) => {
            return (
              <>
                <Grid item xs={12} key={activity._id} spacing={2}>
                  <Typography variant="p" style={styles.message}>
                    {activity.message}{" "}
                  </Typography>
                </Grid>

                <Grid item xs={12} sx={{   }}>
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
                          }
                          if (activity.message.includes("completed")) {
                            getCompletedWorkout(activity.activityID);
                            handleWorkoutModal();
                            if (!activity.is_read) updateNotification(activity);
                          }
                          if (activity.message.includes("created") || activity.message.includes("assigned")) {
                            getCustomWorkout(activity.activityID);
                            handleWorkoutModal();
                            if (!activity.is_read) updateNotification(activity);
                          }
                        }}
                        color={activity.is_read ? "primary" : 'success'}
                        sx={{ display: "inline" }}
                      >
                        View
                      </Button>
                      <IconButton
                        sx={{ ml: 1 }}
                        onClick={() => {
                          //check if user is trainer or client
                          console.log(state.profile)
                          if (state.profile.roles.includes(5) || state.profile.roles.includes(10)) {
                            sendMessage("Great Job!", activity.sender.id);
                            updateNotification(activity, true);

                          } else if (state.profile.roles.includes(2)) {
                            updateNotification(activity, true);

                          }
                        }}
                      >
                        {" "}
                        {activity.liked ? <ThumbUp /> : <ThumbUpOffAlt />}
                      </IconButton>
                     
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
