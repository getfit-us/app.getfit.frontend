import { Grid, Paper, Rating, useMediaQuery } from "@mui/material";
import { useProfile, useWorkouts } from "../../Store/Store";
import { LocalFireDepartment } from "@mui/icons-material";
import ProfileCard from "./ProfileCard";
import { useEffect } from "react";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getCompletedWorkouts, getMeasurements } from "../../Api/services";
const Profile = () => {
  const profile = useProfile((state) => state.profile);
  const completedWorkouts = useWorkouts((state) => state.completedWorkouts);
  const [
    loadingCompletedWorkouts,
    latestCompletedWorkouts,
    errorCompletedWorkouts,
  ] = useApiCallOnMount(getCompletedWorkouts);
  const [loadingMeasurements, measurements, errorMeasurements] =
    useApiCallOnMount(getMeasurements);

  const smDN = useMediaQuery((theme) => theme.breakpoints.down("sm"), {
    defaultMatches: true,
    noSsr: false,
  });
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  const timestampThirtyInPast = new Date().getTime() - sevenDaysInMs;

  useEffect(() => {
    document.title = "Profile";
  }, []);

  return (
    <Grid
      container
      gap={1}
      sx={{
        display: "flex",
        justifyContent: "start",
        mt: "1rem",
      }}
    >
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <ProfileCard />
      </Grid>

      <Grid item xs={12} sm={5}>
        <Paper elevation={3} sx={{ borderRadius: "20px" }}>
          {completedWorkouts[completedWorkouts?.length - 1] ? (
            <div style={{ width: "100%", padding: "4px" }}>
              <h2
                className="page-title"
                style={{ marginRight: 10, marginLeft: 10 }}
              >
                {" "}
                <LocalFireDepartment /> Workout Info
              </h2>
              <div className="profile-card-details">
                <p className="info-title">
                  {new Date(timestampThirtyInPast) >
                  new Date(
                    completedWorkouts[
                      completedWorkouts?.length - 1
                    ]?.dateCompleted
                  ) ? (
                    <h3>
                      It has been more then one week since you have logged a
                      workout.
                    </h3>
                  ) : (
                    <>
                      <span>Last Workout:</span>
                      <span className="titleInfo">
                        {" "}
                        {new Date(
                          completedWorkouts[
                            completedWorkouts?.length - 1
                          ]?.dateCompleted
                        ).toDateString()}
                      </span>
                    </>
                  )}
                </p>
                <p className="info-title">
                  Name:{" "}
                  <span className="titleInfo">
                    {completedWorkouts[completedWorkouts?.length - 1]?.name}{" "}
                  </span>
                </p>
                <p className="info-title">
                  Rating:{" "}
                  <Rating
                    value={
                      completedWorkouts[completedWorkouts?.length - 1]?.rating
                    }
                    readOnly
                  />
                </p>
                <p className="info-title">
                  Feedback:{" "}
                  {completedWorkouts[completedWorkouts?.length - 1]?.feedBack}
                </p>
              </div>
            </div>
          ) : (
            <>
              <h2>No Workouts Found</h2>
              <h2>GO WORKOUT!</h2>
            </>
          )}

          {/* neeed to finish here styling adding padding and labels like above */}
          {profile?.trainerId && (
            <div className="account-details" id="account-details">
              <h2 className="page-title" style={{ marginRight: 10, marginLeft: 10 }}>Account Balance</h2>
              <p>Last Balance Update: {profile?.accountDetails?.date}</p>
              <p>Account Credit: ${profile?.accountDetails?.credit}</p>
              {profile?.accountDetails?.credit < 0 && (
                <p className="msg-error">Balance past due</p>
              )}
            </div>
          )}

          <div className=""></div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Profile;
