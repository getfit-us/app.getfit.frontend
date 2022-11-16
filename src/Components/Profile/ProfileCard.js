import { Avatar, Button, Divider, Grid, Paper } from "@mui/material";
import { useState, useRef } from "react";
import { BASE_URL } from "../../assets/BASE_URL";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getTrainerInfo } from "../../Api/services";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const [showUpload, setShowUpload] = useState(false);
  const profile = useProfile((state) => state.profile);
  const trainer = useProfile((state) => state.trainer);
  const measurements = useProfile((state) => state.measurements);
  const date = new Date(profile.startDate).toDateString();
  const updateProfileState = useProfile((state) => state.updateProfile);
  const axiosPrivate = useAxiosPrivate();
  const [loadingTrainer, latestTrainer, errorTrainer] =
    useApiCallOnMount(getTrainerInfo);

  const [file, setFile] = useState();
  const hiddenFileInput = useRef(null);
  const handlePickImage = () => {
    hiddenFileInput.current.click();
  };

  const handleFile = (event) => {
    setFile(event.target.files[0]);
    setTimeout(() => updateProfileImage(event, event.target.files[0]), 300);
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

      updateProfileState({ avatar: response.data.message });
    } catch (err) {
      console.log(err);
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  return (
    <Paper className="profile-card" elevation={3} sx={{ borderRadius: "20px" }}>
      <div style={{ width: "100%", }}>
        <h2 className="page-title" style={{marginRight: 10, marginLeft: 10}}>My Details</h2>

        <div className="profile-card-details">
          <p className="titleLabel">
            Name:{" "}
            <span className="titleInfo">
              {profile.firstName
                ? profile.firstName + " " + profile.lastName
                : " "}
            </span>
          </p>

          <p className="titleLabel">
            Joined: <span className="titleInfo">{date}</span>
          </p>
          <p className="titleLabel">
            Account Type:{" "}
            <span className="titleInfo">
              {profile.roles.includes(2)
                ? `Client`
                : profile.roles.includes(5)
                ? "Trainer"
                : "Admin"}
            </span>
          </p>
          {profile.trainerId && (
            <p className="titleLabel">
              Trainer:{" "}
              <span className="titleInfo">{` ${trainer.firstname} ${trainer.lastname}`}</span>
            </p>
          )}
          <p className="titleLabel">
            Current Weight:{" "}
            <span className="titleInfo">{measurements[0]?.weight} lbs</span>
          </p>

          <Button
            variant="contained"
            size="small"
            color="warning"
            sx={{ borderRadius: 20,  marginTop: 1 }}
            component={Link}
            to={'/dashboard/measurements'}
          >
            {measurements[0]?.weight ? 'Update Weight' : 'Add Weight'}
          </Button>
        </div>
      </div>
      <Divider />
      <Grid item>
        <h2 className="page-title" style={{marginRight: 10, marginLeft: 10}}>Profile Image</h2>{" "}
        {!showUpload && (
          <img
            className="profile-image"
            width="100%"
            height="100%"
            src={`${BASE_URL}/avatar/${profile.avatar}`}
            alt="Profile "
            onError={() => setShowUpload((prev) => ({ ...prev, show: true }))}
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
  );
};

export default ProfileCard;
