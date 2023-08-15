import { useContext } from "react";
import ListSharpIcon from "@mui/icons-material/ListSharp";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import { DashboardContext } from "../../../contexts/DashboardProvider";
import useAuth from "../../../hooks/useAuth";
import { ROLES } from "../../../Constants";

export const DashboardHeader = () => {
  const { show, setShow, darkMode, setDarkMode } = useContext(DashboardContext);
  const { auth } = useAuth();

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
            <b>{auth && auth.firstname + " " + auth.lastname}</b>
          </p>
          <small className="text-muted">
            {auth && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.2rem",
                }}
              >
                {auth.roles.map((e, index) => {
                  if (ROLES[e.name]) {
                    return (
                      <span className="role" key={index}>
                        <span
                          className="circle"
                          style={{ background: `${e.color}` }}
                        ></span>{" "}
                        {ROLES[e.name]}
                      </span>
                    );
                  }
                  return "";
                })}
              </div>
            )}
          </small>
        </div>
        <div className="profile-photo">
          <img src={auth.avatar} alt="avatar" />
        </div>
      </div>
    </div>
  );
};
