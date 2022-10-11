import { Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

const NoWorkouts = () => {
  return (
    <>
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "11px",
          marginTop: '2rem'
          
          
        }}
      >
        <Grid item xs={12} sm={4}>
          <Typography variant="h5" style={styles.title}>
            
            No Workouts Found
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

const styles = {
  title: {
    padding: "10px",
    border: "5px solid grey",
    borderRadius: "20px",
    backgroundColor: "#689ee1",
    color: "white",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
    textAlign: "center",
    
  },
};
export default NoWorkouts;
