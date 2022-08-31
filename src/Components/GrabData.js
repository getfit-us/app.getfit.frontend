import { useEffect } from "react";
import useProfile from "../utils/useProfile";

import useAxiosPrivate from "../utils/useAxiosPrivate";

const GrabData = ({ loading, setLoading, err, setError }) => {
  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (!state.measurements[0]) {
      getMeasurements(state.profile.clientId);
    }

    if (!state.workouts[0]) {
      getWorkouts(state.profile.clientId);
    }

    if (state.profile.trainerId && !state.trainer?.firstname)
      getTrainer(state.profile.trainerId);

    if (Object.keys(state.exercises).length === 0) getExercise();

    
  }, []);

  //get measurement data for state
  const getMeasurements = async (id) => {
    setLoading(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/client/${id}`, {
        signal: controller.signal,
      });
      //modify date string
      response.data.date = new Date(
        response.data?.date.slice(5) + "-" + response.data?.date.slice(0, 4)
      ).toDateString();
      dispatch({ type: "SET_MEASUREMENTS", payload: response.data });
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
    setLoading(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/workouts/client/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_WORKOUTS", payload: response.data });
      setLoading(false);

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
    setLoading(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/trainers/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_TRAINER", payload: response.data });
      setLoading(false);
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
    setLoading(true);
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
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);

    }
  };
};

export default GrabData;
