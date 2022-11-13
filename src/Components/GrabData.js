import { useEffect} from "react";
import { useProfile, useWorkouts } from "../Store/Store";

import useAxiosPrivate from "../hooks/useAxiosPrivate";

const GrabData = () => {
  const state = useProfile();
  const workouts = useWorkouts();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    //api call once

    if (state?.measurements.length === 0) {
      getMeasurements(state?.profile.clientId);
    }

    if (!workouts?.completedWorkouts[0]) {
      getCompletedWorkouts(state?.profile?.clientId);
    }

    if (state?.profile.trainerId && !state?.trainer?.firstname) {
      getTrainer(state?.profile.trainerId);
    }

    if (workouts?.exercises.length === 0) {
      getExercise();
    }

    //if user is trainer or admin grab all client data
    if (
      state?.clients.length === 0 &&
      (state?.profile.roles.includes(5) || state?.profile.roles.includes(10))
    ) {
      getClientData();
    }
    if (workouts?.assignedCustomWorkouts.length === 0) {
      getAssignedCustomWorkouts();
    }

    if (state?.notifications?.length === 0) {
      getNotifications();
    }

    if (workouts?.customWorkouts?.length === 0) {
      getCustomWorkouts();
    }

    if (state?.calendar?.length === 0) {
      getCalendar();
    }
  }, []);

  useEffect(() => {
    //api call every 10sec for notifications
    const interval = setInterval(async () => {
      await getNotifications();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getCalendar = async () => {
    state.setStatus({ loading: true });

    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/users/calendar/${state.profile.clientId}`
      );
      state.setCalendar(response.data);
      state.setStatus({ loading: false });
    } catch (error) {
      console.log(error);
      state.setStatus({
        loading: false,
        error: true,
        message: error.message,
      });
    }
    return () => {
      controller.abort();
    };
  };

  const getCustomWorkouts = async () => {
    state.setStatus({ loading: true });
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
      workouts.setCustomWorkouts(response.data);
      state.setStatus({ loading: false });
      // reset();
    } catch (err) {
      console.log(err);
      state.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
      if (err.response.status === 409) {
        //     setSaveError((prev) => !prev);
        //     setTimeout(() => setSaveError((prev) => !prev), 5000);
        //   }
      }
      return () => {
        controller.abort();
      };
    }
  };

  const getAssignedCustomWorkouts = async () => {
    let isMounted = true;
    //add logged in user id to data and workout name
    //   values.id = state.profile.clientId;
    state.setStatus({ loading: true });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/custom-workout/client/assigned/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );
      workouts?.setAssignedCustomWorkouts(response.data);
      state.setStatus({ loading: false });
      // reset();
    } catch (err) {
      console.log(err);
      state?.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
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
    state.setStatus({ loading: true });
    try {
      const response = await axiosPrivate.get(
        `/clients/all/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );

      state?.setClients(response.data);
      state.setStatus({ loading: false });
    } catch (err) {
      console.log(err);
      state?.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
    }
    return () => {
      controller.abort();
    };
  };

  //get notifications from api for current user
  const getNotifications = async () => {
    state.setStatus({ loading: true });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/notifications/${state.profile.clientId}`,
        {
          signal: controller.signal,
        }
      );
        if (state.notifications?.length !== response.data.length) {
      state?.setNotifications(response.data);
        }
      state?.setStatus({ loading: false });
    } catch (err) {
      console.log(err);
      state?.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
    }
    return () => {
      controller.abort();
    };
  };

  //get measurement data for state
  const getMeasurements = async (id) => {
    state?.setStatus({ loading: true });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/measurements/client/${id}`, {
        signal: controller.signal,
      });
      state?.setMeasurements(response.data);
      state?.setStatus({ loading: false });
    } catch (err) {
      console.log(err);
      state?.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
    }
    return () => {
      controller.abort();
    };
  };

  const getCompletedWorkouts = async (id) => {
    state?.setStatus({ loading: true });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(
        `/completed-workouts/client/${id}`,
        {
          signal: controller.signal,
        }
      );
      workouts?.setCompletedWorkouts(response.data);
      state?.setStatus({ loading: false });
      // console.log(state.workouts)
    } catch (err) {
      console.log(err);
      state?.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
    }
    return () => {
      controller.abort();
    };
  };

  const getTrainer = async (id) => {
    state?.setStatus({ loading: true });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get(`/trainers/${id}`, {
        signal: controller.signal,
      });
      // console.log(JSON.stringify(response.data));
      state?.setTrainer(response.data);
      state?.setStatus({ loading: false });
    } catch (err) {
      console.log(err);
      state?.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
    }
    return () => {
      controller.abort();
    };
  };

  const getExercise = async () => {
    state?.setStatus({ loading: true });
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.get("/exercises", {
        signal: controller.signal,
      });
      // return alphabetic order
      workouts?.setExercises(
        response.data.sort((a, b) => a.name.localeCompare(b.name))
      );

      state?.setStatus({ loading: false });
    } catch (err) {
      console.log(err);
      state?.setStatus({
        loading: false,
        error: true,
        message: err.message,
      });
    }
    return () => {
      controller.abort();
    };
  };
};

export default GrabData;
