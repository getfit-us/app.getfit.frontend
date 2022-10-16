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
    <Grid container spacing={2}>
      {/* grid to display selected content from tools below */}

      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <h1>
          All the tools you need to <span style={styles.getfit}>GetFit</span>{" "}
          and reach your goals!
        </h1>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper
          elevation={5}
          style={styles.training}
          sx={{}}
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
              Build custom workouts in minutes and assign them to your clients.
            </p>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4} id="progress">
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
            </ul>
          </Grid>
          <Grid item>
            <MeasurementChart
              width={smScreen ? 300 : 400}
              measurements={measurements}
            />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4} id="message">
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
              Set Reminders, "Do Cardio" , "Complete the workouts for the week"
            </p>
          </Grid>
        </Paper>
      </Grid>
      <Grid
        item
        xs={12}
        sm={5}
        sx={{ display: features.progress ? "block" : "none" }}
      >
        <p>Training</p>
      </Grid>
      <Grid
        item
        xs={12}
        sm={5}
        sx={{ display: features.progress ? "block" : "none" }}
      >
        <Paper elevation={5}> </Paper>
      </Grid>

      <Grid
        item
        xs={12}
        sm={5}
        sx={{ display: features.message ? "block" : "none" }}
      >
        <p>message</p>
      </Grid>
    </Grid>
  );
};

export default HomePageFeatures;
