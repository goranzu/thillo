import { Global } from "@emotion/react";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Register from "./screens/Register";
import Signin from "./screens/Signin";
import NotFound from "./components/NotFound";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import { globalStyles } from "./styles/global";
import Dashboard from "./screens/Dashboard";
import RequireAuth from "./components/RequireAuth";

function App() {
  //   const authContext = useAuth();

  //   if (authContext.isLoading || authContext.isIdle) {
  //     return <p>Loading...</p>;
  //   }

  return (
    <>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
