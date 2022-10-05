import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

// hook that implements the jwt from axios private to use in multiple components and clean up the code with all the api calls
//takes in options object to specify url, method, and data object to post etc..
const useAxios = (options, controller) => {
  const axiosPrivate = useAxiosPrivate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    
    try {
      const response = axiosPrivate(options);
      setData(response.data);
      console.log(response.data);
    } catch (e) {
      setError(e);
      setLoading(false);
      console.log(e);
    }finally {
      
        setLoading(false);
    }
    return () => {
      controller.abort();
    };
  }, [options.method, options.url, options.data]);

  return { loading, error, data };
};

export default useAxios;
