import create from "zustand";

/// refactor in progress

/// instead of just notifications this is going to get broken down into different types of notifications
//messages , activity, active notifications, etc

/// TODO --- add api calls to state for things SWR can't handle

export const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const initialProfileState = {
  profile: {},
  measurements: [],
  activity: [], // going to contain the activity feed data
  alerts: [], // going to contain the notifications that have not been read yet
  tasks: [], // going to contain the tasks that have not been completed yet
  messages: [], // going to contain the messages
  clients: [],
  trainer: {},
  calendar: [],
  balance: 0,
  isAdmin: false,
  isTrainer: false,
  isClient: false,

  persist: false,
};

export const useProfile = create((set, get) => ({
  profile: {}, // going to contain the profile data and auth data (token , roles, etc)
  balance: 0,
  measurements: [],
  activity: [], // going to contain the activity feed data
  clients: [], // going to contain the clients data
  alerts: [], // going to contain the notifications that have not been read yet
  tasks: [], // going to contain the tasks that have not been completed yet
  isTrainer: false,
  isClient: false,
  isAdmin: false,
  messages: [], // going to contain the messages
  trainer: {}, // users trainer data
  calendar: [], // going to contain the calendar data events tasks goals
  persist: localStorage.getItem("persist") === "true" ? true : false,

  ///Setters
  setBalance: (balance) => set({ balance }),
  setIsTrainer: (isTrainer) => set({ isTrainer }),
  setIsClient: (isClient) => set({ isClient }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setActivity: (activity) => set({ activity }),
  setPersist: (persist) => {
    persist
      ? localStorage.setItem("persist", true)
      : localStorage.removeItem("persist");
    set({ persist });
  },
  setProfile: (profile) => set({ profile: profile }),
  setMeasurements: (measurements) => set({ measurements }),
  setNotifications: (notifications) => {
    set({ notifications });
  },
  setMessages: (messages) => {
    set({
      messages: messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      ),
    });
  },
  setAlerts: (alerts) => set({ alerts }),

  setClients: (clients) =>
    set({
      clients: clients.sort((a, b) => a.firstname.localeCompare(b.firstname)),
    }),
  setTrainer: (trainer) => set({ trainer }),
  setCalendar: (calendar) =>
    set({
      calendar: calendar.sort((a, b) => new Date(a.end) - new Date(b.end)),
    }),
  //add state setters

  addMeasurement: (measurement) =>
    set((state) => ({ measurements: [...state.measurements, measurement] })),
  addNotification: (notification) => {
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
      //if it has not been read yet we will also add it to the active notifications
      activeNotifications:
        message.receiver.id === get().profile.clientId &&
        message.is_read === false
          ? [...state.activeNotifications, message]
          : state.activeNotifications,
    }));
  },
  addCalendarEvent: (event) =>
    set((state) => ({
      calendar: [...state.calendar, event].sort(
        (a, b) => new Date(a.end) - new Date(b.end)
      ),
    })),
  updateMeasurement: (measurement) =>
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m._id === measurement._id ? measurement : m
      ),
    })),
  //this is going to be changed on the backend, we will have different routes for different types of notifications

  updateNotification: (notification) => {
    if (notification.type === "message") {
      set((state) => ({
        messages: state.messages.map((n) =>
          n._id === notification._id ? notification : n
        ),
        activeNotifications: state.activeNotifications.map((n) =>
          n._id === notification._id ? notification : n
        ),
      }));
    } else {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notification._id ? notification : n
        ),
        activeNotifications: state.activeNotifications.map((n) =>
          n._id === notification._id ? notification : n
        ),
      }));
    }
  },

  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c._id === client._id ? client : c)),
    })),

  updateProfile: (profileUpdate) =>
    set((state) => ({
      profile: {
        ...state.profile,
        email: profileUpdate.email ? profileUpdate.email : state.profile.email,
        firstName: profileUpdate.firstname
          ? profileUpdate.firstname
          : state.profile.firstName,
        lastName: profileUpdate.lastname
          ? profileUpdate.lastname
          : state.profile.lastName,
        goals: profileUpdate.goals ? profileUpdate.goals : state.profile.goals,
        phone: profileUpdate.phone ? profileUpdate.phone : state.profile.phone,
        age: profileUpdate.age ? profileUpdate.age : state.profile.age,
        avatar: profileUpdate.avatar
          ? profileUpdate.avatar
          : state.profile.avatar,
        accountDetails: profileUpdate.accountDetails
          ? profileUpdate.accountDetails
          : state.profile.accountDetails,
        startDate: profileUpdate.startDate
          ? profileUpdate.startDate
          : state.profile.startDate,
      },
    })),

  updateClients: (clientToUpdate) => {
    set({
      clients: get().clients.map((client) =>
        client._id === clientToUpdate._id ? clientToUpdate : client
      ),
    });
  },
  deleteCalendarEvent: (eventId) =>
    set((state) => ({
      calendar: state.calendar.filter((e) => e._id !== eventId),
    })),

  deleteActivity: (notificationId) => {
    set((state) => ({
      activity: state.activity.filter((a) => a._id !== notificationId),
    }));
  },

  resetProfileState: () => {
    set(initialProfileState);
  },

  //api calls that do not need SWR
  handleLogout: async (axiosPrivate) => {
    localStorage.removeItem("persist");
    const res = await axiosPrivate.get("/logout", {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    set({
      profile: {},
      persist: false,
      isAdmin: false,
      isClient: false,
      isTrainer: false,
    });
  },
  handleCompletedWorkout: async (axiosPrivate, workout) => {
    const res = await axiosPrivate.post("/completed-workouts", workout, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      return res;
    }
  },
  handleCompleteGoal: async (axiosPrivate, goalId) => {
    const res = await axiosPrivate.put(`/users/goal/${goalId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    if (res.status === 200) {
      return res.data;
    } else {
      return res;
    }
  },
}));

export const useWorkouts = create((set, get) => ({
  completedWorkouts: [],
  customWorkouts: [],
  currentWorkout: {},
  assignedCustomWorkouts: [],
  newWorkout: {},
  manageWorkout: [],
  exercises: [],
  exerciseHistory: {},
  setExerciseHistory: (exerciseHistory) => set({ exerciseHistory }),
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  setCompletedWorkouts: (completedWorkouts) => set({ completedWorkouts }),
  addCompletedWorkout: (completedWorkout) =>
    set((state) => ({
      completedWorkouts: [...state.completedWorkouts, completedWorkout],
    })),
  setCustomWorkouts: (customWorkouts) => set({ customWorkouts }),
  addCustomWorkout: (customWorkout) =>
    set((state) => ({
      customWorkouts: [...state.customWorkouts, customWorkout],
    })),
  updateCustomWorkout: (customWorkout) =>
    set((state) => ({
      customWorkouts: state.customWorkouts.map((w) =>
        w._id === customWorkout._id ? customWorkout : w
      ),
    })),
  delCustomWorkout: (customWorkout) =>
    set((state) => ({
      customWorkouts: state.customWorkouts.filter(
        (w) => w._id !== customWorkout._id
      ),
    })),
  delCompletedWorkout: (completedWorkout) =>
    set((state) => ({
      completedWorkouts: state.completedWorkouts.filter(
        (w) => w._id !== completedWorkout._id
      ),
    })),

  setAssignedCustomWorkouts: (assignedCustomWorkouts) =>
    set({ assignedCustomWorkouts }),
  addAssignedCustomWorkout: (assignedCustomWorkout) =>
    set((state) => ({
      assignedCustomWorkouts: [
        ...state.assignedCustomWorkouts,
        assignedCustomWorkout,
      ],
    })),
  setNewWorkout: (newWorkout) => set({ newWorkout }),
  setManageWorkout: (manageWorkout) => set({ manageWorkout }),
  setExercises: (exercises) => set({ exercises }),
  addExercise: (exercise) =>
    set((state) => ({ exercises: [...state.exercises, exercise] })),
  updateExercise: (exercise) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e._id === exercise._id ? exercise : e
      ),
    })),
  delExercise: (exercise) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e._id !== exercise._id),
    })),
  resetWorkoutState: () => {
    set({
      completedWorkouts: [],
      customWorkouts: [],
      assignedCustomWorkouts: [],
      currentWorkout: {},
      newWorkout: {},
      manageWorkout: [],
      exercises: [],
    });
  },
  handleSaveCustomWorkout: async (workout) => {
    const res = await axios.post("/custom-workout", workout);
    return res.data;
  },
  handleUpdateCustomWorkout: async (workout) => {
    const res = await axios.put("/custom-workout", workout);
    return res.data;
  },
}));
