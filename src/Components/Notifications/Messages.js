import {
  Close,
  Delete,
  Mail,
  MessageTwoTone,
  SendSharp,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { BASE_URL } from "../../assets/BASE_URL";
import { useProfile } from "../../Store/Store";

const Messages = () => {
  const axiosPrivate = useAxiosPrivate();
  const trainerState = useProfile((state) => state.trainer);
  const addNotification = useProfile((state) => state.addNotification);
  const updateNotificationState = useProfile(
    (state) => state.updateNotification
  );
  const deleteNotificationState = useProfile(
    (state) => state.deleteNotification
  );
  const messages = useProfile((state) => state.messages);
  const profile = useProfile((state) => state.profile);
  const clients = useProfile((state) => state.clients);
  const notifications = useProfile((state) => state.notifications);
  const xs = useMediaQuery((theme) => theme.breakpoints.down("sm"));

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
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const handleUserClick = (event, index) => {
    setSelectedIndex(index);
    for (const message of messages) {
      if (
        message.sender.id === selectedUser._id &&
        !message.is_read
      ) {
        console.log('update notification')
        updateNotification(message);
      }
    }

  };

  //api call
  const sendMessage = async (message) => {
    //set type to message
    message.type = "message";

    //set sender
    message.sender = {};
    message.receiver = {};
    message.sender.id = profile.clientId;
    message.sender.name = profile.firstName + " " + profile.lastName;
    //set receiver
    if (trainerState?.firstname) {
      message.receiver.id = trainerState.id;
    }
    if (!profile.trainerId) message.receiver.id = clients[selectedIndex]._id; //if user is trainer
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/notifications", message, {
        signal: controller.signal,
      });

      addNotification(response.data);
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
    console.log('update notification')
    message.is_read = true;

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.put("/notifications", message, {
        signal: controller.signal,
      });

      updateNotificationState(response.data);
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
      deleteNotificationState(response.data);
    } catch (err) {
      console.log(err);
      //   setError(err.message);
    }
    return () => {
      controller.abort();
    };
  };

  console.log(messages);

  const isClient = (
    <>
      <Grid item xs={12}>
        <List component="nav" className="msg-clientlist">
          <ListItem
            secondaryAction={
              messages.filter(
                (message) => message.sender.id === trainerState.id
              ).length > 0 ? (
                <MessageTwoTone />
              ) : (
                ""
              )
            }
          >
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={(event) => {
                setSelectedUser({...trainerState,
                  _id: trainerState.id
                  });

                handleUserClick(event, 0);
               
              }}
            >
              <ListItemIcon>
                {profile?.trainerId && trainerState && (
                  <Avatar
                    alt={trainerState?.firstname + " " + trainerState?.lastname}
                    src={`${BASE_URL}/avatar/${trainerState?.avatar}`}
                  >
                    {trainerState?.firstname}
                  </Avatar>
                )}
              </ListItemIcon>
              <ListItemText
                primary={trainerState?.firstname + " " + trainerState?.lastname}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>
    </>
  );

  const isTrainer = (
    <>
      <Grid item xs={12}>
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

          {clients.map((client, index) => {
            return (
              <>
                <ListItem
                  key={client._id}
                  secondaryAction={
                    messages.filter(
                      (message) => message.sender.id === client._id
                    ).length > 0 ? (
                      <MessageTwoTone />
                    ) : (
                      ""
                    )
                  }
                >
                  <ListItemButton
                    key={client._id}
                    selected={selectedIndex === index}
                    onClick={(event) => {
                      setSelectedUser(client);
                      setSelectedIndex(index);
                      for (const message of messages) {
                        if (
                          message.sender.id === client._id &&
                          !message.is_read
                        ) {
                          updateNotification(message);
                        }
                      }
                    }}
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
                </ListItem>
              </>
            );
          })}
        </List>
      </Grid>
    </>
  );

  document.title = "Messages";

  // if notification type is message it will be here
          console.log(xs)
  return (
    <>
      <Paper
        elevation={3}
        sx={{ padding: 1, borderRadius: 5, mt: "3rem", mb: "3rem", width: "100%",  }}
        
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: 'space-between',
          }}
        >
          <Grid item xs={12}>
            <h1 className="page-title">Messages</h1>
          </Grid>
          <Grid item xs={12} sm={5}>
            {" "}
            {trainerState?.firstname ? isClient : isTrainer}
          </Grid>

          {selectedUser && (
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ mb: 3, mt: { xs: 1, sm: 0 }, p: 2 }}
              className="inbox"
            >
              {messages?.map((message) => {
                return  selectedUser?._id === message.sender.id ? (
                  <div className="msg-sender">
                    <p>
                      {message.message}{" "}
                      {message.createdAt}
                    </p>
                  </div>
                ) : (
                  <div className="msg-receiver">
                    <p>{message.message} {message.createdAt}</p>

                    
                  </div>
                );
              })}
               <form>
           
           {selectedUser && (
              <div className="msg-input">
               <TextField
                 variant="outlined"
                 multiline
                 size="small"
                 label="Message"
                 fullWidth
               />
               <Button variant="contained" sx={{ml:1}}>Send</Button>
             </div>
           )}
      
       </form>
            </Grid>
          )}
         

          {/* going to display a chat box with messages from sender and receiver  */}
          {viewMessage.show && (
            <Grid
              item
              xs={12}
              className="view-message"
              sx={{
                position: "relative",
                mt: { xs: 1, sm: 1 },

                p: 1,
                border: "#e0e0e0 5px solid",
                borderRadius: "20px",
              }}
            >
              p.
              <p>{viewMessage.sender}</p>
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
