import { useEffect } from "react";
import { PrivateAxios } from "../services/AxiosService";
import useAuth from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";

export const HTTPSTATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
};

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
        const prevRequest = error?.config;
        if (
          error?.response?.status === HTTPSTATUS_CODES.UNAUTHORIZED &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return PrivateAxios(prevRequest);
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
