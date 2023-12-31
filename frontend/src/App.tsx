import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "react-toastify/dist/ReactToastify.css";

import Login from "./components/login/Login";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/public/HomePage";
import NotFound from "./NotFound";
import NewsManager from "./components/admin/news/NewsManager";
import RequireAuth from "./components/RequireAuth";
import { DashboardPage } from "./components/admin/dashboard/DashboardPage";
import { PersistLogin } from "./components/PersistLogin";
import UserManager from "./components/admin/users/UserManager";
import { ROLES } from "./Constants";
import { ToastContainer } from "react-toastify";
import { Greeting } from "./components/admin/greeting/Greeting";
import { Settings } from "./components/admin/settings/Settings";
import { EmailVerification } from "./components/EmailVerification";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<EmailVerification />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<PersistLogin />}>
          <Route path="/" element={<HomePage />} />
          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.ROLE_ADMIN, ROLES.ROLE_MOD]} />
            }
          >
            <Route element={<DashboardPage />}>
              <Route path="/admin/" element={<Greeting />} />
              <Route path="/admin/news" element={<NewsManager />} />
              <Route
                element={<RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]} />}
              >
                <Route path="/admin/users" element={<UserManager />} />
              </Route>
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
