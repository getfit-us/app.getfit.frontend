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
import { useEffect, useState, useRef } from "react";
import {
  FitnessCenter,
  History,
  ManageAccounts,
  Paid,
  Save,
  Straighten,
} from "@mui/icons-material";
import Measurements from "../Measurements/Measurements";
import StartWorkout from "../Workout/StartWorkout";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ViewWorkOuts from "../Workout/ViewWorkouts";
const ManageClient = () => {
  const { state, dispatch } = useProfile();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientData, setClientData] = useState({
    assignedWorkouts: null,
    completedWorkouts: null,
    measurements: null,
  });

  const scroll = useRef(null);

  const [show, setShow] = useState({
    measurements: false,
    workouts: false,
    options: false,
    account: false,
    viewworkout: false,
  });
  const axiosPrivate = useAxiosPrivate();

  const handleClientSelect = (event, index, id) => {
    setSelectedIndex(index);
    setSelectedClient(id);
    setShow((prev) => ({
      measurements: false,
      workouts: false,

      account: false,
      viewworkout: false,
      options: true,
    }));
  };

  const handleOptionsList = (event, index) => {
    setSelectedOption(index);
    if (index === 0) {
      setShow((prev) => ({ ...prev, measurements: true, workouts: false }));
      scroll.current.scrollIntoView();    }

    if (index === 1) {
      setShow((prev) => ({ ...prev, measurements: false, workouts: true }));
      scroll.current.scrollIntoView();
        }

    if (index === 2)
      setShow((prev) => ({
        ...prev,
        measurements: false,
        workouts: false,
        account: true,
      }));
    if (index === 3) {
      setShow((prev) => ({
        ...prev,
        measurements: false,
        workouts: false,
        account: false,
        viewworkout: true,
      }));
      scroll.current.scrollIntoView();
    }
  };

  useEffect(() => {
    // use effect grab user api calls when selecting a new client
    const getAssignedCustomWorkouts = async () => {
      let isMounted = true;
      //add logged in user id to data and workout name
      //   values.id = state.profile.clientId;

      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/custom-workout/client/assigned/${selectedClient}`,
          {
            signal: controller.signal,
          }
        );
        setClientData((prev) => ({ ...prev, assignedWorkouts: response.data }));

        // reset();
      } catch (err) {
        console.log(err);

        if (err.response.status === 409) {
          //     setSaveError((prev) => !prev);
          //     setTimeout(() => setSaveError((prev) => !prev), 5000);
          //   }
        }
        return () => {
          isMounted = false;

          controller.abort();
        };
      }
    };

    const getMeasurements = async (id) => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/measurements/client/${selectedClient}`,
          {
            signal: controller.signal,
          }
        );

        setClientData((prev) => ({ ...prev, measurements: response.data }));
      } catch (err) {
        console.log(err);
      }
      return () => {
        controller.abort();
      };
    };
    const getCompletedWorkouts = async (id) => {
      const controller = new AbortController();
      try {
        const response = await axiosPrivate.get(
          `/completed-workouts/client/${selectedClient}`,
          {
            signal: controller.signal,
          }
        );
        setClientData((prev) => ({
          ...prev,
          completedWorkouts: response.data,
        }));

        // console.log(state.workouts)
      } catch (err) {
        console.log(err);
      }
      return () => {
        controller.abort();
      };
    };

    getMeasurements();
    getAssignedCustomWorkouts();
    getCompletedWorkouts();
  }, [selectedClient]);

  //going to create local state for the client that is selected
  const onUpdate = async (data) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/users", data, {
        signal: controller.signal,
      });
      console.log(response);
      setShow((prev) => {
        let _show = { ...prev };
        _show.account = false;
        return _show;
      });
      dispatch({ type: "UPDATE_CLIENT", payload: response.data });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

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
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedOption === 3}
                  onClick={(event) => handleOptionsList(event, 3)}
                >
                  <ListItemIcon>
                    <History />
                  </ListItemIcon>

                  <ListItemText primary={"View Workouts"} />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      )}
      <Grid item xs={12} className="measurements" >
        {show.measurements ? (
          <Measurements
            clientId={selectedClient}
            measurements={clientData.measurements}
          />
        ) : show.workouts ? (
          <StartWorkout
            trainerWorkouts={clientData}
            clientId={selectedClient}
            
          />
        ) : show.account ? (
          <Grid item xs={12} sm={4} className="account-balance">
            <Paper elevation={4} sx={{ p: 2, borderRadius: "15px" }}>
              <h2>Account Details</h2>
              <p>
                {state?.clients[selectedIndex]?.firstname}{" "}
                {state?.clients[selectedIndex]?.lastname}
              </p>
              <p>
                Last Updated:{" "}
                {state?.clients[selectedIndex]?.accountDetails?.date}
              </p>
              <p>Last Login: {state?.clients[selectedIndex]?.lastLogin}</p>
              <TextField
                name="accountBalace"
                label="Current Account Balance"
                id="accountBalance"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                defaultValue={
                  state?.clients[selectedIndex]?.accountDetails?.credit
                }
                sx={{ ml: 1, mr: 1, mt: 1, mb: 1 }}
              />
              <TextField
                name="sessionRate"
                label="Session Rate"
                id="sessionRate"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                defaultValue={
                  state?.clients[selectedIndex]?.accountDetails?.rate
                }
                sx={{ ml: 1, mr: 1, mt: 1, mb: 1 }}
              />
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    const data = {};
                    data.accountBalance =
                      document.getElementById("accountBalance").value;
                    data.sessionRate =
                      document.getElementById("sessionRate").value;
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
        ) : show.viewworkout ? (
          <ViewWorkOuts // need to fix
            assignedWorkouts={clientData.assignedWorkouts}
            clientId={selectedClient}
            completedWorkouts={clientData.completedWorkouts}
          />
        ) : null}
        <div ref={scroll} style={{mt: '1rem'}}> </div>
      </Grid>
    </Grid>
  );
};

export default ManageClient;
