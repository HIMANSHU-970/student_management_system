import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const assignments = JSON.parse(localStorage.getItem("teacher_assignments") || "{}");

  const [attendanceData, setAttendanceData] = useState(() => {
    const saved = localStorage.getItem(`attendance_${studentId}`);
    return saved ? JSON.parse(saved) : [
      { code: "CS-301", module: "Database Management Systems", attended: 21, total: 24 },
      { code: "CS-302", module: "Design & Analysis of Algorithms", attended: 18, total: 24 },
      { code: "CS-303", module: "Full-Stack Web Development", attended: 19, total: 20 },
    ];
  });

  const canEdit = (subjectCode) => {
    if (user.role === 'admin') return true;
    return assignments[user.id]?.includes(subjectCode);
  };

  const handleAttendanceChange = (code, newValue) => {
    if (!canEdit(code)) {
      alert("Access Denied: You are not authorized to edit this subject.");
      return;
    }
    const updated = attendanceData.map(item => 
      item.code === code ? { ...item, attended: Number(newValue) } : item
    );
    setAttendanceData(updated);
  };

  const handleSave = () => {
    localStorage.setItem(`attendance_${studentId}`, JSON.stringify(attendanceData));
    alert("Record Saved Successfully!");
  };

  // PDF Export Logic
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Attendance Report: ${studentId}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    const tableData = attendanceData.map(item => [
      item.code,
      item.module,
      `${item.attended}/${item.total}`,
      `${((item.attended / item.total) * 100).toFixed(1)}%`
    ]);

    doc.autoTable({
      head: [['Code', 'Module', 'Attendance', 'Percentage']],
      body: tableData,
      startY: 35,
    });

    doc.save(`Attendance_${studentId}.pdf`);
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "6px", border: "1px solid #cbd5e1" }}>⬅ Back</button>
        <button onClick={exportPDF} style={{ backgroundColor: "#10b981", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600" }}>📥 Download PDF Report</button>
      </div>
      
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px", color: "#0f172a" }}>Edit Attendance: {studentId}</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Module</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item) => (
              <tr key={item.code} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px" }}>{item.module} ({item.code})</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <input 
                    type="number" value={item.attended} disabled={!canEdit(item.code)}
                    onChange={(e) => handleAttendanceChange(item.code, e.target.value)}
                    style={{ width: "60px", padding: "5px", textAlign: "center", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                  /> / {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button onClick={handleSave} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;