import React, { createContext, useState } from "react";

export type IDashboardContext = {
  show: boolean;
  darkMode: boolean;
  loading: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  admin_id: number;
};

export const DashboardContext = createContext<IDashboardContext>({
  show: false,
  darkMode: false,
  loading: false,
  setShow: () => {},
  setDarkMode: () => {},
  setLoading: () => {},
  admin_id: 0,
});

export const DashboardProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const { children } = props;
  const [show, setShow] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <DashboardContext.Provider
      value={{
        show,
        setShow,
        darkMode,
        setDarkMode,
        loading,
        setLoading,
        admin_id: import.meta.env.VITE_WEBSITE_ADMIN_ID,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
