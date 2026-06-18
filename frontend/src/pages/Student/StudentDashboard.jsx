import React from "react";

const StudentDashboard = () => {
  const currentStuId = "STU-101"; 
  
  const students = JSON.parse(localStorage.getItem("global_students")) || [];
  const profile = students.find(s => s.id === currentStuId) || { name: "Himanshu Kumar", section: "Section A", feeStatus: "Paid" };

  const timetable = JSON.parse(localStorage.getItem("global_timetable")) || [];
  const myRoutine = timetable.filter(t => t.section === profile.section);

  const ledger = JSON.parse(localStorage.getItem("global_attendance_ledger")) || {};
  const courses = JSON.parse(localStorage.getItem("global_courses")) || [];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#1e3a8a", padding: "30px", borderRadius: "16px", color: "white", marginBottom: "30px" }}>
        <h2>Welcome Back, {profile.name}!</h2>
        <p style={{ opacity: 0.9 }}>System ID: {profile.id} | Allocated Cluster: <b>{profile.section}</b></p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
        
        {/* TIME TABLE VIEW */}
        <div style={panelCard}>
          <h3>📅 Your Section Schedule Today</h3>
          {myRoutine.length === 0 ? <p style={{ color: "#94a3b8" }}>No classes scheduled for your block by the deployment unit.</p> : (
            myRoutine.map(r => (
              <div key={r.id} style={{ padding: "12px", borderLeft: "4px solid #3b82f6", backgroundColor: "#f8fafc", margin: "10px 0", borderRadius: "0 8px 8px 0" }}>
                <span style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: "700" }}>{r.time} ({r.day})</span>
                <h4 style={{ margin: "4px 0" }}>{r.subject}</h4>
                <small style={{ color: "#64748b" }}>Instructor: {r.instructor}</small>
              </div>
            ))
          )}
        </div>

        {/* METRICS VIEW */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* FEES CARD STATUS */}
          <div style={{ ...panelCard, borderTop: `4px solid ${profile.feeStatus === "Paid" ? "#10b981" : "#ef4444"}` }}>
            <h3>💳 Account Ledger Invoice</h3>
            <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem" }}>Status declared by Accountant Node:</p>
            <span style={{ display: "inline-block", marginTop: "5px", padding: "4px 12px", backgroundColor: profile.feeStatus === "Paid" ? "#e6fbf1" : "#fdf2f2", color: profile.feeStatus === "Paid" ? "#10b981" : "#ef4444", borderRadius: "20px", fontWeight: "800", fontSize: "0.85rem" }}>
              {profile.feeStatus}
            </span>
          </div>

          {/* COMPLIANCE ATTENDANCE */}
          <div style={panelCard}>
            <h3>📊 Verified Attendance</h3>
            {courses.map(c => {
              const score = ledger[`${currentStuId}_${c.code}`] || { attended: 0, total: 30 };
              const percent = score.total > 0 ? Math.round((score.attended / score.total) * 100) : 0;
              return (
                <div key={c.code} style={{ margin: "8px 0", fontSize: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{c.code}</span>
                    <b>{score.attended}/{score.total} ({percent}%)</b>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

// 🛠️ Missing panelCard Object Jo Error de rha tha:
const panelCard = { 
  backgroundColor: "white", 
  padding: "24px", 
  borderRadius: "12px", 
  border: "1px solid #e2e8f0", 
  boxShadow: "0 2px 4px rgba(0,0,0,0.02)" 
};

export default StudentDashboard;