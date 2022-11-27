import { useProfile } from "../Store/Store";
import axios from "./axios"




const useRefreshToken = () => {
 const setProfile= useProfile((state) => state.setProfile);


    const refresh = async () => {
        const response = await axios.get('/refresh', { 
            withCredentials: true
        });
      setProfile(response.data);
      return response.data.accessToken;
      


    }



  return refresh;
}

export default useRefreshToken