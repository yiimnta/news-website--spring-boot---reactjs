import { useContext } from "react";
import { Aside } from "./Aside";

import "./Dashboard.scss";
import { DashboardMain } from "./DashboardMain";
import { DashboardContext } from "../../../contexts/DashboardProvider";

export const Dashboard = () => {
  const { darkMode } = useContext(DashboardContext);
  const darkModeStyles = darkMode ? "dark-theme-variables" : "";

  return (
    <div id="dashboard" className={darkModeStyles}>
      <div className="dashbard-container">
        <Aside />
        <DashboardMain />
        {/* <div className="right">
          <DashboardRecentUpdates />
        </div> */}
      </div>
    </div>
  );
};
