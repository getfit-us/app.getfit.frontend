import axios from "./axios"
import useAuth from "./useAuth"
import useProfile from "./useProfile";



const useRefreshToken = () => {

    const { setAuth} = useAuth();
    const {state, dispatch} = useProfile();

    const refresh = async () => {
        const response = await axios.get('/refresh', { 
            withCredentials: true
        });
        setAuth(prevstate => {
            // console.log(JSON.stringify(prevstate));
            // console.log(response.data.accessToken);
            return {...prevstate, 
                roles: response.data.roles,
                accessToken: response.data.accessToken}
        });

        dispatch({
            type: "SET_PROFILE",
            payload: response.data,
          });
          console.log(response.data);
      


    }



  return refresh;
}

export default useRefreshToken