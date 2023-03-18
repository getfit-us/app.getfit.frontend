import { Button, Divider, Paper } from "@mui/material";
import { useState, useRef } from "react";
import { BASE_URL } from "../../assets/BASE_URL";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useProfile } from "../../Store/Store";
import useSWRImmutable from "swr/immutable";
import { Link } from "react-router-dom";
import { AddPhotoAlternate } from "@mui/icons-material";
import './ProfileInfo.css'

const ProfileInfo = () => {
  const profile = useProfile((state) => state.profile);
  const measurements = useProfile((state) => state.measurements);
  const isClient = useProfile((state) => state.isClient);
  const isTrainer = useProfile((state) => state.isTrainer);
  const isAdmin = useProfile((state) => state.isAdmin);
  const date = new Date(profile.startDate).toDateString();
  const updateProfileState = useProfile((state) => state.updateProfile);
  const axiosPrivate = useAxiosPrivate();


  const [file, setFile] = useState();
  const hiddenFileInput = useRef(null);
  const handlePickImage = () => {
    hiddenFileInput.current.click();
  };

  const hasMeasurements = measurements?.length > 0;
  const hasProfileImage = profile?.avatar;
  const accountBalance = profile?.accountDetails?.credit;
  const accountBalanceUpdate = new Date(
    profile?.accountDetails?.date
  ).toLocaleString();

  const handleFile = (event) => {
    setFile(event.target.files[0]);
    setTimeout(() => updateProfileImage(event, event.target.files[0]), 300);
  };


  const { data: trainer, error: errorTrainer } = useSWRImmutable(
    profile.trainerId ? `/trainers/${profile.trainerId}` : null,
    (url) => getSWR(url, axiosPrivate),
    {
      onSuccess: (data) => setTrainer(data.data),
    }
  );

  const updateProfileImage = async (e, image) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append(image.name, image);

    //add client id to req so the image can be tagged to client.
    formData.append("id", profile.clientId);

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/upload", formData, {
        signal: controller.signal,
      });
      setFile(null);
      updateProfileState({ avatar: response.data.message });
    } catch (err) {
      console.log(err);
    }
    return () => {
      controller.abort();
    };
  };

  return (
    <Paper className="profile-card" elevation={3} sx={{ borderRadius: "20px" }}>
      <h2 className="page-title" style={{ width: "70%" }}>
        My Details
      </h2>

      <div className="profile-card-details">
        <ul>
          <li>
            Name:{" "}
            <span>
              {profile.firstName
                ? profile.firstName + " " + profile.lastName
                : " "}
            </span>
          </li>
          <li>
            Joined: <span>{date}</span>
          </li>
          <li>
            {" "}
            Account Type:{" "}
            <span>
              {isClient
                ? `Client`
                : isTrainer
                ? "Trainer"
                : isAdmin ? "Admin" : "User"}
            </span>
          </li>
          <li id='account-details'>
            {accountBalance < 0 ? "Past Due Balance:" : "Account Credit:"}{" "}
            <span className={accountBalance < 0 ? "overDue" : "spanInfo"}>
              {accountBalance ? "$" +accountBalance : `$0`}
            </span>
          </li>
          <li>
            Last Balance Update:{" "}
            <span className="spanInfo">{accountBalanceUpdate}</span>
          </li>
          {/* Only shows for a client that has a trainer */}
          {profile.trainerId && (
            <li>
              {" "}
              Trainer:{" "}
              <span className="titleInfo">{` ${trainer.firstname} ${trainer.lastname}`}</span>
            </li>
          )}
          <li>
            {" "}
            Current Weight:{" "}
            <span className="titleInfo">
              {hasMeasurements ? measurements[0]?.weight : "Add a measurement"}{" "}
              lbs
            </span>
          </li>
        </ul>

        <Button
          variant="contained"
          size="small"
          color="warning"
          sx={{ borderRadius: 20, marginTop: 1 , alignSelf: "center"}}
          component={Link}
          to={"/dashboard/measurements"}
        >
          {hasMeasurements ? "Update Weight" : "Add Weight"}
        </Button>
      </div>

      <Divider />
      <h2 className="page-title" style={{ width: "70%" }}>
        Profile Image
      </h2>
      {hasProfileImage ? (
        <img
          className="profile-image"
          width="100%"
          height="100%"
          src={`${BASE_URL}/avatar/${profile.avatar}`}
          alt="Profile "
        />
      ) : (
        <AddPhotoAlternate style={{ fontSize: 100 }} />
      )}

      <Button
        variant="contained"
        onClick={handlePickImage}
        sx={{
          borderRadius: 20,
          marginBottom: 2,
          marginTop: 2,
          alignSelf: "center",
        }}
      >
        Change Image{" "}
      </Button>
      <input
        type="file"
        name="files"
        id="files"
        ref={hiddenFileInput}
        onChange={handleFile}
        style={{ display: "none" }}
      />
    </Paper>
  );
};

export default ProfileInfo;
