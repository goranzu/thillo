import { Global } from "@emotion/react";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import NotFound from "./components/NotFound";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import { globalStyles } from "./styles/global";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./screens/Dashboard";

function App() {
  //   const authContext = useAuth();

  //   if (authContext.isLoading || authContext.isIdle) {
  //     return <p>Loading...</p>;
  //   }

  return (
    <>
      <Global styles={globalStyles} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route index element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
