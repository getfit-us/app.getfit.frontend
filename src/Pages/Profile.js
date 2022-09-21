import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Rating,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useProfile from "../hooks/useProfile";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Edit, Star, Phone } from "@mui/icons-material";
import MeasurementChart from "../Components/Measurements/MeasurementChart";
import { useDropzone } from "react-dropzone";
import TabView from "../Components/Profile/TabView";

const Profile = ({ theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useProfile();
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const date = new Date(state.profile.startDate).toDateString();
  const smDN = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

 

 

  const updateProfileImage = async (e, data) => {
    e.preventDefault();

    const formData = new FormData();
    if (acceptedFiles) {
      acceptedFiles.map((file) => formData.append(file.name, file));
    }

    let isMounted = true;
    //add client id to req so the image can be tagged to client.
    formData.append("id", state.profile.clientId);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/upload", formData, {
        signal: controller.signal,
      });

      setShowUpload((prev) => !prev);
      setFiles();
      dispatch({
        type: "UPDATE_PROFILE_IMAGE",
        payload: response.data.message,
      });
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };




  return (
    <Grid
      container
      spacing={1}
      sx={{
        
        width: "100%",
        pb: 2,
      }}
    >
   
      
      <Grid item xs={12} sm={7}>
        <Card style={styles.card}>
          <Typography variant="h5" m={3}>
            Profile
           
          </Typography>

          <CardHeader
            style={styles.heading}
            avatar={
              <Avatar
                src={`http://localhost:8000/avatar/${state.profile.avatar}`}
                style={styles.avatar}
              >
                {state.profile.firstName &&
                  state.profile.firstName[0].toUpperCase()}
              </Avatar>
            }
            title={
              state.profile.firstName
                ? state.profile.firstName + " " + state.profile.lastName
                : " "
            }
            subheader={
              <>
                <span style={styles.nowrap}>Joined: {date} </span>
                <span style={{align: 'start'}}>
                  <p>
                  Account Type:
                  {state.profile.roles.includes(2)
                    ? `Client`
                    : state.profile.roles.includes(5)
                    ? "Trainer"
                    : "Admin"}</p>
                </span>
              </>
            }
          />
          <Divider />

          {!showUpload && (
            <CardMedia
              component="img"
              height="400"
              image={`http://localhost:8000/avatar/${state.profile.avatar}`}
              alt="Profile image"
              onError={() => setShowUpload((prev) => !prev)}
            />
          )}

          {showUpload && (
            <>
              <Grid
                item
                xs={12}
                sx={{ mt: 3, p: 3, border: 2, justifyItems: "center" }}
                {...getRootProps({ className: "dropzone" })}
                id="dropzone"
              >
                <TextField {...getInputProps()} name="files" id="files" />
                <p style={styles.p}>Drag 'n' drop Profile Picture here</p>
                <p style={styles.p}></p>

                <Grid style={styles.thumbsContainer}>
                  {files &&
                    files.map((file) => (
                      <Grid style={styles.thumb} key={file.name}>
                        <Grid style={styles.thumbInner}>
                          <img
                            src={file.preview}
                            style={styles.img}
                            alt="File Preview"
                            // Revoke data uri after image is loaded
                            onLoad={() => {
                              URL.revokeObjectURL(file.preview);
                            }}
                          />
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </>
          )}
          <CardContent style={styles.statLabel}>
            {showUpload && (
              <>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    onClick={updateProfileImage}
                    size="small"
                    variant="contained"
                    sx={{ mr: 1 }}
                  >
                    Upload
                  </Button>

                  <Button
                    type="button"
                    size="small"
                    color="warning"
                    variant="contained"
                    onClick={() => setShowUpload(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </>
            )}

            <p>{state.profile.age && `Age: ${state.profile.age}`}</p>
            {/* <p> {state.profile.phone ? <Phone/>: ${state.profile.phone} : <Phone/>: }</p> */}
            <p>{state.profile.email && `email: ${state.profile.email}`}</p>
            <p>
              {state.profile.trainerId &&
                `Trainer: ${state.trainer.firstname} ${state.trainer.lastname}`}
            </p>

            <Typography sx={{ m: 1 }}>
              {!showUpload && (
                <Button
                  variant="contained"
                  onClick={() => setShowUpload((prev) => !prev)}
                >
                  Upload Profile Image
                </Button>
              )}
            </Typography>
           
          </CardContent>
        </Card>
      </Grid>

      <Grid item sm={5} sx={{ display: "flex", justifyContent: "space-evenly" }}>
    
                <Paper>
        <List sx={{ textAlign: "center" }}>
          <ListItem>
            Last Workout:{" "}
            {state.customWorkouts[0]
              ? state.customWorkouts[0].date
              : ""}
          </ListItem>
          <ListItem>
            {state.customWorkouts[0] && (
              <Rating
                name="hover-feedback"
                value={state.customWorkouts[0].rating}
                precision={0.5}
                getLabelText={getLabelText}
                readOnly
                emptyIcon={
                  <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
            )}
            {state.customWorkouts[0] && (
              <Box sx={{ ml: 2 }}>{labels[state.customWorkouts[0].rating]}</Box>
            )}
          </ListItem>
          <ListItem>
            Name:{" "}
            {state.customWorkouts[0] ? state.customWorkouts[0].name.toUpperCase() : ""}
           
          </ListItem>
          <ListItem>
            Current Body Weight:{" "}
            {state.measurements[0] && state.measurements[0].weight}
          </ListItem>
          <ListItem>
            Previous Weight:{" "}
            {state.measurements[1] && state.measurements[1].weight}
          </ListItem>
          <ListItem>
            Starting Weight:{" "}
            {state.measurements[1] &&
              state.measurements[state.measurements.length - 1].weight}
          </ListItem>
        </List>
        </Paper>
      </Grid>
      <Grid
        item
        sx={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Card style={styles.card}>
          {state.measurements[0] && <MeasurementChart width={smDN ? 300 : 500} barSize={smDN ? 5 : 10} />}
        </Card>
      </Grid>
      
    </Grid>
  );
};

const styles = {
  card: {
    borderRadius: 20,
   
    textAlign: "center",
    raised: true,
    backgroundColor: "#e7e6eb",
  },
  avatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginTop: 8,
    marginBottom: 0,
  },

  statLabel: {
    fontSize: 16,
 
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0,
  },
  thumbsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },

  thumb: {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
  },

  thumbInner: {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  },

  img: {
    display: "block",
    width: "auto",
    height: "100%",
  },
  nowrap: {
    whiteSpace: "nowrap",
  },
};

export default Profile;
