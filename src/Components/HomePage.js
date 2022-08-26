import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { border, borderRadius } from "@mui/system";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Text,
} from "recharts";

const HomePage = () => {
  const exampleData = [
    {
      date: "Aug 01 2021",

      weight: 246,
      images: ["1425960725259.jpg"],
      bodyfat: 23,
    },
    {
      date: "September 01 2021",

      weight: 226,
      images: ["1425960725259.jpg"],
      bodyfat: 21,
    },
    {
      date: "Oct 01 2022",

      weight: 216,
      images: ["1425960725259.jpg"],
      bodyfat: 19,
    },
    {
      date: "Nov 02 2022",

      weight: 205,
      images: ["1425960725259.jpg"],
      bodyfat: 18,
    },
    {
      date: "Dec 04 2022",

      weight: 195,
      images: ["1425960725259.jpg"],
      bodyfat: 17,
    },
    {
      date: "Jan 01 2022",

      weight: 188,
      images: ["1425960725259.jpg"],
      bodyfat: 15,
    },
  ];

  return (
    <Grid container spacing={1} sx={{}}>
      <Grid
        item
        xs={12}
        style={styles.h1}
        sx={{ textAlign: "center", minWidth: "100%" }}
      >
        <h1> GETFIT Personal Training </h1>

        <h3>All in one personal training management app</h3>
      </Grid>

      <Grid
        item
        xs={12}
        sm={7}
        sx={{ display: "flex", justifyContent: "center" }}
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

      <Grid item xs={12} sm={5}>
        <AreaChart
        style={styles.chart}
          width={730}
          height={250}
          data={exampleData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="white"/>
          <YAxis stroke="white"/>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="bodyfat"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </Grid>
    </Grid>
  );
};

const styles = {
  h1: {
    padding: "6rem",

    marginBottom: "3rem",
    minWidth: "100vh",
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
    justifyContent: "center",
    alignItems: "center",
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
};

export default HomePage;
