import {
  Assignment,
  BarChart,
  DeleteForever,
  DirectionsRun,
  FitnessCenter,
  Flag,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Fab,
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
import useSWR from "swr";
import { useProfile } from "../../Store/Store";
import Confirm from "../UserFeedback/Confirm";
import "./ActivityFeed.css";
import { delSWR, getSWR, putSWR } from "../../Api/services";

//this is going to show a feed with updates from clients (added measurements, completed workouts, added workouts, etc)
const ActivityFeed = () => {
  // ---------------Store state --------------------
  const profile = useProfile((store) => store.profile);
  const notifications = useProfile((store) => store.notifications);
  const updateNotificationState = useProfile(
    (store) => store.updateNotification
  );
  const delNotificationState = useProfile((store) => store.deleteNotification);
  const setNotifications = useProfile((store) => store.setNotifications);
  const clientId = useProfile((state) => state.profile.clientId);
  //----------Local state --------------------------
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [customWorkoutId, setCustomWorkoutId] = useState("");
  const [completedWorkoutId, setCompletedWorkoutId] = useState("");
  const [deleteAllActivity, setDeleteAllActivity] = useState(false);
  const [deleteActivityId, setDeleteActivityId] = useState("");
  const handleWorkoutModal = () => setOpenWorkout((prev) => !prev);
  const handleMeasurementModal = () => setOpenMeasurement((prev) => !prev);
  const [viewWorkout, setViewWorkout] = useState([]);
  const [viewMeasurement, setViewMeasurement] = useState([]);
  let [page, setPage] = useState(1);
  const [measurementId, setMeasurementId] = useState("");
  const [updateMeasurement, setUpdateMeasurement] = useState({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  // --------------SWR ------------------------------
  const {
    data: activityNotifications,
    error: errorActivityNotifications,
    isLoading: loadingActivityNotifications,
  } = useSWR(
    `/notifications/${profile.clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: true,
      revalidateOnMount: false,
      onSuccess: (data) => {
       setNotifications(data.data);
      
      },
    }
  );

  console.log( activityNotifications, errorActivityNotifications)

  const {
    data: singleMeasurement,
    error: errorSingleMeasurement,
    isLoading: loadingSingleMeasurement,
  } = useSWR(
    measurementId ? `/measurements/${measurementId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      onSuccess: (data) => {
        setViewMeasurement([data.data]);
        handleMeasurementModal();
      },
    }
  );
  const {
    data: singleCustomWorkout,
    error: errorSingleCustomWorkout,
    isLoading: loadingSingleCustomWorkout,
  } = useSWR(
    customWorkoutId ? `/custom-workout/${customWorkoutId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      onSuccess: (res) => {
        setViewWorkout([res.data]);
        handleWorkoutModal();
      },
    }
  );

  const {
    data: singleCompletedWorkout,
    error: errorSingleCompletedWorkout,
    isLoading: loadingSingleCompletedWorkout,
  } = useSWR(
    completedWorkoutId ? `/completed-workouts/${completedWorkoutId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      onSuccess: (res) => {
        setViewWorkout([res.data]);
        handleWorkoutModal();
      },
    }
  );

  const {
    data: deleteAllActivityNotifications,
    error: errorDeleteAllActivityNotifications,
    isLoading: loadingDeleteAllActivityNotifications,
  } = useSWR(
    deleteAllActivity
      ? `/notifications/deleteAllActivity/${profile.clientId}`
      : null,
    (url) => delSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      onSuccess: (res) => {
        setNotifications(
          notifications.filter((notification) => {
            if (notification.type !== "activity") {
              return true;
            }
          })
        );
        setDeleteAllActivity(false);
      },
    }
  );

  const {
    data: deleteActivityNotification,
    isLoading: loadingSingleDelNotification,
    error: errorSingleDelNotification,
  } = useSWR(
    deleteActivityId ? `/notifications/${deleteActivityId}` : null,
    (url) => delSWR(url, axiosPrivate),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      onSuccess: (res) => {
        delNotificationState({ _id: deleteActivityId });
        setDeleteActivityId("");
      },
    }
  );

  // --------------Functions ------------------------------
  // ----get all the user activity from notification state --- sort only activity from notification state

  // let userActivity = notifications.sort(function (a, b) {
  //   if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
  // });

  let userActivity = notifications;
  //----------------------------------------------------------------

  //---- deals with pagination ------------------------
  const data = usePagination(userActivity, 10);
  const count = Math.ceil(userActivity.length / 10);

  const handleChangePage = (e, p) => {
    setPage(p);
    data.jump(p);
  };

  const handleClick = (activity) => {
    if (activity.message.includes("measurement")) {
      setMeasurementId(activity.activityID);
    } // checks for created custom workouts
    if (
      activity.message.includes("created") ||
      activity.message.includes("assigned")
    ) {
      setCustomWorkoutId(activity.activityID);
    }

    if (
      !activity.message.includes("goal") &&
      !activity.message.includes("task") &&
      activity.message.includes("completed")
    ) {
      setCompletedWorkoutId(activity.activityID);
    }
  };

  const handleDeleteAll = () => {
    setDeleteAllActivity(true);
  };

  const handleDelete = (activity) => {
    setDeleteActivityId(activity._id);
  };

  const renderList = (item) => {
    if (userActivity) {
      return data.currentData().map((activity, index) => {
        //get the name of the workout and the name of the user
        // let name = activity.message.split("completed")[0].trim();
        // let workout = activity.message.split("workout:")[1].trim();
        let typeOfActivity = activity.message.includes("completed workout")
          ? "completed workout"
          : activity.message.includes("new measurement")
          ? "new measurement"
          : activity.message.includes("created workout")
          ? "created workout"
          : activity.message.includes("assigned workout")
          ? "assigned workout"
          : activity.message.includes("completed goal")
          ? "completed goal"
          : activity.message.includes("new goal")
          ? "new goal"
          : activity.message.includes("completed task")
          ? "completed task"
          : activity.message.includes("overdue task")
          ? "overdue task"
          : activity.message.includes("overdue goal")
          ? "overdue goal"
          : activity.message.includes("cardio")
          ? "cardio"
          : "";

        const iconType = typeOfActivity.includes("workout") ? (
          <Fab size="small" color="primary">
            <FitnessCenter />
          </Fab>
        ) : typeOfActivity.includes("measurement") ? (
          <Fab size="small" color="info">
            <BarChart />
          </Fab>
        ) : typeOfActivity.includes("goal") ? (
          <Fab size="small" color="success">
            <Flag />
          </Fab>
        ) : typeOfActivity.includes("task") ? (
          <Fab size="small" color="error">
            <Assignment />
          </Fab>
        ) : typeOfActivity.includes("cardio") ? (
          <Fab size="small" color="warning">
            <DirectionsRun />
          </Fab>
        ) : (
          ""
        );

        //switch statement to determine what type of activity it is

        return (
          <ListItem
            className={"activityFeed-list-item"}
            key={activity._id + "list item"}
            secondaryAction={
              <IconButton
                key={activity._id + "delete button"}
                edge="end"
                color="warning"
                aria-label="delete"
                onClick={() => handleDelete(activity)}
              >
                <DeleteForever
                  sx={{ color: "#db4412" }}
                  key={activity._id + "delete icon"}
                />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              key={activity._id + "list item button"}
              role={undefined}
              onClick={() => handleClick(activity)}
              dense
            >
              <ListItemIcon key={activity._id + "icon"}>
                {iconType}
              </ListItemIcon>
              <ListItemText
                id={
                  activity?.activityID
                    ? activity.activityID
                    : activity.activityId
                }
                primary={<div>{activity.message}</div>}
                secondary={activity.createdAt}
              />
            </ListItemButton>
          </ListItem>
        );
      });
    }
  };

  console.log("notifications", notifications);

  return (
    <Paper className="activity-feed">
      <ViewWorkoutModal
        open={openWorkout}
        viewWorkout={viewWorkout}
        handleModal={handleWorkoutModal}
        isLoading={
          loadingSingleCustomWorkout || loadingSingleCompletedWorkout
            ? true
            : false
        }
      />
      <ViewMeasurementModal
        open={openMeasurement}
        viewMeasurement={viewMeasurement}
        handleModal={handleMeasurementModal}
        isLoading={loadingSingleMeasurement}
      />

      <h2 className="page-title">Activity Feed</h2>

      {loadingActivityNotifications && notifications?.length === 0 ? (
        <>
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height="75px"
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height="75px"
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height="75px"
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height="75px"
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height="75px"
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="100%"
            height="75px"
          />
        </>
      ) : (
        <>
          <List>{renderList()}</List>

          {userActivity?.length === 0 && <h2>No Recent Activity</h2>}
          <Confirm
            open={confirmOpen}
            setOpen={setConfirmOpen}
            funcToRun={handleDeleteAll}
          >
            Are you sure you want to clear all notifications?
          </Confirm>
        </>
      )}

      <Pagination
        page={page}
        count={count}
        variant="outlined"
        color="primary"
        onChange={handleChangePage}
        sx={{ mt: 2, mb: 1 }}
      />
      {userActivity?.length > 0 && (
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2, mb: 1, ml: 1, borderRadius: 10 }}
          onClick={() => setConfirmOpen(true)}
        >
          Clear All Notifications
        </Button>
      )}
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
