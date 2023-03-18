import { Button, CircularProgress } from "@mui/material";
import React from "react";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";

const CalendarInfo = ({ currentEvent, setCurrentEvent }) => {
  const axiosPrivate = useAxiosPrivate();
  const deleteCalendarEvent = useProfile((state) => state.deleteCalendarEvent);
  const deleteNotification = useProfile((state) => state.deleteNotification);
  const activeNotifications = useProfile((state) => state.activeNotifications);
  const [loading, setLoading] = React.useState(false);
  const today = new Date().getTime();

  const handleCompleteGoal = () => {
    // remove goal from calendar events
    setLoading(true);
    completeGoal(axiosPrivate, currentEvent._id).then((res) => {
      if (!res.error) {
        //remove goal from local state
        deleteCalendarEvent(currentEvent._id);
        // delete notification
        const targetNotification = activeNotifications.filter(
          (n) => n.goalId === currentEvent._id
        );
        if (targetNotification.length > 0) {
          deleteSingleNotification(
            axiosPrivate,
            targetNotification[0]._id
          ).then((res) => {
            if (!res.error) {
              deleteNotification(targetNotification[0]._id);
            }
          });
        }
      }
      setLoading(false);
      setCurrentEvent(null);
    });
  };

  return currentEvent?.type === "goal" ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
      id="calendar-info"
    >
      <h3>
        <strong>Current Goal: </strong>
        {currentEvent?.title}
      </h3>
      <p>
        <span style={styles.span}>
          {" "}
          Start Date: {new Date(currentEvent.start).toDateString()}
        </span>
        <span style={styles.span}>
          Goal Scheduled Completion Date: {new Date(currentEvent.end).toDateString()}
        </span>
        <span style={styles.span}>
          You have {Math.floor((new Date(currentEvent.end).getTime() - today) / (1000 * 60 * 60 * 24)) + 1} days left to complete your goal
        </span>
        {today < new Date(currentEvent.end).getTime() && <span style={styles.span}>
          Did you Complete your goal?


        </span>
        
        }

      </p>
      <Button
        variant="contained"
        color="success"
        disabled={loading}
        onClick={handleCompleteGoal}
        sx={{ borderRadius: 10 }}
      >
        {loading ? "Loading..." : "Complete Goal"}
      </Button>
      {loading && <CircularProgress />}
    </div>
  ) : null;
};

const styles = {
  span: {
    display: "block",
  },
  
};

export default CalendarInfo;
