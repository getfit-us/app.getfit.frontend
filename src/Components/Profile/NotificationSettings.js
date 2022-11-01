import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Switch,
} from "@mui/material";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    workouts: true,
    goals: true,
    messages: true,
    save: false,
  });
  const axiosPrivate = useAxiosPrivate();
  const profile = useProfile((state) => state.profile);
  const updateProfileState = useProfile((state) => state.updateProfile);
  const activityChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
      save: true,
    });

    //api call

    // updateProfile();
  };

  //api call to update user notification settings
  const updateProfile = async () => {
    //set clientId
    let data = {};
    data.id = profile.clientId;
    data.NotificationSettings = {};
    //set notifications
    Object.entries(notifications).forEach((entry) => {
      if (entry[0] === "email" && entry[1] === true) {
        data.NotificationSettings.email = true;
      } else if (entry[0] === "email" && entry[1] === false)
        data.NotificationSettings.email = false;
      if (entry[0] === "workouts" && entry[1] === true) {
        data.NotificationSettings.workouts = true;
      } else if (entry[0] === "workouts" && entry[1] === false)
        data.NotificationSettings.workouts = false;
      if (entry[0] === "goals" && entry[1] === true) {
        data.NotificationSettings.goals = true;
      } else if (entry[0] === "goals" && entry[1] === false)
        data.NotificationSettings.goals = false;
      if (entry[0] === "messages" && entry[1] === true) {
        data.NotificationSettings.messages = true;
      } else if (entry[0] === "messages" && entry[1] === false)
        data.NotificationSettings.messages = false;
    });

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put(`/users/${data.id}`, data, {
        signal: controller.signal,
        withCredentials: true,
      });
     updateProfileState(response.data);
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12}> <h3>Activity</h3></Grid>
     
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Email Notifications</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.email}
                onChange={activityChange}
                name="email"
              />
            }
            label="when I receive a notification"
          />
          <FormControlLabel
            control={
              <Switch
                checked={notifications.workouts}
                onChange={activityChange}
                name="workouts"
              />
            }
            label="reminders for workouts"
          />
          <FormControlLabel
            control={
              <Switch
                checked={notifications.goals}
                onChange={activityChange}
                name="goals"
              />
            }
            label="reminders about my goals"
          />
          <FormControlLabel
            control={
              <Switch
                checked={notifications.messages}
                onChange={activityChange}
                name="messages"
              />
            }
            label="New messages"
          />
        </FormGroup>
      </FormControl>

      {notifications.save && (

        <Grid item sx={{mt: 2}}> <Button onClick={updateProfile} variant="contained" color="primary">
        Save Changes
      </Button></Grid>
       
      )}
      </Grid>
    
    </div>
  );
};

export default Notifications;
