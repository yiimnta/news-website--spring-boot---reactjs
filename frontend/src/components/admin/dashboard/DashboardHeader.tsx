import { useContext } from "react";
import ListSharpIcon from "@mui/icons-material/ListSharp";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import { DashboardContext } from "../../../contexts/DashboardProvider";

export const DashboardHeader = () => {
  const { show, setShow, darkMode, setDarkMode } = useContext(DashboardContext);

  return (
    <div className="top">
      <button id="menu-btn" onClick={() => setShow(!show)}>
        <ListSharpIcon />
      </button>
      <div className="theme-toggler">
        <LightModeIcon
          className={!darkMode ? "active" : ""}
          onClick={() => setDarkMode(false)}
        />
        <NightlightIcon
          className={darkMode ? "active" : ""}
          onClick={() => setDarkMode(true)}
        />
      </div>
      <div className="profile">
        <div className="info">
          <p>
            Hey <b>Remu</b>
          </p>
          <small className="text-muted">Admin</small>
        </div>
        <div className="profile-photo">
          <img
            src="https://i1.sndcdn.com/avatars-000289170128-n70qq7-t500x500.jpg"
            alt="avatar"
          />
        </div>
      </div>
    </div>
  );
};
