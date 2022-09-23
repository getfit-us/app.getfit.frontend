import { Message, SendSharp } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";

const Messages = () => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();
  const [trainer, setTrainer] = useState(state?.trainer);
  const [sent, setSent] = useState({
    message: "",
    isError: false,
    success: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(1);
  const {
    handleSubmit,
    reset,
    register,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const handleListItemClick = (event, index) => {};
  const newMessages = state.notifications.filter(
    (notification) => notification.receiver === state.profile.clientId
  );

  if (newMessages) {
    //if new messages get sender info
  }
  //api call
  const sendMessage = async (message) => {
    //set type to message
    message.type = "message";
    //set sender
    message.sender = state.profile.clientId;
    //set receiver
    if (state.profile.trainer) message.receiver = state.trainer.clientId;
    //if user is trainer
    message.receiver = state.clients[selectedIndex]._id;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/notifications", message, {
        signal: controller.signal,
      });

      dispatch({ type: "ADD_NOTIFICATION", payload: response.data });
      setSent((prev) => ({ ...prev, success: true }));

      setTimeout(() => {
        setSent((prev) => ({ ...prev, success: false }));
      }, 3000);

      reset(); //reset form values
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  //api call to update notification
  const updateNotification = async (message) => {
    //set type to message
    message.type = "message";
    //set sender
    message.sender = state.profile.clientId;
    //set receiver
    if (state.profile.trainer) message.receiver = state.trainer.clientId;
    //if user is trainer
    message.receiver = state.clients[selectedIndex]._id;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/notifications", message, {
        signal: controller.signal,
      });

      dispatch({ type: "ADD_NOTIFICATION", payload: response.data });
      setSent((prev) => ({ ...prev, success: true }));

      setTimeout(() => {
        setSent((prev) => ({ ...prev, success: false }));
      }, 3000);

      reset(); //reset form values
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  const isClient = (
    <>
      <Grid item xs>
        <h3>Create new message</h3>
        <List component="nav">
          <ListItemButton
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <ListItemIcon>
              {state.profile?.trainerId && state?.trainer && (
                <Avatar
                  alt={
                    state?.trainer?.firstname + " " + state?.trainer?.lastname
                  }
                  src={`http://localhost:8000/avatar/${state?.trainer?.avatar}`}
                >
                  {state?.trainer?.firstname[0]?.toUpperCase()}
                </Avatar>
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                state?.trainer?.firstname + " " + state?.trainer?.lastname
              }
            />
          </ListItemButton>
        </List>
        <TextField
          {...register("message", { required: true })}
          name="message"
          label="Message"
          fullWidth
          minRows={3}
          multiline={true}
        />
      </Grid>
      <Grid item xs={12} sx={{ mt: 1 }}>
        <Button variant="contained" endIcon={<SendSharp />}>
          Send
        </Button>
      </Grid>
    </>
  );

  const isTrainer = (
    <>
      <Grid item xs>
        <h3>Create new message </h3>
        <List component="nav">
          <ListItemText primary="Clients" />
          <Divider />
          {state.clients.map((client, index) => {
            return (
              <>
                <ListItemButton
                  key={client._id}
                  selected={selectedIndex === index}
                  onClick={(event) => setSelectedIndex(index)}
                >
                  <ListItemIcon key={client._id}>
                    <Avatar
                      key={client._id}
                      alt={client.firstname + " " + client.lastname}
                      src={`http://localhost:8000/avatar/${client.avatar}`}
                    >
                      {client.firstname[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={client.firstname + " " + client.lastname}
                  />

                  {/* need to loop over client state and add list item for each client */}
                </ListItemButton>
              </>
            );
          })}
        </List>
        <TextField
          {...register("message", { required: true })}
          name="message"
          label="Message"
          fullWidth
          minRows={1}
          multiline={true}
        />
      </Grid>
      <Grid item xs={12}>
        {sent.success ? (
          <Button variant="contained" color="success" endIcon={<SendSharp />}>
            Message Sent
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit(sendMessage)}
            endIcon={<SendSharp />}
          >
            Send
          </Button>
        )}
      </Grid>
    </>
  );

  document.title = "Messages";

  // if notification type is message it will be here
  console.log(newMessages, state.trainer);
  return (
    <>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 5, mt: "3rem" }}>
        <form>
          <Grid
            container
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "start",

              padding: 1,
            }}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "black",
                color: "white",
                borderRadius: 20,
              }}
            >
              <h1>Messages</h1>
            </Grid>
            {state?.trainer?.firstname ? isClient : isTrainer}
          </Grid>
        </form>
      </Paper>
      <Grid container spacing={1} sx={{ mt: 4, ml: 2 }}>
        <Grid item>
            {/* this need to be a selectedable option like a list, so once its read can do api call to change is_read */}
          {newMessages &&
            newMessages.map((message, index) => {
              return (
                <>
                  <Paper elevation={3} sx={{ padding: 3, borderRadius: 5 }}>
                    <Grid item>
                      {" "}
                      <h3>
                        New Message <Message />
                      </h3>
                    </Grid>
                    <Grid item>
                      <h4>
                        {message.sender === state.profile.trainerId
                          ? `${state.trainer.firstname} ${state.trainer.lastname}`
                          : null}{" "}
                      </h4>
                      <h5>{message.message}</h5>
                    </Grid>
                  </Paper>
                </>
              );
            })}
        </Grid>
      </Grid>
    </>
  );
};

export default Messages;
