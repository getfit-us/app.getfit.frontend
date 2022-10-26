

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { exampleData, exampleMeasurements } from "../assets/data/exampleData";
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
import Calendar from 'react-calendar'
import { Link } from "react-router-dom";
import HomePageFeatures from "./HomePageFeatures";
import { DirectionsRun, Flag } from "@mui/icons-material";

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


  const renderTile = ({ activeStartDate, date, view }) => {
    return calendar?.map((event) => {
      if (
        new Date(event.end).toDateString() ===
          new Date(date).toDateString() &&
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
          >
    
            {" "}
            <Fab color="success" size="small">
              <Flag />
            </Fab>
            <span>Finish Goal</span>
          </div>
        );
      } else if (  new Date(event.end).toDateString() ===
      new Date(date).toDateString() &&
    event.type === "task") {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
          }}
        >
  
          {" "}
          <Fab color={event.title === 'cardio' ? 'warning' : 'primary'} size="small">
            {event.title === 'cardio' ? <DirectionsRun/> : <FitnessCenterIcon/>}
          </Fab>
          {event.title === 'cardio' ? <span>Cardio!</span> : <span>Workout!</span>} 
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
      date: d[0],
      weight: measurement.weight,
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
            <Fab color="primary" sx={{ mr: 1,  display: { xs: "none", md: "flex" }, }}>
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
      <Grid item xs={12} mb={4} sx={{padding : 1, display: 'flex', justifyContent: 'center'}} >
        
        <Calendar
          next2Label={null}
          prev2Label={null}
          tileContent={renderTile}
          

        />
        </Grid>

      <Grid item xs={12} id="learnMore" sx={{ ml: 2, mb: 5, mr: 2 }}>
        <HomePageFeatures measurements={measurements} />
      </Grid>
    </Grid>
  );
};

export default HomePage;
