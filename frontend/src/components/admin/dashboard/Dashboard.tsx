import { useContext } from "react";
import { Aside } from "./Aside";
import { DashboardHeader } from "./DashboardHeader";

import "./Dashboard.scss";
import { DashboardMain } from "./DashboardMain";
import { DashboardRecentUpdates } from "./DashboardRecentUpdates";
import { DashboardContext } from "../../../contexts/DashboardProvider";

export const Dashboard = () => {
  const { darkMode } = useContext(DashboardContext);
  const darkModeStyles = darkMode ? "dark-theme-variables" : "";

  return (
    <div id="dashboard" className={darkModeStyles}>
      <div className="dashbard-container">
        <Aside />
        <DashboardMain />
        <div className="right">
          <DashboardHeader />
          <DashboardRecentUpdates />
        </div>
      </div>
    </div>
  );
};
