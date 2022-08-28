import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Grid } from "@mui/material";
import useProfile from "../utils/useProfile";

const Overview = () => {
  const { state } = useProfile();
  //display calendar with workout history and measurements

  const measurements = state.measurements.map((measurement) => {
    return {
      title: "Measurement",
      id: measurement._id,
      date: new Date(measurement.date).toISOString().slice(0, 10),
    };
  });

 state.workouts.map(workout => {
    measurements.push({
        title: `${workout.type} workout `,
        id: workout._id,
        date: new Date(workout.date).toISOString().slice(0, 10)
    })
 })

  return (
    
      <div container style={{ marginTop: "3rem", minHeight: "100vh" }}>
        Overview
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={measurements}
          minHeight='auto'
        />
      </div>
   
  );
};

export default Overview;
