import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Switch } from '@mui/material';
import {useState} from 'react'

const Notifications = () => {
    const [notifications , setNotifications] = useState({
        email: true,
        workouts: true,
        goals: true,

    }); 

    const activityChange = (event) => {
        setNotifications({
            ...notifications,
            [event.target.name]: event.target.checked,
            
            
        }
        );
    }

  return ( <>
    <h3>Activity</h3>
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Email Notifications</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={notifications.email} onChange={activityChange} name="email" />
          }
          label="when I receive a notification"
        />
        <FormControlLabel
          control={
            <Switch checked={notifications.workouts} onChange={activityChange} name="workouts" />
          }
          label="reminders for workouts"
        />
        <FormControlLabel
          control={
            <Switch checked={notifications.goals} onChange={activityChange} name="goals" />
          }
          label="reminders about my goals"
        />
      </FormGroup>
    </FormControl>
    </>
  )
}

export default Notifications