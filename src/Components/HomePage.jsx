import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {
  exampleData,
  exampleMeasurements,
  exampleWorkouts,
} from "../assets/data/exampleData";
import {
  Button,
  Fab,
  Grid,
  Paper,
  Tooltip as MuiToolTip,
  Typography,
  useTheme,
  CssBaseline,
  styled,
} from "@mui/material";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";
import HomePageFeatures from "./HomePageFeatures";
import { DirectionsRun, Flag } from "@mui/icons-material";
import { useEffect } from "react";
import styles from './homepage.module.css' 

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const HomePage = () => {
  const theme = useTheme();
  const todaysDate = new Date();
  const day = todaysDate.getDate();
  const month = new Date().getMonth();
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const timestampThirtyInFuture = new Date().getTime() + thirtyDaysInMs;

  useEffect(() => {
    document.title = "Getfit App";
  }, []);

  const renderTile = ({ activeStartDate, date, view }) => {
    return calendar?.map((event, index) => {
      if (
        new Date(event.end).toDateString() === new Date(date).toDateString() &&
        event.type === "goal"
      ) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
            }}
            key={event._id + 'goal' + index}
          >
            {" "}
            <Fab color="success" 
                          component="span"

            size="small">
              <Flag />
            </Fab>
            <span style={{ fontSize: 11 }}>Finish Goal</span>
          </div>
        );
      } else if (
        new Date(event.end).toDateString() === new Date(date).toDateString() &&
        event.type === "task"
      ) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: "100%",
              alignItems: "center",
            }}
            key={event._id + 'task' + index}
          >
            {" "}
            <Fab
              color={event.title === "cardio" ? "warning" : "primary"}
              size="small"
              component="span"

            >
              {event.title === "cardio" ? (
                <DirectionsRun />
              ) : (
                <FitnessCenterIcon />
              )}
            </Fab>
            {event.title === "cardio" ? (
              <span style={{ fontSize: 11 }}> Cardio</span>
            ) : (
              <span style={{ fontSize: 11 }}>Workout</span>
            )}
          </div>
        );
      }
    });
  };

  //update date on render to show example data for the month

  const measurements = exampleMeasurements.map((measurement) => {
    let d = randomDate(todaysDate, new Date(timestampThirtyInFuture));
    d = d.toISOString().split("T");
    return {
      title: "Measurement",
      id: measurement.id,
      date: new Date(d[0]).toLocaleDateString(),
      weight: measurement.weight,
      bodyfat: measurement.bodyfat,
    };
  });

  //update date on render to show example data for the month

  const calendar = exampleData.map((event) => {
    let d = randomDate(todaysDate, new Date(timestampThirtyInFuture));
    d = d.toISOString().split("T");

    return {
      ...event,
      end: d[0],
    };
  });





  return (
    <Grid container spacing={0} className={styles.container}>
      <CssBaseline />
      <Grid
        item
        xs={12}
        sx={{
          textAlign: "center",
          minWidth: "100%",
          backgroundImage:
            "-webkit-linear-gradient(30deg, #013a6b 50%, #004e95 50%)",
          backgroundColor: "#013a6b",
        }}
      >
        <Paper
          sx={{
            padding: 4,
            elevation: 3,
            position: "relative",
            marginBottom: "3em",
            width: "100%",
            zIndex: 1,
          }}
          className={styles.h1}
        >
          <h1> GETFIT </h1>

          <h2>All in one coaching / fitness training app</h2>


          <Button
            variant="contained"
            size="large"
            element={Link}
            href="#learnMore"
            color="primary"
            className={styles.learnMore}
            sx={{
              marginTop: 2,
            }}

            
          >
            Learn More
          </Button>
        </Paper>
        <div className="homePageCalendar">
          {" "}
          <h2>Overview</h2>
          <Calendar
            next2Label={null}
            prev2Label={null}
            tileContent={renderTile}
            className="react-calendar"
          />
        </div>

      </Grid>

      <HomePageFeatures
        measurements={measurements}
        workouts={exampleWorkouts}
        randomDate={randomDate}
      />
    </Grid>
  );
};

export default HomePage;
