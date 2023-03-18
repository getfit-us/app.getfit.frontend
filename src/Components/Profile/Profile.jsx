import { Grid } from "@mui/material";
import { useProfile, useWorkouts } from "../../Store/Store";
import ProfileInfo from "./ProfileInfo";
import { useEffect } from "react";
import useSWR from "swr";
import WorkoutInfo from "./WorkoutInfo";
import { InitialWorkout } from "../../Api/services";
const Profile = () => {
  const profile = useProfile((state) => state.profile);
  const setMeasurements = useProfile((state) => state.setMeasurements);
  const setCompletedWorkouts = useProfile((state) => state.setCompletedWorkouts);

    const {data: measurements, isLoading: loadingMeasurements} = useSWR(`/measurements/client/${profile.clientId}`, (url) => getSWR(url, axiosPrivate), {
        onSuccess: (data) => {
            setMeasurements(data.data)
        }
    })


    const { data: completedWorkouts, isLoading: loadingCompletedWorkouts } =
    useSWR(
      `/completed-workouts/client/${profile.clientId}`,
      (url) => getSWR(url, axiosPrivate),
      {
        fallbackData: InitialWorkout,
        onSuccess: (data) => {
          setCompletedWorkouts(data);
        },
      }
    );



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
