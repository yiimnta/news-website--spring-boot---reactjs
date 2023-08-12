import { PublicAxios } from "../services/AxiosService";
import useAuth from "./useAuth";

export const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    const response = await PublicAxios.get("/auth/refresh");
    console.log(response);
    setAuth((prev) => ({ ...prev, ...response.data }));
    console.log(auth);
  };
  return refresh;
};
