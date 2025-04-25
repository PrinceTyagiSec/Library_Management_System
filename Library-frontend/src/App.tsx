import { Route, Routes } from "react-router-dom";
import Home from "./components/HomePage";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import "./index.css";
import ResetPassword from "./components/ResetPassword";
import RegisterForm from "./components/LoginForm";
import Layout from "@/components/Layout";
import ForgotPassword from "./components/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResendVerification from "./components/ResendVerification";
import { AuthProvider } from "./context/AuthContext"; 
import PrivateRoute from "./components/PrivateRoute";
import NotFound404 from "@/components/NotFound404";

const App = () => {
  return (
    <AuthProvider>
      {" "}
      {/*AuthProvider wraps the whole app */}
      <Layout>
        {" "}
        <ToastContainer />
        <Routes>
        <Route path="*" element={<NotFound404 />} />
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<PrivateRoute allowedRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route element={<PrivateRoute allowedRole="user" />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;
