import {axiosPrivate} from './axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { useProfile } from '../Store/Store';



const useAxiosPrivate = () => {

    const refresh = useRefreshToken();
    const profile = useProfile((state) => state.profile);

    useEffect(() => {

        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = 'Bearer ' + profile?.accessToken;
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
                if (err.response?.status === 403 && !prevRequest?.sent) {
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

    },[profile.accessToken, refresh])

  return axiosPrivate;
}

export default useAxiosPrivate