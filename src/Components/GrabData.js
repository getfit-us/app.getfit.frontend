import { useEffect, useState } from "react";
import useProfile from "../hooks/useProfile";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const GrabData = ({setStatus}) => {
 

  const { state, dispatch } = useProfile();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    //api call once
    if (state.measurements.length === 0) {
      getMeasurements(state.profile.clientId);
    }

    if (!state.completedWorkouts[0]) {
      getCompletedWorkouts(state.profile.clientId);
    }

    if (state.profile.trainerId && !state.trainer?.firstname) {
      getTrainer(state.profile.trainerId);
    }

    if (state.exercises.length === 0) {
      getExercise();
    }

    //if user is trainer or admin grab all client data
    if (
      state.clients.length === 0 &&
      (state.profile.roles.includes(5) || state.profile.roles.includes(10))
    ) {
      getClientData();
    }
    if (state.assignedCustomWorkouts.length === 0) {
      getAssignedCustomWorkouts();
    }

    if (state.notifications?.length === 0) {
      getNotifications();
    }

    if (state.customWorkouts?.length === 0) {
      getCustomWorkouts();

    }
  }, []);

  const getCustomWorkouts = async () => {
    let isMounted = true;
    //add logged in user id to data and workout name
    //   values.id = state.profile.clientId;
   
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/custom-workout/client/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );
      dispatch({
        type: "SET_CUSTOM_WORKOUTS",
        payload: response.data,
      });
   
      // reset();
    } catch (err) {
      console.log(err);
     
      if (err.response.status === 409) {
        //     setSaveError((prev) => !prev);
        //     setTimeout(() => setSaveError((prev) => !prev), 5000);
        //   }
      }
      return () => {
        isMounted = false;

        controller.abort();
      };
    }
  };


  const getAssignedCustomWorkouts = async () => {
    let isMounted = true;
    //add logged in user id to data and workout name
    //   values.id = state.profile.clientId;
   
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/custom-workout/client/assigned/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );
      dispatch({
        type: "SET_ASSIGNED_CUSTOM_WORKOUTS",
        payload: response.data,
      });
     
      // reset();
    } catch (err) {
      console.log(err);
     
      if (err.response.status === 409) {
        //     setSaveError((prev) => !prev);
        //     setTimeout(() => setSaveError((prev) => !prev), 5000);
        //   }
      }
      return () => {
        isMounted = false;

        controller.abort();
      };
    }
  };

  //get all client data
  const getClientData = async () => {
   
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/clients/all/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );

      dispatch({ type: "SET_CLIENTS", payload: response.data });

     
    } catch (err) {
      console.log(err);
     
    }
    return () => {
      controller.abort();
    };
  };

  //get notifications from api for current user
  const getNotifications = async () => {
   
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/notifications/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );

      dispatch({ type: "SET_NOTIFICATIONS", payload: response.data });

     
    } catch (err) {
      console.log(err);
     
    }
    return () => {
      controller.abort();
    };
  };

  //get measurement data for state
  const getMeasurements = async (id) => {
   
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/client/${id}`, {
        signal: controller.signal,
      });

      dispatch({ type: "SET_MEASUREMENTS", payload: response.data });

     
    } catch (err) {
      console.log(err);
     
    }
    return () => {
      controller.abort();
    };
  };

  const getCompletedWorkouts = async (id) => {
   
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
     

      // console.log(state.workouts)
    } catch (err) {
      console.log(err);
     
    }
    return () => {
      controller.abort();
    };
  };

  const getTrainer = async (id) => {
   
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/trainers/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      dispatch({ type: "SET_TRAINER", payload: response.data });
     
    } catch (err) {
      console.log(err);
     
    }
    return () => {
      controller.abort();
    };
  };

  const getExercise = async () => {
   
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
     
    } catch (err) {
      console.log(err);
     
    }
    return () => {
      controller.abort();
    };
  };
};

export default GrabData;
