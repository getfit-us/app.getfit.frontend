import { Grid, List } from "@mui/material";

const About = () => {
  return (
    <div style={styles.container}>
      <h1 style={{ padding: 6, color: "black" }}>GETFIT Personal Training App</h1>

      <Grid item m={2}>
        <p>
          {" "}
          Created and designed to give personal training clients a powerful
          tool to{" "}
          <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            GETFIT
          </span>{" "}
          and reach their goals!
        </p>
        <p>
        Personal training is the best way to reach personal fitness goals. Depending on each individual’s needs, personal trainers can provide bespoke sessions and advice, tailored to their client's lifestyle and personal journey. By providing personal training clients with their own personal toolkit, personal trainers can ensure that even after every session has finished, there is a clear path towards achieving personal goals that are set in collaboration between trainer and client. This can include anything from dietary guidelines through to exercise tips and tricks that can be added to a day-to-day routine. With the right personal toolkit at their disposal, personal training clients have everything they need to achieve their desired results. 
        </p>
        <p>
        Our personal trainers are committed to helping their clients reach their goals, and our custom app is designed to make that process as simple as possible. The app allows trainers to easily monitor their clients' progress and adjust workouts accordingly, creating a personal training experience tailored specifically for each individual. With features like real-time feedback, personal workout plans, and detailed reporting data, personal trainers can ensure their clients are empowered with the encouragement and motivation needed to make lasting lifestyle changes.
        </p>

   

        <h2 style={{
          padding: 6,
          textDecoration: "underline",
          
        }}>Features</h2>
        <ul>
          <li>Trainers:</li>
          <ul>  <li>
           Create and assign custom workout routines to their
            clients.
          </li>
          <li>
           Monitor client progress and make adjustments to workouts and cardio routines.
          </li>
          <li>
            Receive activity information on new measurements, completed
            workouts, new goals and goals achieved.
          </li>
          <li>
            Assign tasks to clients (i.e. "Complete Leg Workout on Monday or Do 30 minutes of cardio")

          </li>
          </ul>
          <li>Clients:</li>
          <ul>

        
          <li>
            Log workouts, record measurements and progress photos
          </li>
          <li>Track progress with exercise history and measurements</li>
          <li>View past completed workouts</li>
          <li>Modify or create new workouts</li>
         
          
          <li>
            Workouts can be edited on the fly while completing them.
          </li>
          <li>Exercises can be added or removed. </li>

          <li>Group exercises into Super Sets or Giant Sets</li>
          <li>Change the order fo the exercises while completing the workout.</li>
          </ul>
        </ul>


        <p style={{
          padding: 6,
          fontWeight: "bold",
        }}>
        We are thrilled to announce the upcoming mobile app version that we will be launching soon! With all the latest features, our mobile app will provide an improved interface that is both intuitive and reliable. This mobile application is designed to make your mobile experience easier, faster and more enjoyable. We hope this new version can be a great addition to the mobile world and enhance your mobile lifestyle. Stay tuned for updates about the official release date for our mobile app!
          
        </p>

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
