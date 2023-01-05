import { Fab, Paper, useTheme } from "@mui/material";

import { BarChartSharp, ChatSharp, FitnessCenter } from "@mui/icons-material";
import MeasurementChart from "../Components/Measurements/MeasurementChart";
const HomePageFeatures = ({ measurements }) => {
  measurements = measurements.filter(
    (measurement) => measurement.title === "Measurement"
  );

  const theme = useTheme();

  return (
    <div className="homePageFeatures" id="learnMore">
      {/* grid to display selected content from tools below */}

      <h1>
        All the tools you need to <span>GetFit</span> and reach your goals!
      </h1>

      <div className="tools">
        <Paper elevation={5} className="tool-card training">
          <h3>
            {" "}
            <Fab sx={{ mr: 1 }} color="primary">
              <FitnessCenter />
            </Fab>
            Training
          </h3>

         

          <ul>
            <li>Create and assign custom workout routines to clients</li>

            <li>
              Assign tasks to clients (i.e. "Complete Chest Workout on Monday ,
              Do 30 minutes of cardio")
            </li>
            <li>
              Receive activity information on new measurements, completed
              workouts, goals, and task completion
            </li>
            <li>
              Monitor client progress and make adjustments to workouts and
              cardio routines
            </li>
          </ul>

          
        </Paper>

        <Paper elevation={5} className="tool-card">
          {" "}
          <h3>
            {" "}
            <Fab sx={{ mr: 1 }} color="primary">
              <BarChartSharp size="large" />
            </Fab>
            Progress Tracking
          </h3>{" "}
          <img src={require("../assets/img/Before-after.png")} alt="" />

          <ul>
            <li>Compare progress photos side by side</li>
            <li>Track your lifts</li>
           
            <li>Compare your exercise history</li>
            <li>Track Measurements</li>
          </ul>
          <div className="measurement-container">
            <MeasurementChart measurements={measurements} />
          </div>
        </Paper>

        <Paper elevation={5} className="tool-card">
          <h3>
            {" "}
            <Fab color="primary" sx={{ mr: 1 }}>
              <ChatSharp />
            </Fab>
            Messaging
          </h3>{" "}
    
          <ul>
            <li>Send messages to clients</li>
            <li>Receive messages from clients</li>
            <li>Complete Cardio</li>
            <li>Complete Leg Workout</li>
            <li>Push Notifications</li>
          </ul>
        </Paper>
      </div>
    </div>
  );
};

export default HomePageFeatures;
