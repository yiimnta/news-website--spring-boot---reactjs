import { useEffect, useState } from "react";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import GridViewSharpIcon from "@mui/icons-material/GridViewSharp";
import Person4SharpIcon from "@mui/icons-material/Person4Sharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ContactsIcon from "@mui/icons-material/Contacts";
import SettingsIcon from "@mui/icons-material/Settings";
import { useContext } from "react";
import { DashboardContext } from "../../../contexts/DashboardProvider";
import { DashboardDate } from "./DashboardDate";
import { usePrivateAxios } from "../../../hooks/usePrivateAxios";
import { useToastify } from "../../../hooks/useToastify";
import { NavLink, useNavigate } from "react-router-dom";

type NavObject = {
  url: string;
  name: string;
  icon: React.ReactNode;
};
const navList: NavObject[] = [
  {
    url: "/admin/",
    name: "Dashboard",
    icon: <GridViewSharpIcon />,
  },
  {
    url: "/admin/users",
    name: "Users",
    icon: <Person4SharpIcon />,
  },
  {
    url: "/admin/news",
    name: "News",
    icon: <NewspaperIcon />,
  },
  {
    url: "/admin/settings",
    name: "Settings",
    icon: <SettingsIcon />,
  },
];

export const Aside = () => {
  const { show, setShow } = useContext(DashboardContext);
  const [showXButton, setShowXButton] = useState(false);
  const privateAxios = usePrivateAxios();
  const toastify = useToastify();
  const navigate = useNavigate();

  const styles = show ? { display: "block" } : { display: "none" };

  useEffect(() => {
    const handleWindowResize = () => {
      if (!show && window.innerWidth >= 1200) {
        setShow(true);
      }

      setShowXButton(window.innerWidth <= 1200);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [setShow, show]);

  useEffect(() => {
    if (!show && window.innerWidth >= 1200) {
      setShow(true);
    }

    setShowXButton(window.innerWidth <= 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    privateAxios
      .get("/auth/logout")
      .then(() => {
        toastify.success("Logging out successfully!");
        navigate("/login");
      })
      .catch((error) => {
        toastify.error("Opps, something wrong when logging out!");
        console.log(error);
      });
  };

  return (
    <aside style={styles}>
      <div className="top">
        <div className="logo">
          <img src="/logo.jpg" alt="logo" />
          <h2 className="text-muted">News CMS</h2>
        </div>
        {showXButton && (
          <div className="close" id="close-btn" onClick={() => setShow(false)}>
            <ClearSharpIcon />
          </div>
        )}
      </div>
      <DashboardDate />
      <div className="sidebar">
        {navList.map((nav) => {
          return (
            <NavLink
              key={nav.url}
              to={nav.url}
              className={(navData) => (navData.isActive ? "active" : "")}
            >
              {nav.icon}
              <h3>{nav.name}</h3>
            </NavLink>
          );
        })}
      </div>
      <a href="#" className="logout-btn" onClick={handleLogout}>
        <LogoutSharpIcon />
        <h3>Logout</h3>
      </a>
    </aside>
  );
};
