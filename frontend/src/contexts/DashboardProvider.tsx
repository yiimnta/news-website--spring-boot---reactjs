import React, { createContext, useState } from "react";

export type IDashboardContext = {
  show: boolean;
  darkMode: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashboardContext = createContext<IDashboardContext>({
  show: false,
  darkMode: false,
  setShow: () => {},
  setDarkMode: () => {},
});

export const DashboardProvider = (props: {
  children: React.ReactNode;
}): JSX.Element => {
  const { children } = props;
  const [show, setShow] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <DashboardContext.Provider value={{ show, setShow, darkMode, setDarkMode }}>
      {children}
    </DashboardContext.Provider>
  );
};
