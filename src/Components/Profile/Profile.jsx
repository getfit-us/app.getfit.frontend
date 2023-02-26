import { Grid } from "@mui/material";
import { useProfile, useWorkouts } from "../../Store/Store";
import ProfileInfo from "./ProfileInfo";
import { useEffect } from "react";
import useApiCallOnMount from "../../hooks/useApiCallOnMount";
import { getCompletedWorkouts, getMeasurements } from "../../Api/services";
import WorkoutInfo from "./WorkoutInfo";
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

  useEffect(() => {
    document.title = "GetFit App| Profile";
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
        <ProfileInfo />
      </Grid>

      <Grid item xs={12} sm={5}>
        <WorkoutInfo 
        profile={profile}
        completedWorkouts={completedWorkouts} />
      </Grid>
    </Grid>
  );
};



export default Profile;
