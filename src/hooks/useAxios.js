import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useProfile from "./useProfile";

// hook that implements the jwt from axios private to use in multiple components and clean up the code with all the api calls
//takes in options object to specify url, method, and data object to post etc..
const useAxios = (options) => {
  const axiosPrivate = useAxiosPrivate();
  const { state, dispatch } = useProfile();
  const controllerRef = useRef(new AbortController());

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    let isMounted = true;

    const callApi = async () => {
      setLoading(true);
      dispatch({
        type: "SET_STATUS",
        payload: { loading: true, error: false },
      });
      try {
        const response = await axiosPrivate.request({
          data: options.payload ? options.payload : undefined,
          url: options.url,
          method: options.method,
          signal: controllerRef.current.signal,
        });
        setData(response.data);
        if (options.type) dispatch({ type: options.type, payload: response.data });

        dispatch({
          type: "SET_STATUS",
          payload: { loading: false, error: false },
        });
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
        dispatch({
          type: "SET_STATUS",
          payload: { loading: false, error: e.message },
        });

        console.log(e);
      } 
    };

    callApi();
    return () => {
      controllerRef.current.abort();
    };
  }, []);

  return { loading, error, data };
};

export default useAxios;
