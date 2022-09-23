import { Grid } from '@mui/material';
import React from 'react'
import useProfile from '../../hooks/useProfile'

const Reminders = () => {
    const {state, dispatch} = useProfile();



// if notification.type === reminder its going to be here


console.log(state.notifications)

  return (
    <Grid container>
        <Grid item xs={12} sx={{mt: 4, justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
            <h1>Reminders</h1>
        </Grid>



    </Grid>
   
  )
}

export default Reminders