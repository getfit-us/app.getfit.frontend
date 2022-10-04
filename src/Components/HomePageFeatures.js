import { Grid, Paper } from "@mui/material";
import fitIcon from "../assets/img/fitness-icon.svg";
import ProgIcon from "../assets/img/progress-icon.svg";
import MsgIcon from "../assets/img/msg-icon.svg";
import { useState } from "react";
const HomePageFeatures = () => {
  const [features, setFeatures] = useState({
    training: false,
    message: false,
    progress: false,
  });

  const handleMouseOver = (e) => {
    if (e.target.id === "training") {
      setFeatures((prev) => ({ ...prev, training: true }));
    } else if (e.target.id === "message") {
        setFeatures((prev) => ({ ...prev, message: true }));
    } else if (e.target.id === "progress") {
        setFeatures((prev) => ({ ...prev, progress: true }));
    }
    console.log(features)
  };


 
  const handleMouseOut = (e) => {
    if (e.target.id === "training") {
        setFeatures((prev) => ({ ...prev, training: false }));
    } else if (e.target.id === "message") {
        setFeatures((prev) => ({ ...prev, message: false }));
    } else if (e.target.id === "progress") {
        setFeatures((prev) => ({ ...prev, progress: false }));
    }
    console.log(features)
  };
  const styles = {
    training: {
      padding: "1rem",
      borderRadius: 5,

    },
    message: {
      padding: "1rem",
      borderRadius: 5,

    },
    progress: {
      padding: "1rem",
      borderRadius: 5,

      
    },
    getfit: {
      textDecoration: "underline",
      fontWeight: "bold",
    },
    img: {
      width: "50px",
      height: "50px",
      marginRight: "10px",
    },
    title: {
      fontSize: "1.5rem",
      // padding: 10,
      // backgroundColor: '#3070af',
      // color: 'white', borderRadius: 10,
    },
  };

  return (
    <Grid container spacing={2} sx={{}}>

    {/* grid to display selected content from tools below */}
    <Grid item xs={12}> 
    {features.training && (
        <>
       <p>training</p>
        </>   
    )}

{features.progress && (
        <><p>progress</p>
       
        </>   
    )}

{features.message && (
        <>
       <p>message</p>
        </>   
    )}

    </Grid>

      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <h1>
          All the tools you need to <span style={styles.getfit}>GetFit</span>{" "}
          and reach your goals!
        </h1>
      </Grid>
      <Grid item xs={12} sm={6} md={4}  >
        <Paper
          elevation={5}
          style={styles.training}
          sx={{ "&:hover": { outline: "2px solid #3070af" } }}
           id="training"
        >
          <Grid
            item
            xs={12}
            sx={{
              justifyContent: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={fitIcon} alt="fit icon" style={styles.img} />
            <h3 style={styles.title}>Training</h3>
          </Grid>

          <Grid item xs={12} sx={{ display: { xs: "none", sm: "block" } }}>
            <p>
              Build custom workouts in minutes and assign them to your clients.
            </p>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}  id='progress'>
        <Paper
          elevation={5}
          style={styles.progress}
          sx={{ "&:hover": { outline: "2px solid #3070af" }, }}
         
        >
          <Grid
            item
            xs={12}
            sx={{
              justifyContent: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <img src={ProgIcon} alt="progress icon" style={styles.img} />
            <h3 style={styles.title}>Progress Tracking</h3>
          </Grid>
          <Grid item xs={12} sx={{ display: { xs: "none", sm: "block" } }}>
            {" "}
            <ul>
              <li>Compare progress photos</li>
              <li>Track your lifts</li>
              <li>Set short and long term goals</li>
            </ul>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4} id="message">
        <Paper
          elevation={5}
          style={styles.message}
          sx={{ "&:hover": { outline: "2px solid #3070af" } }}
        >
          <Grid
            item
            xs={12}
            sx={{
              justifyContent: "start",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img src={MsgIcon} alt="msg icon" style={styles.img} />
            <h3 style={styles.title}>Messaging</h3>
          </Grid>
          <Grid item xs={12} sx={{ display: { xs: "none", sm: "block" } }}>
            {" "}
            <p>Communicate directly with your clients. </p>{" "}
            <p>Set Reminders, "Do Cardio" , "Complete the workouts for the week"</p>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default HomePageFeatures;
