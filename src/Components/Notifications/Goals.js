import { Check, Delete } from "@mui/icons-material";
import {
  Checkbox,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";

const Goals = () => {
  const { state, dispatch } = useProfile();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleCompleteGoal = async (id) => {
    console.log(id);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(`/users/goal/${id}`, {
        signal: controller.signal,
        withCredentials: true,
      });
      console.log(response.data);
      dispatch({
        type: "UPDATE_GOALS",
        payload: response.data,
      });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  // ----get all the user activity from notification state --- sort only activity from notification state
  let userGoalNotifications = state.notifications.filter((notification) => {
    if (notification.type === "goal" && notification.is_read === false) {
      return true;
    }
  });

  userGoalNotifications = userGoalNotifications.sort(function (a, b) {
    if (a.createdAt > b.createdAt) return -1;
  });

  console.log(userGoalNotifications);
  return (
    <Paper
      sx={{
        padding: 2,

        marginBottom: 3,
        minWidth: "100%",
      }}
    >
      {" "}
      <form>
        <Grid
          container
          spacing={1}
          style={styles.container}
          sx={{
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Grid item xs={12}>
            <h3 style={styles.header}>Goals</h3>
          </Grid>
          <List>
            {userGoalNotifications &&
              userGoalNotifications.map((notification, index) => {
                return (
                  <ListItem
                    key={notification._id}
                    disablePadding
                    secondaryAction={
                      <Tooltip title="Complete Goal">
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => {
                            if (
                              notification.sender.id === state.profile.clientId
                            )
                              handleCompleteGoal(notification._id);
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
                      // onClick={() => handleListItemClick(index)}
                    >
                      <ListItemText
                        id={notification._id}
                        primary={notification.message}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}

          
          </List>
          {userGoalNotifications.length === 0 && (
                <Grid item xs={12} style={{justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                <h2>No Goals Found</h2>
                <p>Goto your profile and add some goals!</p>
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
  message: {},
};

export default Goals;
