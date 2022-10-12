//this is going to allow you to select a client and save data under their account. like measurements, workouts,
import {
  Avatar,
  Button,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
} from "@mui/material";
import useProfile from "../../hooks/useProfile";
import { BASE_URL } from "../../assets/BASE_URL";
import { useState } from "react";
import {
  FitnessCenter,
  ManageAccounts,
  Paid,
  Save,
  Straighten,
} from "@mui/icons-material";
import useAxios from "../../hooks/useAxios";
import Measurements from "../Measurements/Measurements";
import StartWorkout from "../Workout/StartWorkout";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ManageClient = () => {
  const { state, dispatch } = useProfile();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedClient, setSelectedClient] = useState();
  const [show, setShow] = useState({
    measurements: false,
    workouts: false,
    options: false,
    account: false,
  });
  const axiosPrivate = useAxiosPrivate();

  const handleClientSelect = (event, index, id) => {
    setSelectedIndex(index);
    setSelectedClient(id);
    setShow({options: true});
    
    
     
    
  };

  const handleOptionsList = (event, index) => {
    setSelectedOption(index);
    if (index === 0)
      setShow((prev) => ({ ...prev, measurements: true, workouts: false }));
    if (index === 1)
      setShow((prev) => ({ ...prev, measurements: false, workouts: true }));
    if (index === 2)
      setShow((prev) => ({
        ...prev,
        measurements: false,
        workouts: false,
        account: true,
      }));
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

  //get client completed workouts
  const {
    loading: loadingCompletedWorkouts,
    error: errorCompletedWorkouts,
    data: completedWorkouts,
  } = useAxios(
    {
      method: "get",
      url: `/completed-workouts/client/${selectedClient}`,

      signal: controller.signal,
    },
    controller
  );
  //going to create local state for the client that is selected
  const onUpdate = async (data) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/users", data, {
        signal: controller.signal,
      });
      console.log(response)
      setShow((prev) => {
        let _show = { ...prev };
        _show.account = false;
        return _show;
      });
      dispatch({type: "UPDATE_CLIENT", payload: response.data});
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  console.log(state.clients, state?.clients[selectedIndex]?.accountBalance);

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
                        handleClientSelect(event, index, client._id)
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
      {show.options && (
        <Grid item xs={12} sm={3} className="options-list">
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
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedOption === 2}
                  onClick={(event) => handleOptionsList(event, 2)}
                >
                  <ListItemIcon>
                    <Paid />
                  </ListItemIcon>

                  <ListItemText primary={"Account Details"} />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      )}
      {show.measurements ? (
        <Grid item xs={12} className="measurements">
          <Measurements clientId={selectedClient} measurements={measurements} />
        </Grid>
      ) : show.workouts ? (
        <Grid item xs={12} className="workouts">
          <StartWorkout
            trainerWorkouts={assignedWorkouts}
            clientId={selectedClient}
            completedWorkouts={completedWorkouts}
          />
        </Grid>
      ) : show.account ? (
        <Grid item xs={12} sm={4} className="account-balance">
          <Paper elevation={4} sx={{ p: 2, borderRadius: "15px" }}>
            <h2>Account Details</h2>
            <p>
              {state?.clients[selectedIndex]?.firstname}{" "}
              {state?.clients[selectedIndex]?.lastname}
            </p>
            <TextField
              
              name="accountBalace"
              label="Current Account Balance"
              id="accountBalance"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              defaultValue={state?.clients[selectedIndex]?.accountBalance}
            />
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                onClick={() => {
               
                  const data= {}
                  data.accountBalance = document.getElementById("accountBalance").value;
                  data._id = selectedClient;
                  onUpdate(data);
                }}
                color="success"
                startIcon={<Save />}
              >
                Save
              </Button>
            </Grid>
          </Paper>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default ManageClient;
