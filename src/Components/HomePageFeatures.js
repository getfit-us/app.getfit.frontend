import { colors, Fab, Grid, Paper, useMediaQuery } from "@mui/material";

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

  measurements = measurements.filter(
    (measurement) => measurement.title === "Measurement"
  );

  return (
    <Grid container spacing={1}>
      {/* grid to display selected content from tools below */}

      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <h1>
          All the tools you need to <span>GetFit</span> and reach your goals!
        </h1>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Paper elevation={5} className="training-card">
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
            <h3>Training</h3>
          </Grid>

          <Grid item xs={12}>
            <p>
              <ul>
                <li>
                  Create and assign custom workout routines to their clients.
                </li>
                <li>
                  Monitor client progress and make adjustments to workouts and
                  cardio routines.
                </li>
                <li>
                  Receive activity information on new measurements, completed
                  workouts, new goals and goals achieved.
                </li>
                <li>
                  Assign tasks to clients (i.e. "Complete Chest Workout on
                  Monday , Do 30 minutes of cardio")
                </li>
              </ul>
            </p>
            <div className="img-container">
              <img
                src="/img/Create-Workout-Heavy-Push.png"
                alt="demo of create workout"
                width={"100%"}
                height="100%"
              />
            </div>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} id="progress">
        <Paper
          elevation={5}
          className="progress-card"
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
            <h3>Progress Tracking</h3>
          </Grid>
          <Grid item xs={12}>
            {" "}
            <ul >
              <li>Compare progress photos</li>
              <li>Track your lifts</li>
              <li>Set goals</li>
              <li>Compare your exercise history</li>
            </ul>
          </Grid>
          <div className="measurement-container">
            <MeasurementChart measurements={measurements} />
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} id="message">
        <Paper
          elevation={5}
          className="message-card"
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
            <Fab color="primary" sx={{ mr: 1 }}>
              <ChatSharp />
            </Fab>
            <h3>Messaging</h3>
          </Grid>
          <Grid item xs={12}>
            {" "}
            <p>Communicate directly with your clients. {" "}
            Set Tasks for clients along with due dates and reminders. </p>
            <ul >
              <li>Complete Cardio</li>
              <li>Complete Leg Workout</li>
              <li>Check in with Measurements</li>
            </ul>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HomePageFeatures;
