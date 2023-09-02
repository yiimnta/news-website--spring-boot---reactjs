import { useContext } from "react";
import { DashboardContext } from "../contexts/DashboardProvider";

const useDashboardContext = () => {
  return useContext(DashboardContext);
};

export default useDashboardContext;
