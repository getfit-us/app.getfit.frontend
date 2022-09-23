import { createContext, useReducer } from "react";

const ProfileContext = createContext();

export const reducer = (state, action) => {
  switch (action.type) {
    //reset state on logout or other use case
    case "RESET_STATE":
      return {
        profile: {},
        completedWorkouts: [],
        trainer: {},
        measurements: [],
        exercises: [],
        notifications: [],
        customWorkouts: [],
        assignedCustomWorkouts: [],
        usedExercises: [],
        notifications: [],
      };
    //------------PROFILE---------------------------------
    //replaces the profile object with the new one at login
    case "SET_PROFILE":
      return {
        ...state,
        profile: action.payload,
      };
    //Update changes to profile
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: {
          ...state.profile,
          email: action.payload.email,
          firstname: action.payload.firstname,
          lastname: action.payload.lastname,
          goal: action.payload.goal,
          phone: action.payload.phone,
        },
      };
    //updates the profile object by spreading the rest of the properties and only updating the avatar property.
    case "UPDATE_PROFILE_IMAGE":
      return {
        ...state,
        profile: { ...state.profile, avatar: action.payload },
      };

    //updates the profile object by spreading the rest of the properties and only updating the goal property.

    case "UPDATE_GOALS":
      return { ...state, profile: { ...state.profile, goal: action.payload } };
    //----------------------- COMPLETED WORKOUTS ------------------------------------ not custom workout routines
    case "SET_COMPLETED_WORKOUTS":
      return { ...state, completedWorkouts: action.payload };

    case "ADD_COMPLETED_WORKOUT":
      return {
        ...state,

        completedWorkouts: [...state.completedWorkouts, action.payload],
      };

    //------------------Custom Workouts ------------------------------------------------

    case "SET_CUSTOM_WORKOUTS":
      return { ...state, customWorkouts: action.payload };

    case "ADD_CUSTOM_WORKOUT":
      return {
        ...state,

        customWorkouts: [...state.customWorkouts, action.payload],
      };

    case "MODIFY_CUSTOM_WORKOUT":
      return {
        ...state,

        customWorkouts: [...state.customWorkouts, action.payload],
      };
    //=-------assigned custom workouts ---------------
    case "SET_ASSIGNED_CUSTOM_WORKOUTS":
      return { ...state, assignedCustomWorkouts: action.payload };

    case "ADD_ASSIGNED_CUSTOM_WORKOUTS":
      return {
        ...state,

        assignedCustomWorkouts: [
          ...state.assignedCustomWorkouts,
          action.payload,
        ],
      };

    case "MODIFY_ASSIGNED_CUSTOM_WORKOUTS":
      return {
        ...state,

        assignedCustomWorkouts: [
          ...state.assignedCustomWorkouts,
          action.payload,
        ],
      };
    //--------------TRAINER-----------------------------------------
    case "SET_TRAINER":
      //replaces the trainer object with the new one

      return {
        ...state,
        trainer: action.payload,
      };
    //-------------------USED EXERCISES--------------------------------

    case "SET_USED_EXERCISES":

    console.log(action.payload)
      return {
        ...state,
        usedExercises: action.payload,
      };

    case "ADD_USED_EXERCISE":
      //db adding to existing record so its return all the data so just over write state.
      //backend removes duplicates also

      return {
        ...state,
        usedExercises: [...state.usedExercises, action.payload]
      };

    //--------------------EXERCISES----------------------------------------
    case "SET_EXERCISES":
      return {
        ...state,
        exercises: action.payload,
      };
    case "ADD_EXERCISE":
      return {
        ...state,
        exercises: [...state.exercises, action.payload],
      };
    case "UPDATE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise._id === action.payload._id ? action.payload : exercise
        ),
      };
    case "DELETE_EXERCISE":
      return {
        ...state,
        exercises: state.exercises.filter(
          (exercise) => exercise._id !== action.payload
        ),
      };
    //----Measurements--------------------------------
    case "SET_MEASUREMENTS":
      return {
        ...state,
        measurements: action.payload,
      };
    case "ADD_MEASUREMENT":
      return {
        ...state,
        measurements: [...state.measurements, action.payload],
      };
    case "UPDATE_MEASUREMENT":
      return {
        ...state,
        measurements: state.measurements.map((measurement) =>
          measurement._id === action.payload._id ? action.payload : measurement
        ),
      };

    //------------------Notifications--------------------------------
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload,
      };

    //-----------DEFAULT------------------
    default:
      return state;
  }
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    profile: {},
    completedWorkouts: [],
    trainer: {},
    measurements: [],
    exercises: [],
    notifications: [],
    customWorkouts: [],
    assignedCustomWorkouts: [],
    usedExercises: [],
    notifications: [],
  });

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
