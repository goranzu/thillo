import { Global } from "@emotion/react";
import { Switch, Route } from "react-router-dom";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";
import Dashboard from "./screens/Dashboard";
import { globalStyles } from "./styles/global";
import { useAuth } from "./context/AuthContext";

function App() {
  const authContext = useAuth();

  if (authContext.isLoading || authContext.isIdle) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Global styles={globalStyles} />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/reset-password/:token">
          <ResetPassword />
        </Route>
        <ProtectedRoute path="/dashboard">
          <Dashboard />
        </ProtectedRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default App;
