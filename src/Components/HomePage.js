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
} from "@mui/material";
import Calendar from "react-calendar";
import { Link } from "react-router-dom";
import HomePageFeatures from "./HomePageFeatures";
import { DirectionsRun, Flag } from "@mui/icons-material";
import { useEffect } from "react";

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
    return calendar?.map((event) => {
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
            key={event._id}
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
            key={event._id}
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

  const styles = {
    container: {
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center",
      scrollBehavior: "smooth",
      margin: 0,
      width: "100%",
      backgroundColor: "#013a6b",
      backgroundImage:
        "-webkit-linear-gradient(30deg, #013a6b 53.7%, #004e95 50%)",
    },
    h1: {
      padding: "6rem",

      flexGrow: 1,
      textAlign: "center",
      justifyContent: "center",
      backgroundImage:
        "linear-gradient(to right bottom, #af6f30, #bb7b3c, #c78748, #d49354, #e09f60)",
      borderRadius: "0 0 150px 0",
    },
    chart: {
      margin: "auto",
      borderBottom: "5px solid black",
      padding: "1px",
      borderRadius: "20px",
      color: "black",
      backgroundImage:
        "linear-gradient(to right top, #689ee1, #5288d3, #3e71c4, #2c5bb5, #1c45a4)",
    },
    cardChart: {
      padding: "0px",
      border: "2px solid black",
      borderRadius: "20px",
      justifyContent: "start",
      alignItems: "flex-start",
      transition: "transform .2s",
      maxHeight: "350px",
    },
    CardContent: {
      textAlign: "center",

      borderRadius: "20px",
      margin: 0,
    },
    card: {
      borderRadius: "20px",
    },
    event: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      padding: 4,
      borderRadius: "10px",
      whiteSpace: "wrap",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <Grid container spacing={0} style={styles.container}>
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
            backgroundColor: "#c78748",
            elevation: 3,
            position: "relative",
            marginBottom: "3em",
            width: "100%",
            zIndex: 1,
          }}
          style={styles.h1}
        >
          <h1> GETFIT PERSONAL TRAINING </h1>

          <h3>All in one personal training </h3>

          <Typography variant="h5">
            Plan and Track Your Workouts to Reach Your Goals!
          </Typography>

          <Button
            variant="contained"
            size="large"
            element={Link}
            href="#learnMore"
            color="primary"
            sx={{ marginTop: 3, borderRadius: "10px" }}
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

        <div className=""></div>
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
