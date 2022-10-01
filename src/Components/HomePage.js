import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import fitIcon from "../assets/img/fitness-icon.svg";

import StraightenIcon from "@mui/icons-material/Straighten";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { exampleWorkouts } from "../assets/data/exampleData";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Paper,
  Tooltip as MuiToolTip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Link } from "react-router-dom";
import { useState } from "react";
import HomePageFeatures from "./HomePageFeatures";
import '../assets/css/homepage.css';

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

  const smDn = useMediaQuery((theme) => theme.breakpoints.up("sm"), {
    defaultMatches: true,
    noSsr: false,
  });

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
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={fitIcon} alt="fitness icon" width='50px'  height='50px'style={{marginRight: '10px'}} />
            <Typography
              variant="h4"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
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
      <Grid item xs={12} mb={4} sx={{ p: 2 ,}}>
        <Paper elevation={4} sx={{ p: 2 }}>
          <FullCalendar
            plugins={[dayGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            events={measurements}
            eventColor={theme.palette.primary.main}
            eventDisplay="list-item"
            eventContent={(info) => {
              return (
                <>
                  {info.event.title.includes("Workout") ? (
                    <MuiToolTip title={info.event.title} arrow placement="top">
                      <Fab
                        color="primary"
                        size="small"
                        // onClick={() => {
                        //   // console.log(info.event._def.publicId);
                        //   setViewWorkout(
                        //     state.completedWorkouts.filter(
                        //       (w) => w._id === info.event._def.publicId
                        //     )
                        //   );

                        //   handleWorkoutModal();
                        // }}
                      >
                        <FitnessCenterIcon fontSize="small" />
                      </Fab>
                    </MuiToolTip>
                  ) : (
                    <MuiToolTip title={info.event.title} arrow placement="top">
                      <Fab
                        color="success"
                        size="small"
                        // onClick={() => {
                        //   // console.log(info.event._def.publicId);
                        //   setViewMeasurement(
                        //     state.measurements.filter(
                        //       (m) => m._id === info.event._def.publicId
                        //     )
                        //   );

                        //   handleMeasurementModal();
                        // }}
                      >
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

      {/* <Grid
        item
        xs={12}
       
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "2px",
        }}
      >
        <Card
          style={styles.cardChart}
          elevation={4}
          sx={{
            ":hover": {
              transform: "scale(1.1)",
              boxShadow: 20,
            },
          }}
        >
          <BarChart
            width={400}
            height={250}
            data={exampleMeasurements}
            barSize={10}
            barGap={2}
            barCategoryGap={1}
            // onClick={(e) => console.log(e.target)}
            style={styles.chart}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" 
             allowDataOverflow={false} 
             minTickGap={8} stroke="white" />
            <YAxis stroke="white" />
            <Tooltip
              cursor={false}
              contentStyle={{
                opacity: 0.9,
                backgroundColor: "black",
                color: "white",
              }}
            />
            <Legend />

            <Bar dataKey="bodyfat" fill="#000000e" />
            <Bar dataKey="weight" fill="#cccccc" />
          </BarChart>

          <CardContent style={styles.CardContent}>
            <h2>Track your progress</h2>
          </CardContent>
        </Card>
      </Grid> */}

      <Grid item xs={12} id="learnMore" sx={{ ml: 2, mb: 5, mr: 2 }}>
        <HomePageFeatures />
      </Grid>
    </Grid>
  );
};

export default HomePage;
