import React from "react";

const StudentCourses = () => {
  // Pull dynamic synchronized courses from local storage
  const courses = JSON.parse(localStorage.getItem("global_courses")) || [];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#0f172a", fontWeight: "800", margin: 0 }}>📚 Registered Curriculum Subjects</h2>
        <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Aapke current semester ke approved subjects aur course details.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {courses.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>Admin ne abhi tak koi subjects allocate nahi kiye hain.</p>
        ) : (
          courses.map((c) => (
            <div key={c.id} style={courseCardStyle}>
              <span style={codeBadgeStyle}>{c.code || "SUB-NODE"}</span>
              <h3 style={{ fontSize: "1.2rem", margin: "10px 0 5px 0", color: "#1e293b", fontWeight: "800" }}>{c.name}</h3>
              
              <p style={{ margin: "0 0 12px 0", fontSize: "0.85rem", color: "#64748b" }}>
                Total Scope: <b>{c.totalClasses || 30} Lectures Scheduled</b>
              </p>

              {/* LIVE SYLLABUS TOPICS SYNC */}
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #f1f5f9", marginBottom: "15px" }}>
                <h5 style={{ margin: "0 0 6px 0", color: "#475569", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Syllabus Blueprint</h5>
                <ul style={{ margin: 0, paddingLeft: "15px", fontSize: "0.85rem", color: "#334155", lineHeight: "1.5" }}>
                  {c.topics && c.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                  {(!c.topics || c.topics.length === 0) && (
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>No active topics added yet by Admin.</span>
                  )}
                </ul>
              </div>

              <div style={statusBarStyle}>
                <div style={{ ...progressStyle, width: "100%" }}></div>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: "700" }}>● Core Curriculum Running</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styling Objects (Fixed the missing structural references)
const courseCardStyle = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 6px rgba(0,0,0,0.01)"
};

const codeBadgeStyle = {
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "0.75rem",
  fontWeight: "700",
  fontFamily: "monospace"
};

const statusBarStyle = {
  height: "6px",
  backgroundColor: "#e2e8f0",
  borderRadius: "4px",
  marginTop: "15px",
  marginBottom: "10px",
  overflow: "hidden"
};

const progressStyle = {
  height: "100%",
  backgroundColor: "#3b82f6"
};

export default StudentCourses;