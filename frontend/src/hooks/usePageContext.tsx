import { useContext } from "react";
import { PageContext } from "../contexts/PageProvider";

const usePageContext = () => {
  return useContext(PageContext);
};

export default usePageContext;
