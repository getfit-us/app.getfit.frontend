import { Delete, Mail, Message, SendSharp } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import { set } from "mongoose";
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
  const [viewMessage, setViewMessage] = useState({
    show: false,
    message: "",
    sender: "",
    id: "",
    is_read: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(0);

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

  console.log('notification state', state.notifications);

  //api call
  const sendMessage = async (message) => {
    //set type to message
    message.type = "message";
    //set sender
    message.sender = {};
    message.receiver = {};
    message.sender.id = state.profile.clientId;
    message.sender.name =
      state.profile.firstName + " " + state.profile.lastName;
    //set receiver
    if (state.trainer) message.receiver.id = state.trainer.id; else
    //if user is trainer
    message.receiver.id = state.clients[selectedIndex]._id;
    
 console.log(message, state.trainer);
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
    message.is_read = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/notifications", message, {
        signal: controller.signal,
      });

      dispatch({ type: "UPDATE_NOTIFICATION", payload: response.data });
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  //api call to delete notification
  const deleteNotification = async (id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/notifications/${id}`, {
        signal: controller.signal,
      });

      dispatch({ type: "DELETE_NOTIFICATION", payload: response.data });
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
      <Grid item >
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
                  {state?.trainer?.firstname}
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

  const isTrainer = (
    <>
      <Grid item  xs={12}>
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

  return (
    <>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 5, mt: "3rem",  }}>
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
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 5, display: state.notifications.length > 0 && state.notifications.filter((notification) => notification.receiver.id === state.profile.clientId).length > 0 ? 'block': 'none' }}>
              {/* this need to be a selectedable option like a list, so once its read can do api call to change is_read */}
              {state.notifications && state.notifications.filter((notification) => notification.receiver.id === state.profile.clientId).length > 0 &&
                state.notifications.map((message, index) => {
                  return (
                    <>
                      <List component="nav">
                        <ListItemButton
                          key={message._id}
                          selected={selectedMessage === index}
                          onClick={() => {
                            setSelectedMessage(index);
                            setViewMessage({
                              show: true,
                              message: message.message,
                              sender: message.sender.name,
                              id: message._id,
                              is_read: message.is_read,
                            });
                            // if message is not marked as read, update
                            if (message.is_read === false)
                              updateNotification(message);
                          }}
                        >
                          <Mail />
                          <ListItemText
                            primary={
                              message.is_read ? "Message" : "New Message"
                            }
                          />
                        </ListItemButton>
                      </List>
                    </>
                  );
                })}
            </Paper>
          </Grid>
       
        {viewMessage.show && (
          <Grid item sx={{ position: "relative" }}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 5 }}>
              <h2>From: {viewMessage.sender}</h2>
              <h4>{viewMessage.message}</h4>
              <IconButton
                edge="end"
                aria-label="delete"
                sx={{ position: "absolute", top: 10, right: 20 }}
                onClick={() => {
                  deleteNotification(viewMessage.id);
                  setViewMessage({
                    show: false,
                    message: "",
                    sender: "",
                    id: "",
                    is_read: false,
                  });
                }}
              >
                <Delete />
              </IconButton>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Messages;
