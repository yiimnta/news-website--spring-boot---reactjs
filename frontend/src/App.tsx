import "./App.css";
import Login from "./components/login/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/public/HomePage";
import NotFound from "./NotFound";
import UserManager from "./components/admin/users/UserManager";
import RequireAuth from "./components/RequireAuth";
import { DashboardPage } from "./components/admin/dashboard/DashboardPage";
import { PersistLogin } from "./components/PersistLogin";

const ROLES = {
  MOD: "ROLE_MOD",
  MEMBER: "ROLE_MEMBER",
  ADMIN: "ROLE_ADMIN",
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route element={<PersistLogin />}>
          <Route element={<DashboardPage />}>
            <Route path="/admin/users2" element={<UserManager />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/" element={<HomePage />} />
            <Route element={<DashboardPage />}>
              <Route path="/admin/users" element={<UserManager />} />
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
