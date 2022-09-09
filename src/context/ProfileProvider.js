import { createContext, useReducer } from "react";

const ProfileContext = createContext();

export const reducer = (state, action) => {
  switch (action.type) {
    //reset state on logout or other use case
    case "RESET_STATE":
      return {
        profile: {},
        workouts: [],
        trainer: {},
        measurements: [],
        exercises: [],
        notifications: [],
        customWorkouts: [],
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
    //----------------------- WORKOUT LOGS ------------------------------------ not custom workout routines
    case "SET_WORKOUTS":
      return { ...state, workouts: action.payload };

    case "ADD_WORKOUT":
      return {
        ...state,

        workouts: [...state.workouts, action.payload],
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
    //--------------TRAINER-----------------------------------------
    case "SET_TRAINER":
      //replaces the trainer object with the new one

      return {
        ...state,
        trainer: action.payload,
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
    //Format Date in state
    case "SET_MEASUREMENTS":
      return {
        ...state,
        measurements: action.payload.map((measurement) => {
          measurement.date = new Date(
            measurement.date.slice(5) + "-" + measurement.date.slice(0, 4)
          ).toDateString();
          return measurement;
        }),
      };
    case "ADD_MEASUREMENT":
      return {
        ...state,
        measurements: [...state.measurements, action.payload],
      };

    //-----------DEFAULT------------------
    default:
      return state;
  }
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    profile: {},
    workouts: [],
    trainer: {},
    measurements: [],
    exercises: [],
    notifications: [],
    customWorkouts: [],
  });

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
