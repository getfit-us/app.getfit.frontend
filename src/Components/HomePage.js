import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import StraightenIcon from "@mui/icons-material/Straighten";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import {exampleWorkouts }from '../assets/data/exampleData';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Fab,
  Grid,
  Paper,
  Typography,
  useTheme,
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

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
const month = new Date().getMonth();

const HomePage = () => {
  const theme = useTheme();
  const todaysDate = new Date();

  const exampleData = [
    {
      date: "2021-01-01",

      weight: 246,
      images: ["1425960725259.jpg"],
      bodyfat: 23,
    },
    {
      date: "2021-02-01",

      weight: 226,
      images: ["1425960725259.jpg"],
      bodyfat: 21,
    },
    {
      date: "2021-03-01",

      weight: 216,
      images: ["1425960725259.jpg"],
      bodyfat: 19,
    },
    {
      date: "2021-04-01",

      weight: 205,
      images: ["1425960725259.jpg"],
      bodyfat: 18,
    },
    {
      date: "2021-05-01",

      weight: 195,
      images: ["1425960725259.jpg"],
      bodyfat: 17,
    },
    {
      date: "2021-07-01",

      weight: 180,
      images: ["1425960725259.jpg"],
      bodyfat: 15,
    },
  ];

  const exampleMeasurements = [
    {
      _id: "630a3fda4675b361b587ae9e1",
      date: "Wed Aug 31 2022",
      clientId: "62d42b6585c717786231d372",
      weight: 200,
      images: ["328223866632.jpg"],
      bodyfat: 10,
      __v: 0,
    },
    {
      _id: "630a3fda4675b6a1b587ae9e1",
      date: "Wed Aug 12 2022",
      clientId: "62d42b6585c717786231d372",
      weight: 200,
      images: ["328223866632.jpg"],
      bodyfat: 10,
      __v: 0,
    },
    {
      _id: "630a3fda4675b61cb587ae9e1",
      date: "Wed Aug 15 2022",
      clientId: "62d42b6585c717786231d372",
      weight: 200,
      images: ["328223866632.jpg"],
      bodyfat: 10,
      __v: 0,
    },
    {
      _id: "630a3fda4675b61b587ae9e1",
      date: "Wed Aug 31 2022",
      clientId: "62d42b6585c717786231d372",
      weight: 200,
      images: ["328223866632.jpg"],
      bodyfat: 10,
      __v: 0,
    },
    {
      _id: "630a3fda4675xb61b587ae9e1",
      date: "Wed Aug 31 2022",
      clientId: "62d42b6585c717786231d372",
      weight: 200,
      images: ["328223866632.jpg"],
      bodyfat: 10,
      __v: 0,
    },
  ];

  

  const measurements = exampleMeasurements.map((measurement) => {
    return {
      title: "Measurement",
      id: measurement._id,
      date: measurement.date,
      weight: measurement.weight,
    };
  });

  exampleWorkouts.map((workout) => {
    measurements.push({
      title: `${workout.name} workout`,
      id: workout._id,
      date: workout.Created,
    });
  });

  const styles = {
    container: {
      minHeight: "100vh",
      justifyContent: "center",
      alignItems: "center",
      scrollBehavior: "smooth",
      backgroundColor: "#f2f4f7"
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

  console.log(measurements);
  return (
    <Grid container spacing={0} style={styles.container}>
      <Grid
        item
        xs={12}
       
        sx={{ textAlign: "center", minWidth: "100%" }}
      >
        <Paper sx={{ padding: 4, backgroundColor: "#c78748", elevation: 3 }}  style={styles.h1}>
          <h1> GETFIT Personal Training </h1>

          <h3>All in one personal training </h3>
          <h1>
            <FitnessCenterIcon color="primary" fontSize="large" /> Plan and
            Track Your Workouts to Reach Your Goals!
          </h1>
        
          <Button
            variant="contained"
            size="large"
            element={Link}
            href="#learnMore"
            color="primary"
            sx={{marginTop:3}}
          >
            Learn More
          </Button>
        </Paper>
      </Grid>

      <Grid
        item
        xs={12}
        sm={4}
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
            data={exampleData}
            barSize={10}
            barGap={2}
            barCategoryGap={1}
            // onClick={(e) => console.log(e.target)}
            style={styles.chart}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="white" />
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
      </Grid>

      <Grid item xs={12} sm={7} md={6} mb={4} sx={{}}>
        <Paper elevation={4} sx={{ p: 2 }}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={measurements}
            eventColor={theme.palette.primary.main}
            eventDisplay="list-item"
            eventContent={(info) => {
              return (
                <>
                  <Tooltip title={info.event.title} arrow placement="top">
                    {info.event.title.includes("workout") ? (
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
                    ) : (
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
                    )}
                  </Tooltip>
                </>
              );
            }}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} id="learnMore" > 
      <Paper><Typography>Training</Typography></Paper>
      <Paper><Typography>Messaging</Typography></Paper>
      <Paper><Typography>Progress Tracker</Typography></Paper>
      <Paper></Paper>
      </Grid>
    </Grid>
  );
};

export default HomePage;
