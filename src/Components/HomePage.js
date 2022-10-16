import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import StraightenIcon from "@mui/icons-material/Straighten";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { exampleWorkouts } from "../assets/data/exampleData";
import {
  Button,
  Fab,
  Grid,
  Paper,
  Tooltip as MuiToolTip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { Link } from "react-router-dom";
import HomePageFeatures from "./HomePageFeatures";

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
  const smScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const smDn = useMediaQuery((theme) => theme.breakpoints.up("sm"), {
    defaultMatches: true,
    noSsr: false,
  });
  document.title = "Getfit App";

  const exampleMeasurements = [
    {
      date: "2021-03-01",
      id: "630a3fda4675b661b587ae9e1",

      weight: 216,
      images: ["1425960725259.jpg"],
      bodyfat: 19,
    },
    {
      date: "2021-04-01",
      id: "630a3fda4675b341b587ae9e1",

      weight: 205,
      images: ["1425960725259.jpg"],
      bodyfat: 18,
    },
    {
      date: "2021-05-01",
      id: "630a3fda4675b361ba587ae9e1",

      weight: 195,
      images: ["1425960725259.jpg"],
      bodyfat: 17,
    },
    {
      date: "2021-07-01",
      id: "630a3fda4675bz361b587ae9e1",

      weight: 180,
      images: ["1425960725259.jpg"],
      bodyfat: 15,
    },
  ];

  const measurements = exampleMeasurements.map((measurement) => {
    let d = randomDate(todaysDate, new Date(timestampThirtyInFuture));
    d = d.toISOString().split("T");

    return {
      title: "Measurement",
      id: measurement.id,
      date: d[0],
      weight: measurement.weight,
    };
  });

  exampleWorkouts.map((workout) => {
    let d = randomDate(todaysDate, new Date(timestampThirtyInFuture));
    d = d.toISOString().split("T");
    measurements.push({
      title: `Completed ${workout.name} Workout`,
      id: workout._id,
      date: d[0],
    });
  });

  const styles = {
    container: {
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center",
      scrollBehavior: "smooth",
      backgroundColor: "#f2f4f7",
    },
    h1: {
      padding: "6rem",

      flexGrow: 1,
      textAlign: "center",
      justifyContent: "center",
      backgroundImage:
        "linear-gradient(to right bottom, #af6f30, #bb7b3c, #c78748, #d49354, #e09f60)",
      borderRadius: "0 0 150px 0",
      marginBottom: "1rem",
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
      <Grid item xs={12} sx={{ textAlign: "center", minWidth: "100%" }}>
        <Paper
          sx={{ padding: 4, backgroundColor: "#c78748", elevation: 3 }}
          style={styles.h1}
        >
          <h1> GETFIT PERSONAL TRAINING </h1>

          <h3>All in one personal training </h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
             
            
            }}
          >
            <Fab color="primary" sx={{ mr: 1,  display: { xs: "none", sm: "flex" }, }}>
              <FitnessCenterIcon />
            </Fab>
            <Typography variant="h4">
              Plan and Track Your Workouts to Reach Your Goals!
            </Typography>
          </div>

          <Button
            variant="contained"
            size="large"
            element={Link}
            href="#learnMore"
            color="primary"
            sx={{ marginTop: 3 }}
          >
            Learn More
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} mb={4} sx={{ p: 2 }}>
        <Paper elevation={4} sx={{ p: 2 }}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={measurements}
            eventColor={theme.palette.primary.main}
            eventDisplay="list-item"
            headerToolbar={{
              left: smScreen ? "prev,next today" : "prev,next",
              center: "title",
              right: smScreen ? "dayGridMonth,dayGridWeek" : "",
            }}
            eventContent={(info) => {
              return (
                <>
                  {info.event.title.includes("Workout") ? (
                    <MuiToolTip title={info.event.title} arrow placement="top">
                      <Fab color="primary" size="small">
                        <FitnessCenterIcon fontSize="small" />
                      </Fab>
                    </MuiToolTip>
                  ) : (
                    <MuiToolTip title={info.event.title} arrow placement="top">
                      <Fab color="success" size="small">
                        <StraightenIcon fontSize="small" />
                      </Fab>
                    </MuiToolTip>
                  )}
                </>
              );
            }}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} id="learnMore" sx={{ ml: 2, mb: 5, mr: 2 }}>
        <HomePageFeatures measurements={measurements} />
      </Grid>
    </Grid>
  );
};

export default HomePage;
