//going to convert context to zustand store


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
        clients: [],
        newWorkout:{},
        manageWorkout: [],
        calendar: [],
        status: {},
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
          firstName: action.payload.firstname,
          lastName: action.payload.lastname,
          goals: action.payload.goals,
          phone: action.payload.phone,
          age: action.payload.age,
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
      return { ...state, profile: { ...state.profile, goals: action.payload } };
    //----------------------- COMPLETED WORKOUTS ------------------------------------ not custom workout routines
    case "SET_COMPLETED_WORKOUTS":
      return { ...state, completedWorkouts: action.payload };

    case "ADD_COMPLETED_WORKOUT":
      return {
        ...state,

        completedWorkouts: [...state.completedWorkouts, action.payload],
      };

    //------------------Custom Workouts ----(workouts the user Created)--------------------------------------------

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

        customWorkouts: state.customWorkouts.map((workout) =>
        workout._id === action.payload._id ? action.payload : workout),
      };


      case "DELETE_CUSTOM_WORKOUT":
        
        return {
          ...state,
          customWorkouts: state.customWorkouts.filter(
            (workout) => workout._id !== action.payload._id
          ),
        };
    //=------Trainer-assigned custom workouts ---------------
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


    //-----------------Clients--------------------------------

    case "SET_CLIENTS":
      //replaces the clients object with the new one

      return {
        ...state,
        clients: action.payload,
      };

      case "UPDATE_CLIENT":
        //replaces the clients object with the new one
  
        return {
          ...state,
          clients: state.clients.map((client) =>  client._id === action.payload._id ? action.payload : client )
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

    // need to check if 
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: state.notifications.length === action.payload.length  ? state.notifications : action.payload,
      };
      case "DELETE_NOTIFICATION":
        return {
          ...state,
          notifications: state.notifications.filter((notification) => notification._id !== action.payload._id),
        };
        case "UPDATE_NOTIFICATION":
          return {
            ...state,
            notifications: state.notifications.map((notification) =>
            notification._id === action.payload._id ? action.payload : notification
            ),
          };
    
 
     //---newworkout-----
     case "NEW_WORKOUT": 
     return {
       ...state,
        newWorkout: action.payload,
     }

     case "MANAGE_WORKOUT":
      return {
       ...state,
        manageWorkout: action.payload,
      }
    //------------------Calendar------------
    case "SET_CALENDAR":
      return {
       ...state,
        calendar: action.payload,
      };

      case "ADD_CALENDAR_EVENT":
        return {
         ...state,
         calendar: [...state.calendar, action.payload],
        }

    case "DELETE_CALENDAR_EVENT":
      return {
       ...state,
       calendar: state.calendar.filter((calendar) => calendar._id!== action.payload)
      }





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
    clients: [],
    newWorkout:{},
    manageWorkout: [],
    calendar: [],
    status: {},





  });

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
