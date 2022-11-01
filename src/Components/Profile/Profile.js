import {
  Avatar,
  Button,
  Divider,
  Grid,

  Paper,

  useMediaQuery,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useRef, useState } from "react";
import { BASE_URL } from "../../assets/BASE_URL";
import { useProfile, useWorkouts } from "../../Store/Store";

const Profile = () => {
  const profile = useProfile((state) => state.profile);
  const trainer = useProfile((state) => state.trainer);
  const completedWorkouts = useWorkouts((state) => state.completedWorkouts);
  const updateProfileState = useProfile((state) => state.updateProfile);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState();
  const hiddenFileInput = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  const date = new Date(profile.startDate).toDateString();
  const smDN = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timestampThirtyInPast = new Date().getTime() - sevenDaysInMs;

  const handlePickImage = () => {
    hiddenFileInput.current.click();
  };

  const handleFile = (event) => {
    setFile(event.target.files[0]);
    setTimeout(() => updateProfileImage(event, event.target.files[0] ), 300);
   
  };

  const updateProfileImage = async (e, image) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append(image.name, image);

    let isMounted = true;
    //add client id to req so the image can be tagged to client.
    formData.append("id", profile.clientId);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/upload", formData, {
        signal: controller.signal,
      });

      setShowUpload((prev) => !prev);
      setFile(null);
      console.log(response.data.message);
      
      updateProfileState({avatar: response.data.message});
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
      gap={1}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "1rem",
      }}
    >
      <Grid item xs={12} sm={3}>
        <Paper className="profile-card" sx={{ borderRadius: "20px" }}>
          <h2>Profile</h2>

          <Avatar
            src={`${BASE_URL}/avatar/${profile.avatar}`}
            sx={{ outline: "2px solid #00457f" }}
          >
            {profile.firstName &&
              profile.firstName[0].toUpperCase()}
          </Avatar>

          <p>
            <span>
              {profile.firstName
                ? profile.firstName + " " + profile.lastName
                : " "}
            </span>
          </p>

          <span>Joined: {date} </span>
          <span>
            <p>
              Account Type:
              {profile.roles.includes(2)
                ? `Client`
                : profile.roles.includes(5)
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
                src={`${BASE_URL}/avatar/${profile.avatar}`}
                alt="Profile "
                onError={() =>
                  setShowUpload((prev) => ({ ...prev, show: true }))
                }
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

          <p>
            {profile.trainerId &&
              `Trainer: ${trainer.firstname} ${trainer.lastname}`}
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
      </Grid>
      <Grid item xs={12} sm={5}>
        <Paper sx={{ borderRadius: "20px" }} className="profile-info">
          {completedWorkouts[completedWorkouts?.length - 1] ? (
            <>
          
              <p className="info-title">
              <img width="20%" height='20%' src="/img/flame.svg" alt="flame"/>
                <span> Last Workout: </span>
                {new Date(timestampThirtyInPast) >
                new Date(
                  completedWorkouts[
                    completedWorkouts?.length - 1
                  ]?.dateCompleted
                ) ? (
                  <h2>
                    It has been more then one week since you have worked out!
                  </h2>
                ) : (
                  new Date(
                    completedWorkouts[
                      completedWorkouts?.length - 1
                    ]?.dateCompleted
                  ).toDateString()
                )}
              </p>
            </>
          ) : (
            <>
              <p className="info-title"> No Workouts Found</p>
              <h2>GO WORKOUT! NOW!</h2>
            </>
          )}
          {profile.trainerId && (
            <div className="account-details">
              <h2>Account Balance</h2>
              <p> Last Updated: {profile?.accountDetails?.date}</p>
              <p>Account Credit: ${profile?.accountDetails?.credit}</p>
              {profile?.accountDetails?.credit < 0 && (
                <p className="msg-error">Balance DUE!</p>
              )}
            </div>
          )}

          <div></div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
