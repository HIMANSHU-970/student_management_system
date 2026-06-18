import React, { useState, useEffect } from "react";

const TeacherDashboard = () => {
  const [studentsAttendance, setStudentsAttendance] = useState(() => {
    const cached = localStorage.getItem("global_courses");
    return cached ? JSON.parse(cached) : [
      { id: 1, code: "CS-301", name: "Database Management Systems", attended: 21, totalClasses: 24 },
      { id: 2, code: "CS-302", name: "Design & Analysis of Algorithms", attended: 18, totalClasses: 24 },
      { id: 3, code: "CS-303", name: "Full-Stack Web Development", attended: 19, totalClasses: 20 },
      { id: 4, code: "CS-304", name: "Discrete Mathematics", attended: 12, totalClasses: 20 }
    ];
  });

  const triggerLog = (id, increment) => {
    const modified = studentsAttendance.map(student => {
      if (student.id === id) {
        const nextCount = increment ? Math.min(student.attended + 1, student.totalClasses) : Math.max(student.attended - 1, 0);
        return { ...student, attended: nextCount };
      }
      return student;
    });
    setStudentsAttendance(modified);
    localStorage.setItem("global_courses", JSON.stringify(modified));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: "800", margin: 0 }}>👨‍🏫 Faculty Attendance Authorization Console</h1>
        <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Update student lecture attendance parameters across active sections.</p>
      </div>

      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b", fontSize: "0.85rem" }}>
              <th style={{ padding: "14px" }}>CODE</th>
              <th style={{ padding: "14px" }}>CURRICULUM MODULE</th>
              <th style={{ padding: "14px" }}>ATTENDANCE VALUE</th>
              <th style={{ padding: "14px" }}>LIVE INPUT DATA MODIFICATION</th>
            </tr>
          </thead>
          <tbody>
            {studentsAttendance.map(row => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px", fontFamily: "monospace", fontWeight: "600", color: "#2563eb" }}>{row.code}</td>
                <td style={{ padding: "14px", fontWeight: "700", color: "#0f172a" }}>{row.name}</td>
                <td style={{ padding: "14px", fontWeight: "700" }}>{Math.round((row.attended / row.totalClasses) * 100)}% ({row.attended}/{row.totalClasses})</td>
                <td style={{ padding: "14px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => triggerLog(row.id, false)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>- Absent</button>
                    <button onClick={() => triggerLog(row.id, true)} style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>+ Present</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherDashboard;