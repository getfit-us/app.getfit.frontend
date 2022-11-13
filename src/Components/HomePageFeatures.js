import { Fab, Grid, Paper, useMediaQuery } from "@mui/material";

import { useState } from "react";
import { BarChartSharp, ChatSharp, FitnessCenter } from "@mui/icons-material";
import MeasurementChart from "../Components/Measurements/MeasurementChart";
const HomePageFeatures = ({ measurements }) => {
  const [features, setFeatures] = useState({
    training: false,
    message: false,
    progress: false,
  });

  const smScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });
  const mdScreen = useMediaQuery((theme) => theme.breakpoints.up("md"), {
    defaultMatches: true,
    noSsr: false,
  });



  measurements = measurements.filter(measurement => measurement.title === 'Measurement')

  const styles = {
    training: {},
    message: {
      padding: "1rem",
      borderRadius: 5,
    },
    progress: {
      padding: "1rem",
      borderRadius: 5,
    },
    getfit: {
      textDecoration: "underline",
      fontWeight: "bold",
    },
    img: {
      width: "50px",
      height: "50px",
      marginRight: "10px",
    },
    title: {
      fontSize: "1.5rem",
      // padding: 10,
      // backgroundColor: '#3070af',
      // color: 'white', borderRadius: 10,
    },
  };

  return (
    <Grid container spacing={1}>
      {/* grid to display selected content from tools below */}

      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <h1>
          All the tools you need to <span style={styles.getfit}>GetFit</span>{" "}
          and reach your goals!
        </h1>
      </Grid>
      <Grid item xs={12} sm={12} md={6}  lg={6}>
        <Paper
          elevation={5}
          style={styles.training}
         
          id="training"
          className="training"
        >
          <Grid
            item
            xs={12}
            sx={{
              justifyContent: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Fab sx={{ mr: 1 }} color="primary">
              <FitnessCenter />
            </Fab>
            <h3 style={styles.title}>Training</h3>
          </Grid>

          <Grid item xs={12} >
            <p>
              <ul>
               
                <li>Build custom workouts and assign them to your clients</li>
                <li>Get notified when your clients complete their workouts</li>

              </ul>

            </p>
            <div className="img-container">
            <img src="/img/Create-Workout-Heavy-Push.png" alt='demo of create workout' width={'100%'} height='100%' />

            </div>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6}  lg={6} id="progress">
        <Paper
          elevation={5}
          style={styles.progress}
          sx={{ "&:hover": { outline: "2px solid #3070af" } }}
        >
          <Grid
            item
            xs={12}
            sx={{
              justifyContent: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <Fab sx={{ mr: 1 }} color="primary">
              <BarChartSharp size="large" />
            </Fab>
            <h3 style={styles.title}>Progress Tracking</h3>
          </Grid>
          <Grid item xs={12}>
            {" "}
            <ul>
              <li>Compare progress photos</li>
              <li>Track your lifts</li>
              <li>Set goals</li>
              <li>Compare your exercise history</li>
            </ul>
          </Grid>
            <div className='measurement-container'>
            <MeasurementChart
              measurements={measurements}
            />
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6}  lg={6} id="message">
        <Paper
          elevation={5}
          style={styles.message}
          sx={{ "&:hover": { outline: "2px solid #3070af" } }}
        >
          <Grid
            item
            xs={12}
           
            sx={{
              justifyContent: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Fab color="primary" sx={{mr:1 }}>
              <ChatSharp />
            </Fab>
            <h3 style={styles.title}>Messaging</h3>
          </Grid>
          <Grid item xs={12}>
            {" "}
            <p>Communicate directly with your clients. </p>{" "}
            <p>
              Set Tasks for clients along with due dates and reminders.{" "}

              </p>
              <ul>
                <li>Complete Cardio</li>
              <li>Complete Workout</li>
              <li>Check in with Measurements</li>
              
              
              </ul>

          </Grid>
        </Paper>
      </Grid>
     
    </Grid>
  );
};

export default HomePageFeatures;
