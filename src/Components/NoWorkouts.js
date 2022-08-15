import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'

const NoWorkouts = () => {
    return (
        <>
            <Grid item xs={12}>        <Typography variant='h5' >View Workouts</Typography>
            </Grid>


            <Grid item xs={12}>  
            <Typography variant='p'> Sorry No Workouts Found</Typography>
            </Grid>

        </>

    )
}

export default NoWorkouts