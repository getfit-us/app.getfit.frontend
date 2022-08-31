import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { CircularProgress, Grid, Tooltip, Typography, useTheme } from "@mui/material";
import useProfile from "../utils/useProfile";
import { Agriculture, NoEncryption } from "@mui/icons-material";
import StraightenIcon from "@mui/icons-material/Straighten";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GrabData from "./GrabData";

const Overview = () => {
  const { state } = useProfile();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState();

  useEffect(() => { 
  
   
  
    },[loading])


  
  // need to pull all data and update state. 
  //display calendar with workout history and measurements
 
  const measurements = state.measurements.map((measurement) => {
    return {
      title: "Measurement",
      id: measurement._id,
      date: new Date(measurement.date).toISOString().slice(0, 10),
      weight: measurement.weight,
    };
  });
  
state.workouts.map((workout) => {
  measurements.push({
    title: `${workout.type} workout `,
    id: workout._id,
    date: new Date(workout.date).toISOString().slice(0, 10),
  });
});


  const styles = {
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

  console.log(state.measurements)
  return (
 


 
   
    <div
      container
      style={{ marginTop: "3rem", minWidth: "100%", marginBottom: "3rem" }}
    >
       <GrabData loading={loading} setLoading={setLoading} err={err} setError={setError}/>
       {loading &&  <CircularProgress />}
      Overview
      {!loading && <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={measurements}
        eventColor={theme.palette.primary.main}
        eventDisplay="list-item"
        eventContent={(info) => {
          return (
            <>
              <Tooltip title={info.event.title} arrow placement="top">
                <div style={styles.event}>
                  {info.event.title.includes("workout") ? (
                    <FitnessCenterIcon fontSize="small" />
                  ) : (
                    <StraightenIcon fontSize="small" />
                  )}
                </div>
              </Tooltip>
            </>
          );
        }}
      />}
      </div>
  )
};

export default Overview;
