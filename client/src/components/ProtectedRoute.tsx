import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  ...rest
}: {
  children: React.ReactNode;
  path: string;
}) {
  const authContext = useAuth();
  return authContext.authState.isAuthenticated ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Redirect to="/" />
  );
}

export default ProtectedRoute;
