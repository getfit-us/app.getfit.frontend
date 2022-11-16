export const getCalendarData = async (axiosPrivate, state, workoutState) => {
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get(
      `/users/calendar/${state.profile.clientId}`
    );
    state.setCalendar(response.data);
  } catch (error) {
    console.log(error);
  }
  return () => {
    controller.abort();
  };
};

export const getCustomWorkouts = async (axiosPrivate, state, workoutState) => {
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
    workoutState.setCustomWorkouts(response.data);
    return response.data;
  } catch (err) {
    console.log(err);

    throw new Error(err.message);
  }
};

export const getAssignedCustomWorkouts = async (
  axiosPrivate,
  state,
  workoutState
) => {
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get(
      `/custom-workout/client/assigned/${state.profile.clientId}`,
      {
        signal: controller.signal,
      }
    );
    workoutState?.setAssignedCustomWorkouts(response.data);
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

//get all client data
export const getClientData = async (axiosPrivate, state, workoutState) => {
  if (state.profile.roles.includes(2)) return null;
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get(
      `/clients/all/${state.profile.clientId}`,
      {
        signal: controller.signal,
      }
    );

    state?.setClients(response.data);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
  return () => {
    controller.abort();
  };
};

//get notifications from api for current user
export const getNotifications = async (axiosPrivate, state, workoutState) => {
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
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

//get measurement data for state
export const getMeasurements = async (axiosPrivate, state, workoutState) => {
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get(
      `/measurements/client/${state?.profile?.clientId}`,
      {
        signal: controller.signal,
      }
    );
    state?.setMeasurements(response.data);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
  return () => {
    controller.abort();
  };
};

export const getCompletedWorkouts = async (
  axiosPrivate,
  state,
  workoutState
) => {
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get(
      `/completed-workouts/client/${state.profile.clientId}`,
      {
        signal: controller.signal,
      }
    );
    workoutState?.setCompletedWorkouts(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getTrainerInfo = async (axiosPrivate, state, workoutState) => {
  if (!state.profile.trainerId) return null;
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get(
      `/trainers/${state?.profile.trainerId}`,
      {
        signal: controller.signal,
      }
    );
    state?.setTrainer(response.data);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
  return () => {
    controller.abort();
  };
};

export const getAllExercises = async (axiosPrivate, state, workoutState) => {
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get("/exercises", {
      signal: controller.signal,
    });
    // return alphabetic order
    workoutState?.setExercises(
      response.data.sort((a, b) => a.name.localeCompare(b.name))
    );
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
  return () => {
    controller.abort();
  };
};

export const getSingleMeasurement = async (axiosPrivate, idOfMeasurement) => {
  const controller = new AbortController();
  let status = {
    loading: false,
    error: false,
    data: null,
  };
  status = { loading: true, error: false, data: null };
  if (!idOfMeasurement) return status;
  try {
    const response = await axiosPrivate.get(
      `/measurements/${idOfMeasurement}`,
      {
        signal: controller.signal,
      }
    );
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    console.log(err);
    status = { loading: false, error: true, data: null };
  }

  return status;
};

export const getSingleCompletedWorkout = async (axiosPrivate, idOfWorkout) => {
  let status = {
    loading: false,
    error: false,
    data: null,
  };
  status = { loading: true, error: false, data: null };
  if (!idOfWorkout) return status;
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get(
      `/completed-workouts/${idOfWorkout}`,
      {
        signal: controller.signal,
      }
    );
    status = { loading: false, error: false, data: response.data };

    // console.log(workouts)
  } catch (err) {
    console.log(err);
    status = { loading: false, error: true, data: null };
  }
  return status;
};

export const deleteSingleNotification = async (
  axiosPrivate,
  idOfNotification
) => {
  let status = { loading: true, error: false, data: null };
  if (!idOfNotification) return status;
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.delete(
      `/notifications/${idOfNotification}`,
      {
        signal: controller.signal,
      }
    );
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    console.log(err);
    //   setError(err.message);
  }
  return status;
};

export const getSingleCustomWorkout = async (
  axiosPrivate,
  idOfCustomWorkout
) => {
  let status = { loading: true, error: false, data: null };
  if (!idOfCustomWorkout) return status;
  console.log(idOfCustomWorkout);
  try {
    const response = await axiosPrivate.get(
      `/custom-workout/${idOfCustomWorkout}`
    );
    console.log(response.data);
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    console.log(err);
    status = { loading: false, error: true, data: null };
  }
  return status;
};

export const updateSingleNotification = async (axiosPrivate, message) => {
  message.is_read = true;
  //if liked set to true
  let status = { loading: true, error: false, data: null };
  if (!message) return status;
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.put("/notifications", message, {
      signal: controller.signal,
    });
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    console.log(err);
    status = { loading: false, error: true, data: null };
  }
  return status;
};

export const completeGoal = async (axiosPrivate, goalId) => {
  const controller = new AbortController();
  let status = { loading: true, error: false, data: null };
  if (!goalId) return status;
  try {
    const response = await axiosPrivate.delete(`/users/calendar/${goalId}`, {
      signal: controller.signal,
      withCredentials: true,
    });
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    console.log(err);
    status = { loading: false, error: true, data: null };
  }
  return status;
};

export const LogoutUser = async (axiosPrivate) => {
  console.log("logging out");
  let status = { loading: true, error: false, data: null };
  const controller = new AbortController();
  try {
    const response = await axiosPrivate.get("/logout", {
      signal: controller.signal,
    });
    // console.log(response.data);
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    status = { loading: false, error: true, data: null };
    console.log(err);
  }
  return status;
};

export const saveCompletedWorkout = async (axiosPrivate, workout) => {
  let status = { loading: true, error: false, data: null };

  const controller = new AbortController();
  try {
    const response = await axiosPrivate.post("/completed-workouts", workout, {
      signal: controller.signal,
    });
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    console.log(err);
    status = { loading: false, error: true, data: null };
  }
  return status;
};

export const addNotificationApi = async (axiosPrivate, notification) => {
  let status = { loading: true, error: false, data: null };

  const controller = new AbortController();
  try {
    const response = await axiosPrivate.post("/notifications", notification, {
      signal: controller.signal,
    });
    status = { loading: false, error: false, data: response.data };
  } catch (err) {
    console.log(err);
    status = { loading: false, error: true, data: null };
  }
  return status;
};
