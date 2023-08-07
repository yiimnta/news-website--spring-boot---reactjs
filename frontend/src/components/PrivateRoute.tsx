import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = (props: { children: React.ReactNode }): JSX.Element => {
  const isLoggedIn = localStorage.getItem("logged_user") !== null;
  const { children } = props;

  return isLoggedIn ? (
    <> {children}</>
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default PrivateRoute;
