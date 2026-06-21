import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceManager = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const assignments = JSON.parse(localStorage.getItem("teacher_assignments") || "{}");
  
  const [students] = useState([
    { id: "S001", name: "Rudransh", subject: "CS-301" },
    { id: "S002", name: "Himanshu", subject: "CS-303" }
  ]);

  // Role based filtering logic
  const myStudents = user.role === 'admin' 
    ? students 
    : students.filter(s => (assignments[user.id] || []).includes(s.subject));

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ fontSize: "1.75rem", color: "#1e293b" }}>
          {user.role === 'admin' ? "🏢 Admin Registry" : "👨‍🏫 My Assigned Classes"}
        </h2>
      </div>

      <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
          <thead>
            <tr style={{ color: "#64748b", textTransform: "uppercase", fontSize: "0.8rem" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Student Name</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Subject</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myStudents.map((s) => (
              <tr key={s.id} style={{ backgroundColor: "#fcfcfd" }}>
                <td style={{ padding: "15px", fontWeight: "600" }}>{s.name}</td>
                <td style={{ padding: "15px", color: "#475569" }}>{s.subject}</td>
                <td style={{ padding: "15px", textAlign: "right" }}>
                  <button 
                    onClick={() => navigate(`/${user.role}/attendance/${s.id}`)}
                    style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManager;