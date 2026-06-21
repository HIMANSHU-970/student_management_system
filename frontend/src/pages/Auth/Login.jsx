import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(AuthContext);

  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. MASTER BYPASS (Admin) - dev/testing convenience
      if (form.email === "himanshu.kumar@adypu.edu.in" && form.password === "him970@") {
        performLoginSuccess({ name: "Himanshu Kumar", id: "ADMIN", token: "dummy_token" }, "admin");
        setLoading(false);
        return;
      }

      // 2. REAL BACKEND LOGIN (Student / Teacher / Admin sab isi se)
      const res = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password
      });

      if (res && res.data) {
        const { user, token } = res.data;
        performLoginSuccess({ ...user, token }, user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const performLoginSuccess = (user, userRole) => {
    localStorage.setItem("token", user.token || "dummy_token");
    localStorage.setItem("role", userRole.toLowerCase());
    localStorage.setItem("userName", user.name || "User");

    saveUser({ ...user, role: userRole.toLowerCase() });

    setTimeout(() => {
      const roleRoutes = { student: "/student", teacher: "/teacher", admin: "/admin" };
      navigate(roleRoutes[userRole.toLowerCase()] || "/", { replace: true });
    }, 100);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {["student", "teacher", "admin"].map((r) => (
            <button key={r} type="button" onClick={() => { setRole(r); setError(""); }}
              style={{ flex: 1, padding: "8px", background: role === r ? "#2563eb" : "#e2e8f0",
              color: role === r ? "white" : "black", border: "none", borderRadius: "5px", textTransform: "capitalize", cursor: "pointer" }}>
              {r}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "#ef4444", color: "white", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "0.85rem" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Enter Password" value={form.password} onChange={handleChange} required />
          <button type="submit" disabled={loading} style={{ cursor: "pointer", width: "100%", padding: "10px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", fontWeight: "bold" }}>
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;