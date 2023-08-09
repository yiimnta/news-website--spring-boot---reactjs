import AuthService from "../services/AuthService";
import useAuth from "./useAuth";

export const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();
  const refresh = async () => {
    const response = await AuthService.refresh(auth.accessToken);
    setAuth((prev) => ({ ...prev, accessToken: response.data.accessToken }));
  };
  return refresh;
};
