import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authState } = useAuth();
  console.log(authState);
  const location = useLocation();
  if (!authState.isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }
  return children;
}

export default RequireAuth;
