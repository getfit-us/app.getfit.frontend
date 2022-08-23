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
      date: "Mon Aug 01 2021",

      weight: 246,
      images: ["1425960725259.jpg"],
      bodyfat: 23,
    },
    {
      date: "Tues September 01 2021",

      weight: 226,
      images: ["1425960725259.jpg"],
      bodyfat: 21,
    },
    {
      date: "Wed Oct 01 2022",

      weight: 216,
      images: ["1425960725259.jpg"],
      bodyfat: 19,
    },
    {
      date: "Thur Nov 02 2022",

      weight: 205,
      images: ["1425960725259.jpg"],
      bodyfat: 18,
    },
    {
      date: "Tue Dec 04 2022",

      weight: 195,
      images: ["1425960725259.jpg"],
      bodyfat: 17,
    },
    {
      date: "Mon Jan 01 2022",

      weight: 188,
      images: ["1425960725259.jpg"],
      bodyfat: 15,
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} style={styles.h1} sx={{ textAlign: "center" }}>
        <h1> GETFIT Personal Training </h1>
     
        <h3>All in one personal training management app</h3>
      </Grid>

      <Grid
        item
        xs={12}
        sm={4}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Card>
          <CardHeader align="center" title="Track Your Progress"></CardHeader>
          <CardContent>
            <BarChart
              width={400}
              height={300}
              data={exampleData}
              margin={{
                top: 1,
                bottom: 1,
                left: 1,
                right: 15,
              }}
              barSize={30}
              barGap={1}
              barCategoryGap={1}
              // onClick={(e) => console.log(e.target)}
              style={styles.chart}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ opacity: 0.9 }} />
              <Legend />

              <Bar dataKey="bodyfat" fill="#34aad1" />
              <Bar dataKey="weight" fill="#225ed6" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

     
      <Grid item xs={12} sm={5} order={0}>
        <Card>
          <CardHeader align="center" title="Set Goals"></CardHeader>
          <CardContent>
            <p>Your Stats</p>
            <p>5lbs from reaching your goal!</p>
            <FullCalendar 
            
            plugins={[dayGridPlugin]} sx={{mt:3}}/>   
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const styles = {
  h1: {
    padding: '6rem',
   
    marginBottom: "3rem",
    marginLeft: '1rem',
    overflow: false,
    textAlign: "center",
    justifyContent: "center",
    background: '#32a852',
    borderRadius: '0 0 30px 30px'
  },
  chart: {
    border: "2px solid black",
  },
};

export default HomePage;
