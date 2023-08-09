import { useEffect } from "react";
import { PrivateAxios } from "../services/AxiosService";
import useAuth from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";

export const usePrivateAxios = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = PrivateAxios.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
      }
      return config;
    });

    const responseIntercept = PrivateAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config;
        if (error?.response?.status === 403 && !previousRequest?.sent) {
          previousRequest.sent = true;
          const newAccessToken = await refresh();
          previousRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return previousRequest;
        }
        return Promise.reject(error);
      }
    );

    return () => {
      PrivateAxios.interceptors.request.eject(requestIntercept);
      PrivateAxios.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return PrivateAxios;
};
