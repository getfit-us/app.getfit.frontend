import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useProfile = create((set, get) => ({
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
  setClients: (clients) => set({ clients }),
  setTrainer: (trainer) => set({ trainer }),
  setCalendar: (calendar) => set({ calendar }),
  setStatus: (status) => set({ status }),
  updateProfile: (profile) => {
    set({
      ...profile,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      age: profile.age,
      avatar: profile.image,
    });
  },
  updateClients: (clientToUpdate) => {
    set({
      clients: get().clients.map((client) =>
        client._id === clientToUpdate._id ? clientToUpdate : client
      ),
    });
  },
}));

export default useProfile;
