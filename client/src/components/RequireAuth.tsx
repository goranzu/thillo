import { useLocation, Navigate } from "react-router-dom";

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const authenticated = false;
  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }
  return children;
}

export default RequireAuth;
