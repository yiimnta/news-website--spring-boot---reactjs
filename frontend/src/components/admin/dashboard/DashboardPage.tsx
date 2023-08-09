import { DashboardProvider } from "../../../contexts/DashboardProvider";
import { Dashboard } from "./Dashboard";

export const DashboardPage = () => {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
};
