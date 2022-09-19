import {useEffect, useState} from 'react';


// right fetch with props to be reused .. 


const useFetch = (url, options) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const doFetch = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, options);
        const json = await res.json();
        if (!signal.aborted) {
         setData(json);
        }
      } catch (e) {
        if (!signal.aborted) {
          setError(e);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    doFetch();
    return () => {
      abortController.abort();
    };
  }, []);
  return { data, error, loading };
};
export default useFetch;