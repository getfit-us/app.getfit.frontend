import create from "zustand";


/// refactor in progress

/// instead of just notifications this is going to get broken down into different types of notifications
//messages , activity, active notifications, etc


const initialProfileState = {
  profile: {},
  measurements: [],
  notifications: [],
  activeNotifications: [],
  messages: [],
  chat: [],
  clients: [],
  trainer: {},
  calendar: [],

  persist: localStorage.getItem("persist") === "true" ? true : false,
};

const initialWorkoutState = {
  completedWorkouts: [],
  customWorkouts: [],
  assignedCustomWorkouts: [],
  currentWorkout: {},
  newWorkout: {},
  manageWorkout: [],
  exercises: [],
};

export const useProfile = create((set, get) => ({
  profile: {}, // going to contain the profile data and auth data (token , roles, etc)
  measurements: [],
  notifications: [], 
  activity: [], // going to contain the activity feed data
  clients: [], // going to contain the clients data
  activeNotifications: [], // going to contain the notifications that have not been read yet
  messages: [], // going to contain the messages
  chat: [],
  trainer: {},
  persist: localStorage.getItem("persist") === "true" ? true : false,
  setPersist: (persist) => {
    persist
      ? localStorage.setItem("persist", true)
      : localStorage.removeItem("persist");
    set({ persist });
  },

  calendar: [], // going to contain the calendar data events tasks goals

  setProfile: (profile) => set({ profile: profile }),
  setMeasurements: (measurements) => set({ measurements }),
  addMeasurement: (measurement) =>
    set((state) => ({ measurements: [...state.measurements, measurement] })),
  updateMeasurement: (measurement) =>
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m._id === measurement._id ? measurement : m
      ),
    })),
  //this is going to be changed on the backend, we will have different routes for different types of notifications
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
  setActiveNotifications: (notifications) => {
    set({ activeNotifications: notifications });
  },
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

  deleteNotification: (notification) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => n._id !== notification._id
      ),
      activeNotifications: state.activeNotifications.filter(
        (n) => n._id !== notification._id
      ),
      messages: state.messages.filter((n) => n._id !== notification._id),
    }));
  },

  setClients: (clients) =>
    set({
      clients: clients.sort((a, b) => a.firstname.localeCompare(b.firstname)),
    }),
  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c._id === client._id ? client : c)),
    })),
  setTrainer: (trainer) => set({ trainer }),
  setCalendar: (calendar) =>
    set({
      calendar: calendar.sort((a, b) => new Date(a.end) - new Date(b.end)),
    }),
  addCalendarEvent: (event) =>
    set((state) => ({
      calendar: [...state.calendar, event].sort(
        (a, b) => new Date(a.end) - new Date(b.end)
      ),
    })),
  deleteCalendarEvent: (eventId) =>
    set((state) => ({
      calendar: state.calendar.filter((e) => e._id !== eventId),
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
  resetProfileState: () => {
    set(initialProfileState);
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
}));
