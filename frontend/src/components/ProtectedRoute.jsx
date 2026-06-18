import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  // 🔥 while checking auth state
  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }

  // 🔥 not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // 🔥 role mismatch protection
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;