import axios from "./axios"
import useAuth from "./useAuth"



const useRefreshToken = () => {

    const { setAuth} = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', { 
            withCredentials: true
        });
        setAuth(prevstate => {
            console.log(JSON.stringify(prevstate));
            console.log(response.data.accessToken);
            return {...prev, accessToken: response.data.accessToken}
        });
        return response.data.accessToken;


    }



  return refresh;
}

export default useRefreshToken