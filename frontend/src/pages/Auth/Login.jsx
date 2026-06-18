import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(AuthContext);

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

    // 1. MASTER BYPASS
    if (form.email === "himanshu.kumar@adypu.edu.in" && form.password === "him970@") {
      const mockAdmin = { name: "Himanshu Kumar", role: "admin" };
      performLoginSuccess(mockAdmin, "local_dev_bypass_token");
      return;
    }

    // 2. REGISTRY SYNC
    const allUsers = JSON.parse(localStorage.getItem("system_users")) || [];
    const registeredUser = allUsers.find(
      (u) => u.email.toLowerCase() === form.email.trim().toLowerCase() && u.password === form.password
    );

    if (registeredUser) {
      performLoginSuccess(registeredUser, "registered_user_token");
      return;
    }

    // 3. REAL BACKEND API
    try {
      const res = await loginUser(form);
      performLoginSuccess(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Email or Password.");
      setLoading(false);
    }
  };

  // HELPER FUNCTION: Taaki redirection logic ek hi jagah rahe
  const performLoginSuccess = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("userName", user.name || "User");
    saveUser(user);

    const roleRoutes = {
      student: "/student",
      teacher: "/teacher", // Ab ye sahi se handle hoga
      admin: "/admin"
    };

    const targetRoute = roleRoutes[user.role] || "/";
    navigate(targetRoute);
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to Campus Quantum Enterprise</p>

        {error && <div className="error-box" style={{ background: "#ef4444", padding: "10px", color: "white", marginBottom: "10px" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Secure Login"}</button>
        </form>

        <p className="switch">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;