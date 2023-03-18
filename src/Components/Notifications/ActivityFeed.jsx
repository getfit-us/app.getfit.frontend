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
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Pagination,
  Paper,
  Skeleton,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ViewMeasurementModal from "../Measurements/ViewMeasurementModal";
import ViewWorkoutModal from "../Workout/Modals/ViewWorkoutModal";
import usePagination from "../../hooks/usePagination";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

import { useProfile } from "../../Store/Store";
import Confirm from "../UserFeedback/Confirm";
import "./ActivityFeed.css";
import { delSWR, getSWR } from "../../Api/services";

//this is going to show a feed with updates from clients (added measurements, completed workouts, added workouts, etc)
const ActivityFeed = () => {
  // ---------------Store state --------------------
  const clientId = useProfile((state) => state.profile.clientId);
  const deleteActivity = useProfile((state) => state.deleteActivity);
  const setActivity = useProfile((state) => state.setActivity);
  //----------Local state --------------------------
  const [openWorkout, setOpenWorkout] = useState(false);
  const [openMeasurement, setOpenMeasurement] = useState(false);
  const [customWorkoutId, setCustomWorkoutId] = useState("");
  const [completedWorkoutId, setCompletedWorkoutId] = useState("");
  const [activityId, setActivityId] = useState("");
  const [deleteAllActivity, setDeleteAllActivity] = useState(false);

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
    `/notifications/activity-feed/${clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      fallbackData: [],
      onSuccess: (data) => {
        setActivity(data.data);
      },
    }
  );

  const {
    data: singleMeasurement,
    error: errorSingleMeasurement,
    isLoading: loadingSingleMeasurement,
  } = useSWRImmutable(
    measurementId ? `/measurements/${measurementId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (res) => {
        setMeasurementId("");
      },
    }
  );
  const {
    data: singleCustomWorkout,
    error: errorSingleCustomWorkout,
    isLoading: loadingSingleCustomWorkout,
  } = useSWRImmutable(
    customWorkoutId ? `/custom-workout/${customWorkoutId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (res) => {
        setCompletedWorkoutId("");
      },
    }
  );

  const {
    data: singleCompletedWorkout,
    error: errorSingleCompletedWorkout,
    isLoading: loadingSingleCompletedWorkout,
  } = useSWRImmutable(
    completedWorkoutId ? `/completed-workouts/${completedWorkoutId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (res) => {
        setViewWorkout([res]);
      },
    }
  );

  const {
    data: deleteAllActivityNotifications,
    error: errorDeleteAllActivityNotifications,
    isLoading: loadingDeleteAllActivityNotifications,
  } = useSWRImmutable(
    deleteAllActivity ? `/notifications/deleteAllActivity/${clientId}` : null,
    (url) => delSWR(url, axiosPrivate),
    {
      onSuccess: (res) => {
        setActivity([]), setDeleteAllActivity(false);
      },
    }
  );

  const {
    data: deleteActivityData,
    isLoading: loadingActivityDelNotification,
    error: errorActivityDelNotification,
  } = useSWRImmutable(
    activityId ? `/notifications/${activityId}` : null,
    (url) => delSWR(url, axiosPrivate),
    {
      onSuccess: (res) => {
        console.log("delete activity notification", res);
        deleteActivity({ activityId });
        setActivityId("");
      },
    }
  );

  //-------------------UseEffect --------------------------------

  useEffect(() => {
    if (singleMeasurement) {
      setViewMeasurement([singleMeasurement]);
    }

    if (singleCustomWorkout) {
      setViewWorkout([singleCustomWorkout]);
    }

    if (singleCompletedWorkout) {
      setViewWorkout([singleCompletedWorkout]);
    }
  }, [singleMeasurement, singleCustomWorkout, singleCompletedWorkout]);

  //---- deals with pagination ------------------------
  const data = usePagination(
    activityNotifications ? activityNotifications : [],
    10
  );
  const count = Math.ceil(activityNotifications?.length / 10);

  const handleChangePage = (e, p) => {
    setPage(p);
    data.jump(p);
  };

  const handleClick = (activity) => {
    if (activity.message.includes("measurement")) {
      setMeasurementId(activity.activityId);
    } // checks for created custom workouts
    if (
      activity.message.includes("created") ||
      activity.message.includes("assigned")
    ) {
      setCustomWorkoutId(activity.activityId);
      handleWorkoutModal();
    } else {
      setCustomWorkoutId("");
    }

    if (
      !activity.message.includes("goal") &&
      !activity.message.includes("task") &&
      activity.message.includes("completed")
    ) {
      setCompletedWorkoutId(activity.activityId);
      handleWorkoutModal();
    } else {
      setCompletedWorkoutId("");
    }
  };

  const handleDeleteAll = () => {
    setDeleteAllActivity(true);
  };

  const handleDelete = (activity) => {
    console.log("activity", activity);
    setActivityId(activity.activityId);
  };

  const renderList = data?.currentData().map((activity, index) => {
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

    return (
      <ListItem
        className={"activityFeed-list-item"}
        key={activity._id + "list item"}
        disablePadding
      >
        <ListItemButton
          key={activity._id + "list item button"}
          role={undefined}
          onClick={() => handleClick(activity)}
          dense
        >
          <ListItemIcon key={activity._id + "icon"}>{iconType}</ListItemIcon>
          <ListItemText
            id={
              activity?.activityID ? activity.activityID : activity.activityId
            }
            primary={<div>{activity.message}</div>}
            secondary={activity.createdAt}
          />
        </ListItemButton>
      </ListItem>
    );
  });

  return (
    <Paper
      className="activity-feed"
      sx={{
        border: "3px solid #689ee1",
        boxShadow: "4px 8px 8px hsl(0deg 0% 0% / 0.38)",

        borderRadius: "10px",
      }}
    >
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

      {loadingActivityNotifications ? (
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
          <List>{renderList}</List>

          {activityNotifications?.length === 0 && <h2>No Recent Activity</h2>}
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
        hidden={count ? false : true}
        page={page}
        count={count || 0}
        variant="outlined"
        color="primary"
        onChange={handleChangePage}
        sx={{ mt: 2, mb: 1 }}
      />
      {activityNotifications?.length > 0 && (
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2, mb: 1, ml: 1, borderRadius: 2 }}
          onClick={() => setConfirmOpen(true)}
        >
          Clear All
        </Button>
      )}
    </Paper>
  );
};

export default ActivityFeed;
