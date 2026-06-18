import React, { useState, useEffect } from "react";

const AttendanceManage = () => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("global_students");
    // Agar data nahi hai, toh default values set karein
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "rudransh", present: 0, total: 30 }
    ];
  });

  useEffect(() => {
    localStorage.setItem("global_students", JSON.stringify(students));
  }, [students]);

  const updateAttendance = (id, type) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        let newPresent = type === 'inc' ? (s.present || 0) + 1 : (s.present || 0) - 1;
        return { ...s, present: Math.max(0, Math.min(newPresent, s.total || 30)) };
      }
      return s;
    }));
  };

  return (
    <div style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
      <h2>📊 Live Student Attendance Override Unit</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f8fafc", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>Student Name</th>
            <th style={{ padding: "12px" }}>Attendance</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const total = s.total || 30;
            const perc = total > 0 ? ((s.present / total) * 100).toFixed(1) : 0;
            return (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px" }}>{s.name}</td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => updateAttendance(s.id, 'dec')} style={{ marginRight: "5px" }}>-</button>
                  {s.present || 0} / {total}
                  <button onClick={() => updateAttendance(s.id, 'inc')} style={{ marginLeft: "5px" }}>+</button>
                </td>
                <td style={{ padding: "12px", color: perc < 75 ? "red" : "green" }}>{perc}%</td>
                <td style={{ padding: "12px" }}><button>Edit</button> <button>PDF</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default AttendanceManage;