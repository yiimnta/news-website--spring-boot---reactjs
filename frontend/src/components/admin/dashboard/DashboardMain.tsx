import { Outlet } from "react-router-dom";
import { DashboardDate } from "./DashboardDate";

export const DashboardMain = () => {
  return (
    <main>
      <h1>Dashboard</h1>
      <DashboardDate />
      <div className="table-container">
        <Outlet />
      </div>
    </main>
  );
};
