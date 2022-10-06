import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useProfile from "./useProfile";

// hook that implements the jwt from axios private to use in multiple components and clean up the code with all the api calls
//takes in options object to specify url, method, and data object to post etc..
const useAxios = (options, controller, type) => {
  const axiosPrivate = useAxiosPrivate();
  const {state, dispatch } = useProfile();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const callApi = async () => {
      setLoading(true);

      try {
        const response = await axiosPrivate(options);
        setData(response.data);
        if (type)  dispatch({ type: type, payload: response.data });
       
        // console.log(response.data);
      } catch (e) {
        setError(e);
        setLoading(false);
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    callApi();
    return () => {
      controller.abort();
    };
  }, []);

  return { loading, error, data };
};

export default useAxios;
