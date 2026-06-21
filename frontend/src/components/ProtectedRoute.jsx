import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h3>Authenticating...</h3>;
  if (!user) return <Navigate to="/" replace />;

  const userRole = user.role?.toLowerCase();
  const requiredRole = role?.toLowerCase();

  // Role Check
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return children;
}

export default ProtectedRoute;