import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { CircularProgress } from "@mui/material";
import { useProfile } from "../Store/Store";
const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const profile = useProfile((state) => state.profile);
  const persist = useProfile((state) => state.persist);

  useEffect(() => {
    //use refresh token to get a new accessToken
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (e) {
        console.log(e);
      } finally {

        isMounted && setIsLoading(false);
      }
    };
    //only hit the refresh route if the user does not have a accessToken
    !profile?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => isMounted = false;
    
  }, []);




  return (
    <>
    {!persist ? <Outlet/> : isLoading ? <CircularProgress/> : <Outlet/>}
        </>
  )
};

export default PersistLogin;