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

export const Aside = () => {
  const { show, setShow } = useContext(DashboardContext);
  const [showXButton, setShowXButton] = useState(false);

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

      <div className="sidebar">
        <a href="#" className="active">
          <GridViewSharpIcon />
          <h3>Dashboard</h3>
        </a>
        <a href="#">
          <Person4SharpIcon />
          <h3>Users</h3>
        </a>
        <a href="#">
          <NewspaperIcon />
          <h3>News</h3>
        </a>
        <a href="#">
          <ContactsIcon />
          <h3>Contacts</h3>
        </a>
        <a href="#">
          <Person4SharpIcon />
          <h3>SettingsIcon</h3>
        </a>
      </div>
      <a href="#" className="logout-btn">
        <LogoutSharpIcon />
        <h3>Logout</h3>
      </a>
    </aside>
  );
};
