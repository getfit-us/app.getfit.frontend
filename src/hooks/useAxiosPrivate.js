import {axiosPrivate} from './axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';




const useAxiosPrivate = () => {

    const refresh = useRefreshToken();
    const { auth } = useAuth();


    useEffect(() => {

        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = 'Bearer ' + auth?.accessToken;
                }
                return config;
            }, error => {
                Promise.reject(error);
            }
        );


        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (err) => {
                const prevRequest = err?.config;
                if (err.response.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
                    return axiosPrivate(prevRequest);

                }
                return Promise.reject(err);

            }
        )

        return () => {
            axiosPrivate.interceptors.response.eject(responseInterceptor);
            axiosPrivate.interceptors.request.eject(requestInterceptor);

            //remove prev interceptor
        }

    },[auth, refresh])

  return axiosPrivate;
}

export default useAxiosPrivate