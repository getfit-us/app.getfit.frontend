import { Clear, MessageTwoTone } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CircularProgress,
  Divider,
  Grid,
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
import { getSWR } from "../../Api/services";

const Messages = () => {
  const axiosPrivate = useAxiosPrivate();
  const trainerState = useProfile((state) => state.trainer);

  const setMessages = useProfile((state) => state.setMessages);

  const addMessage = useProfile((state) => state.addMessage);
  const updateNotificationState = useProfile(
    (state) => state.updateNotification
  );
  const deleteNotificationState = useProfile(
    (state) => state.deleteNotification
  );
  const profile = useProfile((state) => state.profile);
  const clients = useProfile((state) => state.clients);

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

  const { data: messages, isLoading: loadingMessages } = useSWR(
    `/notifications/messages/${profile.clientId}`,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (data) => setMessages(data),
    }
  );

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
    const chat = document.getElementsByClassName("inbox-content");

    if (chat) {
      // bottom.scrollIntoView({ block: "nearest", behavior: "smooth" });
      chat[0]?.scrollTo(0, chat[0].scrollHeight);
    }
  }, [selectedUser, messages.length, messages]);

  const handleUserSelect = (event, index) => {
    setSelectedIndex(index);
    //set selected user
    if (trainerState?.firstname) {
      setSelectedUser({ ...trainerState, _id: trainerState.id });
    } else {
      setSelectedUser(clients[index]);
    }
    const chat = document.getElementsByClassName("inbox-content");

    if (chat) {
      setTimeout(() => {
        chat[0]?.scrollTo(0, chat[0]?.scrollHeight);
      }, 200);
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

      addMessage(response.data);

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
          {loadingMessages && messages?.length === 0 ? (
            <CircularProgress />
          ) : (
            <Grid item xs={12} sm={5}>
              {" "}
              {trainerState?.firstname ? isClient : isTrainer}
            </Grid>
          )}

          {selectedUser && (
            <Grid item xs={12} sm={6} sx={{ mt: { xs: 1, sm: 0 }, p: 0 }}>
              {userHasMessages && (
                <div className="inbox">
                  <div className="inbox-content">
                    {messages?.map((message, mIndex) => {
                      return (
                        <>
                          <div
                            className={
                              selectedUser._id === message.sender.id
                                ? " talk-bubble  tri-right border round btm-left-in receiver"
                                : selectedUser._id === message.receiver.id
                                ? "talk-bubble  tri-right border round btm-right-in sender"
                                : null
                            }
                          >
                            <div className="chattext">
                              <span>
                                {selectedUser._id === message.sender.id
                                  ? selectedUser.firstname
                                  : message.sender.id === profile.clientId
                                  ? "Reply"
                                  : null}
                              </span>
                              <span>
                                {selectedUser._id === message.sender.id
                                  ? message.createdAt
                                  : selectedUser._id === message.receiver.id
                                  ? message.createdAt
                                  : null}
                              </span>

                              <p>
                                {selectedUser._id === message.sender.id
                                  ? message.message
                                  : selectedUser._id === message.receiver.id
                                  ? message.message
                                  : null}
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })}
                    <span style={{ marginTop: "1rem" }}></span>
                  </div>
                </div>
              )}

              <form>
                <TextField
                  {...register("message", { required: true })}
                  variant="outlined"
                  multiline
                  size="small"
                  label={userHasMessages ? "Reply" : "Send Message"}
                  error={errors.message ? true : false}
                  helperText={errors.message ? "Message is required" : ""}
                  fullWidth
                  sx={{ mb: 1, mt: 1, mr: 1 }}
                />
              </form>

              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit(sendMessage)}
                color={msgSent.success ? "success" : "primary"}
                sx={{ mb: 2 }}
              >
                {msgSent.success ? "Sent" : "Send"}
              </Button>
              {isAdmin && (
                <Button
                  onClick={handleDeleteMessages}
                  color="warning"
                  sx={{ ml: 1, mb: 2 }}
                  size="small"
                  variant="contained"
                >
                  Clear Messages
                </Button>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default Messages;
