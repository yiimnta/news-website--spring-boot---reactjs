import { PublicAxios } from "../services/AxiosService";
import useAuth from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await PublicAxios.get("/auth/refresh");
    setAuth((prev) => ({ ...prev, ...response.data }));
  };
  return refresh;
};
