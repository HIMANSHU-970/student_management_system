import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../services/authService";
import "../../styles/auth.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Initial default role sirf student rahega
    roll_no: "",
    department: "",
    semester: "",
    designation: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Security Guardrail: Extra safety layer agar koi postman ya console se admin bypass karne ki koshish kare
    if (form.role === "admin") {
      alert("❌ Critical Error: Admin account creation via public registration form is strictly prohibited.");
      return;
    }

    try {
      await signupUser(form);
      alert("Signup Successful 🚀 Welcome to the Campus Network.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p>Join Student Management System</p>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />

          {/* 🎭 DROPDOWN: REGISTER OPTIONS (Admin option has been securely decoupled) */}
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "5px" }}>
              Select Campus Portal Role
            </label>
            <select 
              name="role" 
              value={form.role} 
              onChange={handleChange} 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", boxSizing: "border-box", fontSize: "14px" }}
            >
              <option value="student">Student Portal 🎓</option>
              <option value="teacher">Faculty Teacher 👨‍🏫</option>
            </select>
          </div>

          {/* 🎓 STUDENT COMPLIANCE FIELDS */}
          {form.role === "student" && (
            <>
              <input
                name="roll_no"
                value={form.roll_no}
                placeholder="Roll No"
                onChange={handleChange}
                required
              />
              <input
                name="department"
                value={form.department}
                placeholder="Department (e.g. CSE)"
                onChange={handleChange}
                required
              />
              <input
                name="semester"
                value={form.semester}
                placeholder="Semester"
                onChange={handleChange}
                required
              />
            </>
          )}

          {/* 👨‍🏫 TEACHER COMPLIANCE FIELDS */}
          {form.role === "teacher" && (
            <>
              <input
                name="designation"
                value={form.designation}
                placeholder="Designation (e.g. Assistant Professor)"
                onChange={handleChange}
                required
              />
              <input
                name="department"
                value={form.department}
                placeholder="Department"
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit">Signup & Request Access</button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;