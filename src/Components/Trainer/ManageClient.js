//this is going to allow you to select a client and save data under their account. like measurements, workouts,
import {
  Avatar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
} from "@mui/material";
import useProfile from "../../hooks/useProfile";
import { BASE_URL } from "../../assets/BASE_URL";
import { useState } from "react";
import { FitnessCenter, Straighten } from "@mui/icons-material";
import useAxios from "../../hooks/useAxios";
import Measurements from '../Measurements/Measurements'

const ManageClient = () => {
  const { state, dispatch } = useProfile();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedClient, setSelectedClient] = useState({});
  const [show, setShow] = useState({
    measurements: false,
    workouts: false,
  });

  const handleListItemClick = (event, index, id) => {
    setSelectedIndex(index);
    setSelectedClient(id);
  };

  const handleOptionsList = (event, index) => {
    setSelectedOption(index);
    if (index === 0) setShow({ measurements: true, workouts: false });
    if (index === 1) setShow({ measurements: false, workouts: true });
  };

  const controller = new AbortController();

  //get assignedCustomWorkouts on client selected
  const {
    loading,
    error,
    data: assignedWorkouts,
  } = useAxios(
    {
      method: "get",
      url: `/custom-workout/client/assigned/${selectedClient}`,

      signal: controller.signal,
    },
    controller
  );
   //get Measurements on client selected
   const {
    loading: loadingMeasurements,
    error: errorMeasurements,
    data: measurements,
  } = useAxios(
    {
      method: "get",
      url: `/measurements/client/${selectedClient}`,

      signal: controller.signal,
    },
    controller
  );

  //going to create local state for the client that is selected

  console.log(assignedWorkouts, selectedClient, measurements);

  return (
    <Grid
      container
      gap={1}
      className="container-manage-clients"
      sx={{ mt: 10 }}
    >
      <Grid item xs={12} sm={4} className="client-list">
        <Paper elevation={5} sx={{ p: 2, borderRadius: "15px" }}>
          <List
            dense
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              border: "5px solid black",
            }}
            subheader={
              <ListSubheader sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                Clients
              </ListSubheader>
            }
          >
            <Divider />
            {state.clients.map((client, index) => {
              return (
                <>
                  <ListItem key={client._id} disablePadding>
                    <ListItemButton
                      selected={selectedIndex === index}
                      onClick={(event) =>
                        handleListItemClick(event, index, client._id)
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={client.firstname[0]}
                          src={`${BASE_URL}/avatar/${client.avatar}`}
                          sx={{ bgcolor: "black" }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        id={client._id}
                        primary={client.firstname + " " + client.lastname}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              );
            })}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4} className="options-list">
        <Paper sx={{ p: 2, borderRadius: "15px" }}>
          <List
            dense
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              border: "5px solid black",
            }}
            subheader={
              <ListSubheader sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                Options
              </ListSubheader>
            }
          >
            <Divider />

            <ListItem disablePadding>
              <ListItemButton
                selected={selectedOption === 0}
                onClick={(event) => handleOptionsList(event, 0)}
              >
                {" "}
                <ListItemIcon>
                  <Straighten />
                </ListItemIcon>
                <ListItemText primary={"Measurements"} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedOption === 1}
                onClick={(event) => handleOptionsList(event, 1)}
              >
                <ListItemIcon>
                  <FitnessCenter />
                </ListItemIcon>

                <ListItemText primary={"Start Workout"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      </Grid>
      {show.measurements ? (
        <Grid item xs={12} className="measurements">
            <Measurements clientId={selectedClient} measurements={measurements} />



        </Grid>
      ) : show.workout ? (
        <Grid item xs={12} sm={4} className="workouts"></Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default ManageClient;
