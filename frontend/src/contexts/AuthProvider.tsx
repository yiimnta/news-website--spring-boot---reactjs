import React, { useState, createContext } from "react";
import { AuthUser } from "../Constants";

export type IAuthContext = {
  auth: AuthUser;
  setAuth: React.Dispatch<React.SetStateAction<AuthUser>>;
};

export const AuthContext = createContext<IAuthContext>({
  auth: {
    firstname: "",
    lastname: "",
    email: "",
    roles: [],
    accessToken: "",
    avatar: "",
  },
  setAuth: () => {},
});

export const AuthProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const [auth, setAuth] = useState<AuthUser>({
    firstname: "",
    lastname: "",
    email: "",
    roles: [],
    accessToken: "",
    avatar: "",
  });

  const { children } = props;

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
