import { Grid, Paper } from "@mui/material";
import useProfile from "../../hooks/useProfile";

const Goals = () => {
    const { state, dispatch } = useProfile();


     // ----get all the user activity from notification state --- sort only activity from notification state
  let userGoals = state.notifications.filter((notification) => {
    if (notification.type === "goal") {
      return true;
    }
  });

  userGoals = userGoals.sort(function (a, b) {
    if (a.createdAt > b.createdAt) return -1;
  });

  return (
<Paper
      sx={{
        padding: 2,
        marginBottom: 3,
        minWidth:'100%',
        width: { xs: "100%", sm: "50%", lg: "50%" },

      }}
    >      <form>
        <Grid
          container
          spacing={1}
          style={styles.container}
          sx={{
            display: "flex",
            justifyContent: "start",

            padding: 1,
            
          }}
        >
             <Grid item xs={12}>
          <h3 style={styles.header}>Goals</h3>
        </Grid>





        </Grid>
      </form>
    </Paper>
  );
};

const styles = {
    container: {
      display: "flex",
      justifyContent: "start",
      marginBottom: 3,
      spacing: 1,
      gap: 1,
      overflow: "hidden",
      // height: 400,
      // overflowY: "scroll",
      scrollBehavior: "smooth",
      width: "100%",
    },
    header: {
      padding: "10px",
      borderRadius: 10,
      textAlign: "center",
      backgroundColor: "#3070af",
      color: "white",
    },
    message: {},
  };
  

export default Goals;
