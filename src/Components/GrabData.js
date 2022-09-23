import { useEffect, useState } from "react";
import useProfile from "../hooks/useProfile";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const GrabData = ({ setLoadingApi, err, setError }) => {
  const [gotMeasurements, setGotMeasurements] = useState(false);
  const [gotWorkouts, setGotWorkouts] = useState(false);

  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();

 console.log(state.notifications)


  useEffect(() => {
    //api call once
    if (state.measurements.length === 0 && !gotMeasurements) {
      getMeasurements(state.profile.clientId);
    }

    if (!state.completedWorkouts[0] && !gotWorkouts) {
      getCompletedWorkouts(state.profile.clientId);
    }

    if (state.profile.trainerId && !state.trainer?.firstname) {
      getTrainer(state.profile.trainerId);
    }

    if (state.exercises.length === 0) {
      getExercise();
    }

    if (state.notifications?.length === 0) {
      getNotifications();
    }
  }, []);
  //get notifications from api for current user
  const getNotifications = async () => {
    setLoadingApi(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/notifications/${state.profile.clientId}`, {
        signal: controller.signal,
      });
      
      dispatch({ type: "SET_NOTIFICATIONS", payload: response.data });

      setLoadingApi(false);
     
    } catch (err) {
      console.log(err);
      setError(err);
      //save last page so they return back to page before re auth.
      // navigate('/login', {state: {from: location}, replace: true});
    }
    return () => {
      controller.abort();
    };
  };

  //get measurement data for state
  const getMeasurements = async (id) => {
    setLoadingApi(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/client/${id}`, {
        signal: controller.signal,
      });
      //modify date string something wrong here
      // response.data.date = new Date(
      //   response.data?.date.slice(5) + "-" + response.data?.date.slice(0, 4)
      // ).toDateString();
      dispatch({ type: "SET_MEASUREMENTS", payload: response.data });

      setLoadingApi(false);
      setGotMeasurements(true);
    } catch (err) {
      console.log(err);
      setError(err);
      //save last page so they return back to page before re auth.
      // navigate('/login', {state: {from: location}, replace: true});
    }
    return () => {
      controller.abort();
    };
  };

  const getCompletedWorkouts = async (id) => {
    setLoadingApi(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/completed-workouts/client/${id}`,
        {
          signal: controller.signal,
        }
      );
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_COMPLETED_WORKOUTS", payload: response.data });
      setLoadingApi(false);
      setGotWorkouts(true);

      // console.log(state.workouts)
    } catch (err) {
      console.log(err);
      setError(err);
      //save last page so they return back to page before re auth.
      // navigate('/login', {state: {from: location}, replace: true});
    }
    return () => {
      controller.abort();
    };
  };

  const getTrainer = async (id) => {
    setLoadingApi(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/trainers/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_TRAINER", payload: response.data });
      setLoadingApi(false);
    } catch (err) {
      console.log(err);
      setError(err);
      //save last page so they return back to page before re auth.
      // navigate('/login', {state: {from: location}, replace: true});
    }
    return () => {
      controller.abort();
    };
  };

  const getExercise = async () => {
    setLoadingApi(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get("/exercises", {
        signal: controller.signal,
      });
      // return alphabetic order
      dispatch({
        type: "SET_EXERCISES",
        payload: response.data.sort((a, b) => (a.name > b.name ? 1 : -1)),
      });
      setLoadingApi(false);
    } catch (err) {
      console.log(err);
      setError(err);
    }
  };
};

export default GrabData;
