import {
  Autocomplete,
  Avatar,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";
import { DirectionsRun, Menu } from "@mui/icons-material";

import { BarChartSharp, ChatSharp, FitnessCenter } from "@mui/icons-material";
import MeasurementChart from "../Components/Measurements/MeasurementChart";
const HomePageFeatures = ({ measurements, workouts, randomDate }) => {
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
            <div className="ExampleTrainerPage">
              <span>
                <Menu
                  sx={{
                    marginRight: 1,
                    padding: 0,
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Account Type: Trainer
              </span>
              <TextField
                id="outlined-basic"
                label="Search Clients"
                variant="outlined"
                fullWidth
                disabled
                sx={{
                  display: "block",
                  marginTop: 2,
                  marginBottom: 1,
                }}
              />

              <List
                sx={{ maxWidth: 400, display: "flex", flexDirection: "column" }}
                class="exampleTrainerList"
              >
                <ListItem alignItems="center" sx={{ padding: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt="John Smith"
                      src={require("../assets/img/maleAvatar2.jpg")}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="John Smith" sx={{ mr: "1rem" }} />
                  <Autocomplete
                    disablePortal
                    className="exampleTrainerAutoComplete"
                    options={workouts}
                    fullWidth
                    sx={{ mr: "1rem" , maxWidth: 380 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Assign Task" size="small" />
                    )}
                  />
                </ListItem>

                <ListItem alignItems="center" sx={{ margin: 0, padding: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt="Jessica Jones"
                      src={require("../assets/img/womenAvatar.png")}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Jessica Jones" sx={{ mr: "1rem" }} />
                  <Autocomplete
                    className="exampleTrainerAutoComplete"
                    disablePortal
                    options={workouts}
                    sx={{ mr: "1rem", maxWidth: 380  }}
                    fullWidth
                    renderInput={(params) => (
                      <TextField {...params} label="Assign Task" size="small" />
                    )}
                  />
                </ListItem>

                <ListItem alignItems="center" sx={{ margin: 0, padding: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt="Cindy Scott"
                      src={require("../assets/img/WomenAvatar2.png")}
                    />
                  </ListItemAvatar>
                  <ListItemText primary="Cindy Scott" sx={{ mr: "1rem" }} />
                  <Autocomplete
                    className="exampleTrainerAutoComplete"
                    disablePortal
                    options={workouts}
                    fullWidth
                    sx={{ mr: "1rem" , maxWidth: 380 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Assign Task" size="small" />
                    )}
                  />
                </ListItem>
              </List>
            </div>

            <li>
              Assign tasks to clients (i.e. "Complete Chest Workout on Monday ,
              Do 30 minutes of cardio")
            </li>
            <li>
              Receive activity information on new measurements, completed
              workouts, goals, and task completion
            </li>
            <div className="ExampleTrainerPage">
              <span>
                <Menu
                  sx={{
                    marginRight: 1,
                    padding: 0,
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                />{" "}
                Activity Feed
              </span>
              <List>
                <ListItem disablePadding numberOfLines={4}>
                  <ListItemButton>
                    <ListItemAvatar>
                      <Fab
                        size="small"
                        color="primary"
                        sx={{ mr: 1, width: "40px", height: "40px" }}
                      >
                        <FitnessCenter />
                      </Fab>
                    </ListItemAvatar>
                    <ListItemText
                      primary="John Smith completed Chest Workout"
                      secondary={randomDate(
                        new Date(),
                        new Date(2021, 0, 1)
                      ).toLocaleString()}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding numberOfLines={3}>
                  <ListItemButton>
                    <ListItemAvatar>
                      <Fab size="small" color="warning" sx={{ mr: 1 }}>
                        <DirectionsRun />
                      </Fab>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Cindy Scott completed Elliptical"
                      secondary={randomDate(
                        new Date(),
                        new Date(2021, 0, 1)
                      ).toLocaleString()}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding numberOfLines={3}>
                  <ListItemButton>
                    <ListItemAvatar>
                      <Fab size="small" color="primary" sx={{ mr: 1 }}>
                        <FitnessCenter />
                      </Fab>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Jessica Jones completed Leg Workout"
                      secondary={randomDate(
                        new Date(),
                        new Date(2022, 0, 1)
                      ).toLocaleString()}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </div>

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

        <Paper elevation={5} className="tool-card ">
          <h3>
            {" "}
            <Fab color="primary" sx={{ mr: 1 }}>
              <ChatSharp />
            </Fab>
            Messaging
          </h3>{" "}
          <div className="messaging">
            <ul>
              <li>Send messages</li>
              <li>Receive messages</li>
             
              <li>Push Notifications</li>
            </ul>
            <div className="messaging-container">
              <div className=" talk-bubble  tri-right border round btm-left-in receiver">
                <div className="chattext">
                  <span>Jessica</span>
                  <span>{new Date().toLocaleString()}</span>

                  <p>I reached my goal today!</p>
                </div>
              </div>
              <Avatar alt="Jessica Jones" src={require("../assets/img/womenAvatar.png")}
              
             sx={{
              alignSelf: "flex-start",
              width: "60px",
             }}
              />
              <div className="talk-bubble  tri-right border round btm-right-in sender">
                <div className="chattext">
                  <span>Trainer</span>
                  <span>{new Date().toLocaleString()}</span>

                  <p>Great job! Lets get started on the next goal!</p>
                </div>
              </div>
              <Avatar alt="Trainer" src={require("../assets/img/GETFIT-LOGO.png")}
              sx={{
               alignSelf: "flex-end",
               width: "60px",
              }}
              />
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default HomePageFeatures;
