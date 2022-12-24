import {
  DeleteForever,
  NotificationsActive,
  NotificationsNone,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ViewMeasurementModal from "../Measurements/ViewMeasurementModal";
import ViewWorkoutModal from "../Workout/Modals/ViewWorkoutModal";
import usePagination from "../../hooks/usePagination";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import {
  getNotifications,
  getSingleMeasurement,
  getSingleCompletedWorkout,
  deleteSingleNotification,
  getSingleCustomWorkout,
  updateSingleNotification,
  getMessages,
} from "../../Api/services";
import { useProfile } from "../../Store/Store";

//this is going to show a feed with updates from clients (added measurements, completed workouts, added workouts, etc)
const ActivityFeed = () => {
  const notifications = useProfile((store) => store.notifications);
  const updateNotificationState = useProfile(
    (store) => store.updateNotification
  );
  const delNotificationState = useProfile((store) => store.deleteNotification);
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  let [page, setPage] = useState(1);
  const [loadingNotifications, notData, error] = useApiCallOnMount(getNotifications);
  const [loadingMessages, messageData, messageError] = useApiCallOnMount(getMessages);

  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
  });
  const axiosPrivate = useAxiosPrivate();

  // ----get all the user activity from notification state --- sort only activity from notification state
  let userActivity = notifications.filter((notification) => {
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
        {(loadingNotifications && notifications?.length === 0) ? (
          <Grid item xs={12}>
            <Skeleton variant="text" animation='wave'  />
            <Skeleton variant="text" animation='wave'  />
            <Skeleton variant="text" animation='wave'  />
            <Skeleton variant="text" animation='wave'  />
            <Skeleton variant="text" animation='wave'  />
            <Skeleton variant="text" animation='wave'  />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <List>
              {userActivity &&
                data.currentData().map((activity, index) => {
                  return (
                    <div>
                      <ListItem
                        key={activity._id + "list item"}
                        secondaryAction={
                          <IconButton
                            key={activity._id + "delete button"}
                            edge="end"
                            color="warning"
                            aria-label="delete"
                            onClick={() => {
                              deleteSingleNotification(
                                axiosPrivate,
                                activity._id
                              ).then((status) => {
                                if (!status.loading && !status.error)
                                  delNotificationState({ _id: activity._id });
                              });
                            }}
                          >
                            <DeleteForever sx={{ color: "#db4412" }} 
                            key={activity._id + "delete icon"} />
                            
                          </IconButton>
                        }
                        disablePadding
                      >
                        <ListItemButton
                          key={activity._id + "list item button"}
                          role={undefined}
                          onClick={() => {
                            if (activity.message.includes("measurement")) {
                              //backwards compatibility with old DB entry

                              getSingleMeasurement(
                                axiosPrivate,
                                activity.activityID
                                  ? activity.activityID
                                  : activity.activityId
                              ).then((status) => {
                                setStatus({ loading: status.loading });
                                if (!status.loading) {
                                  setViewMeasurement([status.data]);
                                  handleMeasurementModal();
                                }
                              });

                              if (!activity.is_read)
                                updateSingleNotification(
                                  axiosPrivate,
                                  activity
                                ).then((status) => {
                                  if (!status.loading && !status.error)
                                    updateNotificationState(status.data);
                                });
                            } // checks for created custom workouts
                            if (
                              activity.message.includes("created") ||
                              activity.message.includes("assigned")
                            ) {
                              getSingleCustomWorkout(
                                axiosPrivate,
                                activity.activityID
                                  ? activity.activityID
                                  : activity.activityId
                              ).then((res) => {
                                setStatus({ loading: status.loading, error: status.error, message: status.message });
                                console.log(res.error)
                                if (!res.loading && !res.error) {
                                  setViewWorkout([res.data]);
                                  handleWorkoutModal();
                                } 
                                
                                
                              });

                              if (!activity.is_read)
                                updateSingleNotification(
                                  axiosPrivate,
                                  activity
                                ).then((status) => {
                                  if (!status.loading && !status.error)
                                    updateNotificationState(status.data);
                                });
                            }

                            if (
                              !activity.message.includes("goal") &&
                              !activity.message.includes("task") &&
                              activity.message.includes("completed")
                            ) {
                              getSingleCompletedWorkout(
                                axiosPrivate,
                                activity.activityID
                                  ? activity.activityID
                                  : activity.activityId
                              ).then((status) => {
                                setStatus({ loading: status.loading });
                                if (!status.loading) {
                                  setViewWorkout([status.data]);

                                  handleWorkoutModal();
                                }
                              });

                              if (!activity.is_read)
                                updateSingleNotification(
                                  axiosPrivate,
                                  activity
                                ).then((status) => {
                                  if (!status.loading && !status.error)
                                    updateNotificationState(status.data);
                                });
                            }
                          }}
                          dense
                        >
                          <ListItemIcon key={activity._id + "icon"}>
                            {activity.is_read ? (
                              <NotificationsNone  
                              key={activity._id + "read icon"} />
                              
                            ) : (
                              <NotificationsActive 
                              key={activity._id + "unread icon"} 
                              sx={{ color: "#ff0000" }} />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            key={activity._id + "list item text"}
                            id={
                              activity?.activityID
                                ? activity.activityID
                                : activity.activityId
                            }
                            primary={status.error ? 'status.message' : activity.message}
                            secondary={activity.createdAt}
                          />
                        </ListItemButton>
                      </ListItem>
                    </div>
                  );
                })}
            </List>
            {userActivity?.length === 0 && (
              <Grid xs={12} item sx={{ textAlign: "center" }}>
                <h2>No Recent Activity</h2>
              </Grid>
            )}
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
        {/* <div style={{display: 'flex', justifyContent: 'flex-start', marginTop: '1rem', width: '100%'}}>
          {" "}
          <Button variant="contained" color="error">
          Clear All Notifications
          </Button>
        </div> */}
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
