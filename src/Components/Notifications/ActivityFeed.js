import {
  DeleteForever,
  NotificationsActive,
  NotificationsNone,
} from "@mui/icons-material";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";
import ViewMeasurementModal from "../Measurements/ViewMeasurementModal";
import ViewWorkoutModal from "../Workout/Modals/ViewWorkoutModal";
import usePagination from "../../hooks/usePagination";

import useAxios from "../../hooks/useAxios";

//this is going to show a feed with updates from clients (added measurements, completed workouts, added workouts, etc)
const ActivityFeed = () => {
  const { state, dispatch } = useProfile();
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  let [page, setPage] = useState(1);

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });
  const axiosPrivate = useAxiosPrivate();

  // ----get all the user activity from notification state --- sort only activity from notification state
  let userActivity = state.notifications.filter((notification) => {
    if (notification.type === "activity") {
      return true;
    }
  });


  userActivity = userActivity.sort(function (a, b) {
    if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
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

  //get notifications
  //get assignedCustomWorkouts
  const {
    loading,
    error,
    data: notifications,
  } = useAxios({
    url: `/notifications/${state.profile.clientId}`,
    method: "GET",
    type: "SET_NOTIFICATIONS",
  });

  //api call to get user measurement
  const getMeasurement = async (id) => {
    setStatus({ loading: true, error: false, success: false });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/${id}`, {
        signal: controller.signal,
      });
      setViewMeasurement([response.data]);
      setStatus({ loading: false, error: false, success: true });
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };

  //apu call to get users completed workouts
  const getCompletedWorkout = async (id) => {
    setStatus({ loading: true, error: false, success: false });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/completed-workouts/${id}`, {
        signal: controller.signal,
      });
      setViewWorkout([response.data]);
      setStatus({ loading: false, error: false, success: true });

      // console.log(state.workouts)
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true, success: false });
    }
    return () => {
      controller.abort();
    };
  };

  //api call to get created custom workout by user
  const getCustomWorkout = async (id) => {
    setStatus({ loading: true, error: false, success: false });

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/custom-workout/${id}`, {
        signal: controller.signal,
      });
      setViewWorkout([response.data]);

      setStatus({ loading: false, error: false, success: true });

      // reset();
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true, success: false });
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
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/notifications", message, {
        signal: controller.signal,
      });
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
  const delNotification = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/notifications/${id}`, {
        signal: controller.signal,
      });
      dispatch({ type: "DELETE_NOTIFICATION", payload: response.data });
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  return (
    <Paper
      sx={{
        padding: 2,
        marginBottom: 3,
        minWidth: "100%",
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

        <Grid item xs={12}>
          <List>
            {userActivity &&
              data.currentData().map((activity, index) => {
                return (
                  <>
                    <ListItem
                      key={activity._id + 'list item' }
                      secondaryAction={
                        <IconButton
                        key={activity._id + 'delete'}
                          edge="end"
                          color="warning"
                          aria-label="delete"
                          onClick={() => {
                            delNotification(activity._id);
                          }}
                        >
                          <DeleteForever sx={{ color: "#db4412" }} />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton
                      key={activity._id + 'button'}
                        role={undefined}
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

                          if (!activity.message.includes("goal") && activity.message.includes("completed")) {
                            getCompletedWorkout(activity.activityID);
                            handleWorkoutModal();

                            if (!activity.is_read) updateNotification(activity);
                          }
                        }}
                        dense
                      >
                        <ListItemIcon 
                        key={activity._id + 'icon'}>
                          {activity.is_read ? (
                            <NotificationsNone />
                          ) : (
                            <NotificationsActive sx={{ color: "#ff0000" }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                        key={activity._id + 'text'}
                          id={activity.activityID}
                          primary={activity.message}
                          secondary={activity.createdAt}
                        />
                      </ListItemButton>
                    </ListItem>
                  </>
                );
              })}
          </List>
          {userActivity?.length === 0 && (
            <Grid xs={12} item sx={{ textAlign: "center" }}>
              <h2>No Recent Activity</h2>
            </Grid>
          )}
        </Grid>
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
