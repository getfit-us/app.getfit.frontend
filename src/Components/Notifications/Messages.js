import {
  Clear,
 
  MessageTwoTone,
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
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { BASE_URL } from "../../assets/BASE_URL";
import { useProfile } from "../../Store/Store";
import { useEffect } from "react";

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

  const [msgSent, setMsgSent] = useState({
    message: "",
    isError: false,
    success: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [userHasMessages, setUserHasMessages] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (selectedUser && messages.length > 0) {
      setUserHasMessages(
        messages?.filter((m) => {
          if (
            m.sender.id === selectedUser?._id ||
            m.receiver.id === selectedUser?._id
          ) {
            return m;
          }
        })?.length > 0
          ? true
          : false
      );
      //update is read to true
      for (const message of messages) {
        if (message.sender.id === selectedUser?._id && !message.is_read) {
          console.log("update notification");
          updateNotification(message);
        }
      }
    }
    const bottom = document.getElementById("endOfMessages");
    if (bottom) {
      bottom.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedUser, messages.length]);

  const handleUserSelect = (event, index) => {
    setSelectedIndex(index);
    //set selected user
    if (trainerState?.firstname) {
      setSelectedUser({ ...trainerState, _id: trainerState.id });
    } else {
      setSelectedUser(clients[index]);
    }
    const bottom = document.getElementById("endOfMessages");
    if (bottom) {
      setTimeout(() => {
        bottom.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 100);
    }
  };

  const handleDeleteMessages = () => {
    for (const message of messages) {
      if (
        message.sender.id === selectedUser._id ||
        message.receiver.id === selectedUser._id
      ) {
        console.log("delete notification");
        deleteNotification(message._id);
      }
    }
  };

  console.log("messages", messages);

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

      setMsgSent((prev) => ({ ...prev, success: true }));

      setTimeout(() => {
        setMsgSent((prev) => ({ ...prev, success: false }));
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
    console.log("update notification");
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
              ) : null
            }
          >
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={(event) => {
                handleUserSelect(event, 0);
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
                    ) : null
                  }
                >
                  <ListItemButton
                    key={client._id}
                    selected={selectedIndex === index}
                    onClick={(event) => {
                      handleUserSelect(event, index);
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
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          padding: 1,
          borderRadius: 5,
          mt: "3rem",
          mb: "3rem",
          width: "100%",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
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
            <Grid item xs={12} sm={6} sx={{ mt: { xs: 1, sm: 0 }, p: 2 }}>
              {userHasMessages && (
                <div className="inbox">
                  <div className="inbox-content">
                    {messages?.map((message, mIndex) => {
                      return (
                        <>
                          <div
                            className={
                              selectedUser._id === message.sender.id
                                ? "msg-sender"
                                : selectedUser._id === message.receiver.id ? "msg-receiver" : null
                            }
                            id={
                              mIndex === messages.length - 1
                                ? "endOfMessages"
                                : ""
                            }
                          >
                            <p>
                              {selectedUser._id === message.sender.id
                                ? message.sender.name + " " + message.createdAt : selectedUser._id === message.receiver.id ? message.createdAt : null}
                              
                            </p>
                            <p>
                              <span>{selectedUser._id === message.sender.id ? message.message : selectedUser._id === message.receiver.id ? message.message : null}</span>
                            </p>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              )}

              <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                <form>
                  <TextField
                    {...register("message", { required: true })}
                    variant="outlined"
                    multiline
                    size="small"
                    label={userHasMessages ? "Reply" : "Send Message"}
                    fullWidth
                    error={errors.message ? true : false}
                    helperText={errors.message ? "Message is required" : ""}
                  />
                </form>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmit(sendMessage)}
                  color={msgSent.success ? "success" : "primary"}
                >
                  {msgSent.success ? "Sent" : "Send"}
                </Button>
                {profile.roles.includes(10) && (
                  <IconButton
                    onClick={handleDeleteMessages}
                    color="warning"
                    sx={{ ml: 1 }}
                  >
                    <Clear />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default Messages;
