import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const role = (localStorage.getItem("role") || "admin").toLowerCase(); 
  const userName = localStorage.getItem("userName") || "Himanshu Kumar";
  const savedAvatar = localStorage.getItem(`${role}_avatar`) || "";

  const handleLogout = () => {
    // FIX: Poora storage clear nahi karna hai, sirf session keys hataiye
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    // teacher_registry ko nahi hataya hai taaki data save rahe
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#ffffff" : "#94a3b8",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: isActive(path) ? "#2563eb" : "transparent",
    transition: "all 0.2s ease-in-out",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginBottom: "4px"
  });

  const categoryHeaderStyle = { 
    fontSize: "0.65rem", color: "#475569", fontWeight: "800", 
    letterSpacing: "1px", marginTop: "14px", marginBottom: "6px", paddingLeft: "8px",
    textTransform: "uppercase" 
  };

  return (
    <div style={{
      width: "280px", height: "100vh", backgroundColor: "#0f172a",
      color: "white", position: "fixed", top: 0, left: 0, padding: "24px 16px",
      display: "flex", flexDirection: "column", boxSizing: "border-box",
      borderRight: "1px solid #1e293b", zIndex: 100, overflowY: "auto"
    }}>
      
      {/* BRAND */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px", paddingLeft: "8px" }}>
        <div style={{ backgroundColor: "#2563eb", padding: "8px", borderRadius: "8px", fontSize: "1.2rem" }}>🏰</div>
        <div>
          <h2 style={{ fontSize: "1.05rem", fontWeight: "800", margin: 0, letterSpacing: "0.5px" }}>CAMPUS QUANTUM</h2>
          <span style={{ fontSize: "0.65rem", color: "#38bdf8", fontWeight: "700" }}>v2.4 Enterprise</span>
        </div>
      </div>

      {/* PROFILE */}
      <div style={{ backgroundColor: "#1e293b", padding: "12px", borderRadius: "10px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "0.9rem" }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#e2e8f0" }}>{userName}</div>
          <div style={{ fontSize: "0.7rem", color: "#10b981", textTransform: "uppercase", fontWeight: "800" }}>{role} Node</div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {role === "admin" && (
          <>
            <div style={categoryHeaderStyle}>ADMIN CORE HUB</div>
            <Link to="/admin" style={linkStyle("/admin")}>🛡️ Workspace Dashboard</Link>
            
            <div style={categoryHeaderStyle}>MANAGEMENT ENGINES</div>
            <Link to="/admin/subjects" style={linkStyle("/admin/subjects")}>📚 Subject Management</Link>
            <Link to="/admin/timetable" style={linkStyle("/admin/timetable")}>📅 Time Table Scheduler</Link>
            <Link to="/admin/attendance" style={linkStyle("/admin/attendance")}>📊 Attendance Controls</Link>
            <Link to="/admin/assign-teacher" style={linkStyle("/admin/assign-teacher")}>👨‍🏫 Assign Teachers</Link>
            <Link to="/admin/fees" style={linkStyle("/admin/fees")}>💳 Fee Management</Link>
            
            <div style={categoryHeaderStyle}>ACADEMIC INTEGRATIONS</div>
            <Link to="/admin/quizzes" style={linkStyle("/admin/quizzes")}>📝 Quiz Manager</Link>
            <Link to="/admin/assignments" style={linkStyle("/admin/assignments")}>📂 Assignments Hub</Link>
            <Link to="/admin/broadcasts" style={linkStyle("/admin/broadcasts")}>📢 Central Broadcasts</Link>

            <div style={categoryHeaderStyle}>REGISTRY & AUDITS</div>
            <Link to="/admin/students" style={linkStyle("/admin/students")}>🧑‍🎓 Student Registry</Link>
            <Link to="/admin/ledger-override" style={linkStyle("/admin/ledger-override")}>⚙️ Granular Ledger Override</Link>
          </>
        )}

        {role === "teacher" && (
          <>
            <div style={categoryHeaderStyle}>TEACHER HUB</div>
            <Link to="/teacher" style={linkStyle("/teacher")}>🖥️ Teacher Dashboard</Link>
            <Link to="/teacher/timetable" style={linkStyle("/teacher/timetable")}>🕒 View Time Table</Link>
            <Link to="/teacher/attendance" style={linkStyle("/teacher/attendance")}>📊 Mark Attendance</Link>
            <Link to="/teacher/assignments" style={linkStyle("/teacher/assignments")}>📂 Assignment Manager</Link>
            <Link to="/teacher/quizzes" style={linkStyle("/teacher/quizzes")}>📝 Quiz Manager</Link>
            <Link to="/teacher/notices" style={linkStyle("/teacher/notices")}>📢 Notice Board</Link>
          </>
        )}

        {role === "student" && (
          <>
            <div style={categoryHeaderStyle}>STUDENT HUB</div>
            <Link to="/student" style={linkStyle("/student")}>🖥️ Dashboard</Link>
            <Link to="/student/attendance" style={linkStyle("/student/attendance")}>📊 Attendance</Link>
            <Link to="/student/timetable" style={linkStyle("/student/timetable")}>🕒 Class Schedule</Link>
            <Link to="/student/quizzes" style={linkStyle("/student/quizzes")}>📝 Take Quiz</Link>
            <Link to="/student/assignments" style={linkStyle("/student/assignments")}>📂 Submit Assignments</Link>
            <Link to="/student/fees" style={linkStyle("/student/fees")}>💳 Fees & Invoices</Link>
            <Link to="/student/notices" style={linkStyle("/student/notices")}>📢 Notices</Link>
          </>
        )}
      </nav>

      <div style={{ paddingTop: "15px", borderTop: "1px solid #1e293b" }}>
        <button onClick={handleLogout} style={{
          backgroundColor: "#ef4444", color: "white", border: "none",
          padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "700",
          width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontSize: "0.9rem"
        }}>
          🚪 De-authenticate
        </button>
      </div>
    </div>
  );
};

export default Sidebar;