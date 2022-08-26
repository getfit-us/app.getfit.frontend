import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'

const NoWorkouts = () => {
    return (
        <>  
            <Grid container sx={{alignItems: 'center', justifyContent: 'center', marginLeft: '10px'}}>
            <Grid item xs={12}>         
            <Typography variant='h5' >View Workouts</Typography>
            </Grid>


            <Grid item xs={12}>  
            <Typography variant='p'> Sorry No Workouts Found</Typography>
            </Grid>
            </Grid>

        </>

    )
}

export default NoWorkouts