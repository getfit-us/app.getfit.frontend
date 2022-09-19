import { useEffect, useState } from 'react';
import axios from '../utils/axios';


const useAxios =  (url, options) => {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);
        const response =  axios(url, options)
            .then((response) => {

                console.log(response.data)
                return response.data;
            })
            .catch(err => {
                if (err.response) {
                    // Request made and server responded

                    const { status, config } = err.response;

                    if (status === 404) {
                        console.log(`${config.url} not found`);
                    }
                    if (status === 500) {
                        console.log("Server error");
                    }
                    else if (err.request) {
                        // Request made but no response from server
                        console.log("Error", err.message);
                    } else {
                        // some other errors
                        console.log("Error", err.message);
                    }
                    setError(err.message, err.response); }
                })
            .finally(() => { isMounted && setLoading(false) });
        return () => { isMounted = false };
            

}, [url, options]);



return { loading, error, data };
};

export default useAxios;