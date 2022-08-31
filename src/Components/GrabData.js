import { useEffect, useState } from "react";
import useProfile from "../utils/useProfile";

import useAxiosPrivate from "../utils/useAxiosPrivate";

const GrabData = ({  setLoadingApi, err, setError }) => {
  const [gotMeasurements, setGotMeasurements] = useState(false);
  const [gotWorkouts, setGotWorkouts] = useState(false);

  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();


  useEffect(() => {

    //api call once 
    if (state.measurements.length === 0 && !gotMeasurements) {
      console.log('api get measurements')
      getMeasurements(state.profile.clientId);
    }

    if (!state.workouts[0] && !gotWorkouts) {
      console.log('api get workouts')
      getWorkouts(state.profile.clientId);
    }

    if (state.profile.trainerId && !state.trainer?.firstname) {
    console.log('api get Trainer info')
      getTrainer(state.profile.trainerId);
    }

    if (state.exercises.length === 0) {
      console.log('api get exercises')
      getExercise();
    }

    
  }, []);

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

  const getWorkouts = async (id) => {
    setLoadingApi(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/workouts/client/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_WORKOUTS", payload: response.data });
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
