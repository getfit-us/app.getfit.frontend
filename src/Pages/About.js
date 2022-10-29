import { Grid, List } from "@mui/material";

const About = () => {
  return (
    <div  style={styles.container}>
      <h1 style={{ padding: 6, color: "black" }}>GETFIT App</h1>

      <Grid item m={2}>
        <p>
          {" "}
          Created and designed to give my personal training clients a powerful
          tool to{" "}
          <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            GETFIT
          </span>{" "}
          and reach their goals!
        </p>

        <ul>
          <li>Created using react JS</li>
          <li>Backend node express</li>
          <li>Mongodb for database entries</li>
          <li>Implements JSON web tokens for authentication</li>
        </ul>

        <h3>Features</h3>
        <ul>
          <li>
            Trainers can create and assign custom workout routines to their
            clients.
          </li>
          <li>
            Clients can log workouts, record measurements and progress photos
          </li>
          <li>Track progress with exercise history and measurements</li>
          <li>Clients can view past completed workouts</li>
          <li>Modify or create new workouts</li>
          <li>
            Trainers get activity information on new measurements, completed
            workouts, new goals and goals achieved.
          </li>
        </ul>
      </Grid>
    </div>
  );
};

const styles = {
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "3rem",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
};

export default About;
