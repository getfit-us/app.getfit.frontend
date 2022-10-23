import {
  CheckBox,
  Close,
  Delete,
  Mail,
  Message,
  SendSharp,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Checkbox,
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
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProfile from "../../hooks/useProfile";

import { BASE_URL } from "../../assets/BASE_URL";

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
  let messages = [];
  //get relevant messages from state
  if (state.notifications && state.notifications.length > 0) {
    messages = state.notifications.filter((notification) => {
      if (
        notification.receiver.id === state.profile.clientId &&
        notification.type === "message"
      ) {
        return true;
      }
      return false;
    });
  }

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
    if (state.trainer) {
      message.receiver.id = state.trainer.id;
    }
    if (!state.profile.trainerId)
      message.receiver.id = state.clients[selectedIndex]._id; //if user is trainer

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/notifications", message, {
        signal: controller.signal,
      });
      console.log(response.data);

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
      <Grid item xs={12}>
        <form>
          <List component="nav" className="msg-clientlist">
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
                    src={`${BASE_URL}/avatar/${state?.trainer?.avatar}`}
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
            className="msg-field"
            minRows={3}
            multiline={true}
            sx={{ mt: 3, mb: 2 }}
          />
        </form>
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
      <Grid item xs={12}>
        <form>
          <List component="nav" className="msg-clientlist">
            <ListItemText
              primary="CLIENTS"
              sx={{
                textAlign: "center",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            />
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
                        src={`${BASE_URL}/avatar/${client.avatar}`}
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
            minRows={1}
            multiline={true}
            className="msg-field"
            sx={{ mt: 3, mb: 2 }}
          />
        </form>
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
      <Paper
        elevation={3}
        sx={{ padding: 3, borderRadius: 5, mt: "3rem", mb: "3rem" }}
        className="container"
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "start",
          }}
        >
          <Grid item xs={12}>
            <h1 className="page-title">Messages</h1>
          </Grid>
          <Grid item xs={12} sm={5}>
            {" "}
            {state?.trainer?.firstname ? isClient : isTrainer}
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ mb: 3, mt: { xs: 1, sm: 0 } }}
            className="inbox"
          >
            <h3> Inbox</h3>
            {/* this need to be a selectedable option like a list, so once its read can do api call to change is_read */}
            {messages &&
              messages.map((message, index) => {
                return (
                  <>
                    <Divider />
                    <List
                      component={Stack}
                      direction="row"
                      sx={{
                        padding: 0,
                        borderRadius: 5,
                        display: messages?.length > 0 ? "block" : "none",
                      }}
                      className="messages-list"
                    >
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
                            message.is_read ? " Message" : " New Message"
                          }
                          secondary={`From: ${message.sender.name}`}
                          sx={{ ml: 1 }}
                          className="messages-list-item"
                        />
                      </ListItemButton>
                      <Divider />
                    </List>
                  </>
                );
              })}
          </Grid>
         
          {viewMessage.show && (
        <Grid
          item
          xs={12}
          className="view-message"
          sx={{
            position: "relative",
            mt: { xs: 1, sm: 1 },
          
            p: 1,
            border: '#e0e0e0 5px solid',
            borderRadius: '20px'
          }}
        >
                  

          <h2>From: {viewMessage.sender}</h2>
          <Divider />
          <h4>Message: {viewMessage.message}</h4>
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
          <IconButton
            edge="end"
            aria-label="close"
            sx={{ position: "absolute", top: 10, right: 50 }}
            onClick={() => {
              setViewMessage({
                show: false,
                message: "",
                sender: "",
                id: "",
                is_read: false,
              });
            }}
          >
            <Close />
          </IconButton>
        </Grid>
    )}
        </Grid>
      </Paper>

     
    </>
  );
};

export default Messages;
