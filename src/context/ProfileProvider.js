import { createContext, useReducer } from "react";


const ProfileContext = createContext();

export const reducer = (state, action) => {

    switch (action.type) {
        //replaces the profile object with the new one
        case 'SET_PROFILE':
            return {
                ...state,
                profile: action.payload
            };
        //updates the profile object by spreading the rest of the properties and only updating the avatar property.
        case 'UPDATE_PROFILE_IMAGE':
            return {
                ...state, profile: { ...state.profile, avatar: action.payload }

            };


        //updates the profile object by spreading the rest of the properties and only updating the goal property.

        case 'UPDATE_GOALS':
            return { ...state, profile: { ...state.profile, goal: action.payload } };

        case 'SET_WORKOUTS':
            return { ...state, workouts: action.payload };

        case 'ADD_WORKOUT':
            return {
                ...state,

                workouts: [...state.workouts, action.payload]
            };

        case 'SET_TRAINER':
            //replaces the trainer object with the new one

            return {
                ...state,
                trainer: action.payload
            };
        case 'SET_EXERCISES':
            return {
                ...state,
                exercises: action.payload
            }

        case 'SET_MEASUREMENTS': return {
            ...state,
            measurements: action.payload

        }
        case 'ADD_MEASUREMENT': return {
            ...state,
            measurements: [...state.measurements, action.payload]

        }

        default:
            return state;


    }

}


export const ProfileProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, {
        profile: {},
        workouts: [],
        trainer: {},
        measurements: [],
        exercises: {}




    })

    return (
        <ProfileContext.Provider value={{ state, dispatch }} >

            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;