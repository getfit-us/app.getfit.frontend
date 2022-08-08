import { createContext, useReducer } from "react";
import { Outlet } from "react-router-dom";


const ProfileContext = createContext();

export const reducer = (state, action) => {

    switch (action.type) {

        case 'UPDATE_PROFILE':
            return { ...state.profile + action.payload };

        case 'SET_GOALS':
            return { goal: action.payload };

        case 'ADD_WORKOUT': 
            return {
                workouts: [action.payload, ...state.workouts]
            }



        default:
            return state;


    }

}


export const ProfileProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, {
        profile:"test",
        workouts: 'workout 1'


    })

    return (
        <ProfileContext.Provider value={{ state, dispatch }} >
           
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext;