import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useRefreshToken } from "../hooks/useRefreshToken";

export const PersistLogin = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();

  useEffect(() => {
    const getToken = async () => {
      try {
        return await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    !auth?.accessToken ? getToken() : setLoading(false);
  }, []);

  return <>{loading ? <div>Loading</div> : <Outlet />}</>;
};
