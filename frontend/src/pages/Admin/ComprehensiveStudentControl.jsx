import React, { useState } from "react";

const ComprehensiveStudentControl = () => {
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem("global_students")) || []);
  const [courses] = useState(() => JSON.parse(localStorage.getItem("global_courses")) || []);
  const [ledger, setLedger] = useState(() => JSON.parse(localStorage.getItem("global_attendance_ledger")) || {});
  
  const [selectedStuId, setSelectedStuId] = useState(students[0]?.id || "");

  const handleFeeToggle = (id) => {
    const updated = students.map(s => {
      if (s.id === id) {
        const nextStatus = s.feeStatus === "Paid" ? "Pending" : s.feeStatus === "Pending" ? "Unpaid" : "Paid";
        return { ...s, feeStatus: nextStatus };
      }
      return s;
    });
    setStudents(updated);
    localStorage.setItem("global_students", JSON.stringify(updated));
  };

  const adjustAttendance = (courseCode, increment) => {
    const key = `${selectedStuId}_${courseCode}`;
    const record = ledger[key] || { attended: 0, total: 30 };
    
    let nextAttended = increment ? record.attended + 1 : record.attended - 1;
    nextAttended = Math.max(0, Math.min(nextAttended, record.total));

    const updatedLedger = { ...ledger, [key]: { ...record, attended: nextAttended } };
    setLedger(updatedLedger);
    localStorage.setItem("global_attendance_ledger", JSON.stringify(updatedLedger));
  };

  const currentStudent = students.find(s => s.id === selectedStuId);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>📊 Granular Ledger Overrides (Fees & Attendance)</h2>
      <p style={{ color: "#64748b" }}>Kisi specific student ko select karke uska complete financial aur parameters records change karein.</p>

      <div style={{ margin: "20px 0", padding: "15px", backgroundColor: "#e2e8f0", borderRadius: "8px" }}>
        <label style={{ marginRight: "10px", fontWeight: "700" }}>Select Target Student Portfolio:</label>
        <select value={selectedStuId} onChange={e => setSelectedStuId(e.target.value)} style={{ padding: "8px", borderRadius: "6px" }}>
          {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
        </select>
      </div>

      {currentStudent && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
          {/* FINANCIAL ACCOUNTING */}
          <div style={panelCard}>
            <h3>💳 Invoice Billing State</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "15px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <div>
                <h4>Current Consolidated Fee Status</h4>
                <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "800", color: currentStudent.feeStatus === "Paid" ? "#10b981" : "#ef4444" }}>
                  {currentStudent.feeStatus}
                </p>
              </div>
              <button onClick={() => handleFeeToggle(currentStudent.id)} style={{ padding: "8px 14px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>
                Toggle State
              </button>
            </div>
          </div>

          {/* ATTENDANCE SHEET */}
          <div style={panelCard}>
            <h3>📈 Subject Roster Attendance Counter</h3>
            <div style={{ marginTop: "10px" }}>
              {courses.map(c => {
                const log = ledger[`${selectedStuId}_${c.code}`] || { attended: 0, total: 30 };
                return (
                  <div key={c.code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <div>
                      <b>{c.code}</b> - <span style={{ fontSize: "0.85rem" }}>{c.name}</span>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Present: {log.attended} / {log.total} Lectures</div>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button onClick={() => adjustAttendance(c.code, false)} style={smallMinusBtn}>-</button>
                      <button onClick={() => adjustAttendance(c.code, true)} style={smallPlusBtn}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const smallPlusBtn = { backgroundColor: "#dcfce7", color: "#15803d", border: "none", width: "24px", height: "24px", borderRadius: "4px", fontWeight: "800", cursor: "pointer" };
const smallMinusBtn = { backgroundColor: "#fee2e2", color: "#ef4444", border: "none", width: "24px", height: "24px", borderRadius: "4px", fontWeight: "800", cursor: "pointer" };

// ✅ Sahi Tarika:
export default ComprehensiveStudentControl;