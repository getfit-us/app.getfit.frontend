import { Grid, Paper, useMediaQuery } from "@mui/material";
import { useProfile, useWorkouts } from "../../Store/Store";
import { LocalFireDepartment } from "@mui/icons-material";
import ProfileCard from "./ProfileCard";
import { useEffect } from "react";

const Profile = () => {
  const profile = useProfile((state) => state.profile);

  const completedWorkouts = useWorkouts((state) => state.completedWorkouts);

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
        <Paper sx={{ borderRadius: "20px" }} className="profile-info">
          {completedWorkouts[completedWorkouts?.length - 1] ? (
            <>
              <p className="info-title">
                <span>
                  {" "}
                  <LocalFireDepartment /> Last Workout:{" "}
                </span>
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
              <h2> No Workouts Found</h2>
              <h2>GO WORKOUT!</h2>
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
