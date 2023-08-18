import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";

export const DashboardMain = () => {
  return (
    <>
      <main>
        <DashboardHeader />
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="table-container">
          <Outlet />
        </div>
      </main>
    </>
  );
};
