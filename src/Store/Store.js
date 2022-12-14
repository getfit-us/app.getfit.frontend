import create from "zustand";

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
  clients: [],
  activeNotifications: [],
  messages: [],
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

  setNotifications: (notifications) => {
    set({
      activeNotifications: notifications.filter(
        // filter out the notifications that are not read and are not type activity 'like completed workout' etc..
        (notification) =>
          notification.receiver.id === get().profile.clientId &&
          notification.is_read === false &&
          notification.type !== "activity"
      ), // set active notifications
      messages: notifications
        .filter((n) => n.type === "message")
        .sort((m1, m2) => {
          return new Date(m1.createdAt) - new Date(m2.createdAt);
        }), // set messages sorted by date
      notifications: notifications.filter((notification) => {
        //regular notifications not type message or type task
        return (
          notification.receiver.id === get().profile.clientId &&
          notification.type !== "message" &&
          notification.type !== "task"
        );
      }), // set notifications
    });
  },
  addNotification: (notification) => {
    set((state) => ({
      notifications:
        notification.receiver.id === get().profile.clientId &&
        notification.type !== "message" &&
        notification.type !== "task"
          ? state.notifications
          : [...state.notifications, notification],
      activeNotifications:
        notification.receiver.id === get().profile.clientId &&
        notification.is_read === false &&
        notification.type !== "activity"
          ? [...state.activeNotifications, notification]
          : state.activeNotifications,
      messages:
        notification.type === "message"
          ? [...state.messages, notification]
          : state.messages,
    }));
  },
  updateNotification: (notification) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notification._id ? notification : n
      ),
      activeNotifications: state.activeNotifications.map((n) =>
        n._id === notification._id ? notification : n
      ),
      messages: state.messages.map((n) =>
        n._id === notification._id ? notification : n
      ),
    })),

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
  setCalendar: (calendar) => set({ calendar }),
  addCalendarEvent: (event) =>
    set((state) => ({ calendar: [...state.calendar, event] })),
  deleteCalendarEvent: (event) =>
    set((state) => ({
      calendar: state.calendar.filter((e) => e._id !== event._id),
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
