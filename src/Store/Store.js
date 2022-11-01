import  create  from "zustand";
import { persist } from "zustand/middleware";

export const useProfile = create((set, get) => ({
  profile: {}, // going to contain the profile data and auth data (token , roles, etc)
  measurements: [],
  notifications: [],
  clients: [],
  trainer: {},
  calendar: [], // going to contain the calendar data events tasks goals
  status: {
    // api status for global loading indicator
    loading: false,
    error: false,
    message: "",
  },
  setProfile: (profile) => set({ profile }),
  setMeasurements: (measurements) => set({ measurements }),
  addMeasurement: (measurement) =>
    set((state) => ({ measurements: [...state.measurements, measurement] })),
  updateMeasurement: (measurement) =>
    set((state) => ({
      measurements: state.measurements.map((m) =>
        m._id === measurement._id ? measurement : m
      ),
    })),

  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({ notifications: [...state.notifications, notification] })),
  updateNotification: (notification) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === notification._id ? notification : n
      ),
    })),
  deleteNotification: (notification) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => n._id !== notification._id
      ),
    })),
  setClients: (clients) => set({ clients }),
  setTrainer: (trainer) => set({ trainer }),
  setCalendar: (calendar) => set({ calendar }),
  addCalendarEvent: (event) =>
    set((state) => ({ calendar: [...state.calendar, event] })),
  deleteCalendarEvent: (event) =>
    set((state) => ({
      calendar: state.calendar.filter((e) => e._id !== event._id),
    })),
  setStatus: (status) => set({ status }),
  updateProfile: (profile) => {
    set((state) => {
      return {
        ...state.profile,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        age: profile.age,
        avatar: profile.image,
      };
    });
  },
  updateClients: (clientToUpdate) => {
    set({
      clients: get().clients.map((client) =>
        client._id === clientToUpdate._id ? clientToUpdate : client
      ),
    });
  },
  resetState: () => {
    set({
      profile: {},
      measurements: [],
      notifications: [],
      clients: [],
      trainer: {},
      calendar: [],
      status: {
        loading: false,
        error: false,
        message: "",
      },
    });
  },
}));

export const useWorkouts = create((persist) => (set, get) => ({
  completedWorkouts: [],
  customWorkouts: [],
  assignedCustomWorkouts: [],
  newWorkout: {},
  manageWorkout: [],
  exercises: [],
  status: {
    loading: false,
    error: false,
    message: "",
  },
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
  addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
  updateExercise: (exercise) => set((state) => ({ exercises: state.exercises.map((e) => e._id === exercise._id ? exercise : e) })),
  delExercise: (exercise) => set((state) => ({ exercises: state.exercises.filter((e) => e._id !== exercise._id) })),
  setStatus: (status) => set({ status }),
  resetState: () => {
    set({
      completedWorkouts: [],
      customWorkouts: [],
      assignedCustomWorkouts: [],
      newWorkout: {},
      manageWorkout: [],
      exercises: [],
      status: {
        loading: false,
        error: false,
        message: "",
      },
    });
  },
}));
