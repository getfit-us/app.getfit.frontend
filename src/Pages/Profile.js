import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Rating,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useProfile from "../hooks/useProfile";
import { useRef, useState } from "react";
import { Star } from "@mui/icons-material";
import { BASE_URL } from "../assets/BASE_URL";

const Profile = ({ theme }) => {
  const { state, dispatch } = useProfile();
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState();
  const hiddenFileInput = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  const date = new Date(state.profile.startDate).toDateString();
  const smDN = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
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

  const handlePickImage = () => {
    hiddenFileInput.current.click();
  };

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };

  const updateProfileImage = async (e, data) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(file.name, file);

    let isMounted = true;
    //add client id to req so the image can be tagged to client.
    formData.append("id", state.profile.clientId);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/upload", formData, {
        signal: controller.signal,
      });

      setShowUpload((prev) => !prev);
      setFile();
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

  console.log(state.profile);

  return (
    <Grid
      container
      gap={1}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper className="profile-card" sx={{ borderRadius: "20px" }}>
        <h2>Profile</h2>

        <Avatar src={`${BASE_URL}/avatar/${state.profile.avatar}`}>
          {state.profile.firstName && state.profile.firstName[0].toUpperCase()}
        </Avatar>

        <p>
          <span>
          {state.profile.firstName
            ? state.profile.firstName + " " + state.profile.lastName
            : " "}</span>
        </p>

        <span>Joined: {date} </span>
        <span>
          <p>
            Account Type:
            {state.profile.roles.includes(2)
              ? `Client`
              : state.profile.roles.includes(5)
              ? "Trainer"
              : "Admin"}
          </p>
        </span>

        <Divider />
        <Grid item>
          {" "}
          {!showUpload && (
            <img
              className="profile-image"
              width="100%"
              height="100%"
              src={`${BASE_URL}/avatar/${state.profile.avatar}`}
              alt="Profile "
              onError={() => setShowUpload((prev) => !prev)}
            />
          )}
        </Grid>

        {showUpload && (
          <>
            <Grid
              item
              xs={12}
              sx={{
                mt: 3,
                p: 3,
                border: 2,
                justifyItems: "center",
                minWidth: "300px",
              }}
            >
              <Button variant="contained" onClick={handlePickImage}>
                Pick image
              </Button>
              <input
                type="file"
                name="files"
                id="files"
                ref={hiddenFileInput}
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </Grid>
          </>
        )}

        {showUpload && (
          <>
            <Grid item xs={12} sx={{ mb: 5, mt: 2 }}>
              <Button
                type="button"
                onClick={updateProfileImage}
                size="small"
                variant="contained"
                sx={{ mr: 1, mb: 3 }}
              >
                Save
              </Button>

              <Button
                type="button"
                size="small"
                color="warning"
                variant="contained"
                onClick={() => setShowUpload(false)}
                sx={{ mb: 3 }}
              >
                Cancel
              </Button>
            </Grid>
          </>
        )}

        <p>
          {state.profile.trainerId &&
            `Trainer: ${state.trainer.firstname} ${state.trainer.lastname}`}
        </p>

        <Grid item sx={{ m: 1, mb: 4, mt: 1 }}>
          {!showUpload && (
            <Button
              variant="contained"
              onClick={() => setShowUpload((prev) => !prev)}
              sx={{ mb: 3 }}
            >
              Change Profile Image
            </Button>
          )}
        </Grid>
      </Paper>

      <Paper sx={{ borderRadius: "20px" }} className="profile-info">
        {state.completedWorkouts[state?.completedWorkouts?.length - 1] ? (
          
          <>
          <span> Last Workout{" "}</span>
          <p className="info-title">
           
            {new Date(
              state.completedWorkouts[
                state?.completedWorkouts?.length - 1
              ]?.dateCompleted
            ).toDateString()}
          </p>
          </>
        ) : (
          <>
          <p className="info-title"> No Workouts Found</p>
          <h2>GO WORKOUT! NOW!</h2>
          </>
        )}
        {state.profile.trainerId && <div className="account-details">
          <h2>Account Balance</h2>
          <p> Last Updated:{" "}
              {new Date(state.profile?.accountDetails?.date).toDateString()}</p>
              <p>Account Credit: ${state.profile?.accountDetails?.credit}</p>
              {state.profile?.accountDetails?.credit < 0 && <p className="msg-error">Balance DUE!</p>}
          </div>}
        
      </Paper>

      {state.profile.goals.length > 0 && (
        <Grid item xs={12} sm={4}>
          <Paper sx={{ borderRadius: 5, p: 2 }}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  p: 1,
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: 5,
                }}
              >
                Goals
              </Typography>
            </Grid>

            {state.profile.goals.map((goal, idx) => (
              <Paper elevation={6} sx={{ borderRadius: 5, p: 2, mt: 1, mb: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Goal: {goal.goal}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Achievement by: {goal.date}
                  </Typography>
                </Grid>
              </Paper>
            ))}
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default Profile;
