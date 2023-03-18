import {axiosPrivate} from './axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { useProfile } from '../Store/Store';



const useAxiosPrivate = () => {

    const refresh = useRefreshToken();
    const accessToken = useProfile((state) => state.profile?.accessToken);
    let requestCount = 0;

    useEffect(() => {

        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                config.requestCount = requestCount++;
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = 'Bearer ' + accessToken;
                    // console.log('interceptor', config.headers['Authorization']);
                }
                return config;
            }, error => {
                Promise.reject(error);
                // console.log('interceptor error', error);
            }
        );


        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (err) => {
                const prevRequest = err?.config;
                //if we get a 403 and we have already tried 3 times, then we are not authorized stop calling the api!
                if (err?.config.requestCount > 3 && err.response?.status === 403) return ;

                // console.log('interceptor error', err);
                if (err.response?.status === 401 && !prevRequest?.sent) {
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

    },[accessToken, refresh])

  return axiosPrivate;
}

export default useAxiosPrivate