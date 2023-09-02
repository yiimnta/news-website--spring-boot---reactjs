import React, { createContext, useState } from "react";

export type IPageContext = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const PageContext = createContext<IPageContext>({
  title: "Title",
  setTitle: () => {},
});

export const PageProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [title, setTitle] = useState("Title");

  return (
    <PageContext.Provider value={{ title, setTitle }}>
      {children}
    </PageContext.Provider>
  );
};
