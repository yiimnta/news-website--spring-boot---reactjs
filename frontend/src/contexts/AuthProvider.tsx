import React, { useState, createContext } from "react";

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  roles: string[];
  accessToken: string;
};

export type IAuthContext = {
  auth: User;
  setAuth: React.Dispatch<React.SetStateAction<User>>;
};

export const AuthContext = createContext<IAuthContext>({
  auth: {
    firstname: "",
    lastname: "",
    email: "",
    roles: [],
    accessToken: "",
  },
  setAuth: () => {},
});

export const AuthProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const [auth, setAuth] = useState<User>({
    firstname: "",
    lastname: "",
    email: "",
    roles: [],
    accessToken: "",
  });

  const { children } = props;

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
