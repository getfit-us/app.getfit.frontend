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
        
         
            
  <h2>Nothing Found</h2>            
       
      </Grid>
    </>
  );
};

const styles = {
  title: {
    padding: "10px",
  
   
    textAlign: "center",
    
  },
};
export default NoWorkouts;
