// component to display group of pictures ..
import React from 'react'
import useProfile from "../utils/useProfile";
import { Grid } from '@mui/material';

const ProgressPics = () => {
    const { state } = useProfile();
    const progressPics = state.profile.measurements.map(measurement => {


    })


    return (
        <Grid container>
            <Grid item>
                <img src={`http://localhost:8000/avatar/${state.measurements.avatar}`} alt="" />
            </Grid>
        </Grid>


    )
}

export default ProgressPics