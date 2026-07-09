import React, { useState, useEffect } from "react";
import {
  getAllStudents,
  getAllSubjects,
  enrollStudentInCourse,
  getAllAttendanceRecords,
  updateAttendanceOverride
} from "../../services/adminService";

const AttendanceManage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);

  const [enrollForm, setEnrollForm] = useState({ studentId: "", courseId: "", total: 0 });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    try {
      const [sRes, subRes, rRes] = await Promise.all([
        getAllStudents(),
        getAllSubjects(),
        getAllAttendanceRecords()
      ]);
      setStudents(sRes.data);
      setSubjects(subRes.data);
      setRecords(rRes.data);
    } catch (err) {
      console.error("Load error:", err);
      setMsg("Failed to load data.");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleEnroll = async () => {
    const { studentId, courseId, total } = enrollForm;
    if (!studentId || !courseId) return alert("Select student and subject!");

    setLoading(true);
    setMsg("");
    try {
      await enrollStudentInCourse({ studentId, courseId, total: Number(total) || 0 });
      setMsg("✅ Student enrolled in subject successfully!");
      setEnrollForm({ studentId: "", courseId: "", total: 0 });
      loadAll();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to enroll"));
    } finally {
      setLoading(false);
    }
  };

  const updatePresent = async (id, currentPresent, currentTotal, delta) => {
    const newPresent = Math.max(0, Math.min(currentPresent + delta, currentTotal));
    try {
      await updateAttendanceOverride(id, { present: newPresent });
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const updateTotal = async (id, newTotal) => {
    try {
      await updateAttendanceOverride(id, { total: Number(newTotal) });
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Live Student Attendance Override Unit</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      {/* ENROLL STUDENT IN SUBJECT */}
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>🔗 Enroll Student in Subject</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px" }}>
          <select value={enrollForm.studentId} onChange={e => setEnrollForm({...enrollForm, studentId: e.target.value})} style={{ padding: "10px" }}>
            <option value="">-- Select Student --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
          </select>
          <select value={enrollForm.courseId} onChange={e => setEnrollForm({...enrollForm, courseId: e.target.value})} style={{ padding: "10px" }}>
            <option value="">-- Select Subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.courseCode} - {s.courseName}</option>)}
          </select>
          <input type="number" placeholder="Total Classes" value={enrollForm.total} onChange={e => setEnrollForm({...enrollForm, total: e.target.value})} style={{ padding: "10px" }} />
          <button onClick={handleEnroll} disabled={loading} style={{ padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>
            {loading ? "..." : "Enroll"}
          </button>
        </div>
      </div>

      {/* ALL ATTENDANCE RECORDS - Admin full control */}
      <div style={{ padding: "20px", background: "white", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ marginTop: 0 }}>📋 All Subjects & Students Attendance</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Student</th>
              <th style={{ padding: "12px" }}>Subject</th>
              <th style={{ padding: "12px" }}>Attendance</th>
              <th style={{ padding: "12px" }}>Total Classes</th>
              <th style={{ padding: "12px" }}>%</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr><td colSpan="5" style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>No records yet. Enroll a student above.</td></tr>
            )}
            {records.map(r => {
              const total = r.total || 0;
              const perc = total > 0 ? ((r.present / total) * 100).toFixed(1) : 0;
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px" }}>{r.student?.name}</td>
                  <td style={{ padding: "12px" }}>{r.course?.courseCode} - {r.course?.courseName}</td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => updatePresent(r.id, r.present, r.total, -1)} style={{ marginRight: "5px" }}>-</button>
                    {r.present} / {total}
                    <button onClick={() => updatePresent(r.id, r.present, r.total, 1)} style={{ marginLeft: "5px" }}>+</button>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <input type="number" defaultValue={total} onBlur={(e) => updateTotal(r.id, e.target.value)} style={{ width: "70px", padding: "4px" }} />
                  </td>
                  <td style={{ padding: "12px", color: perc < 75 ? "red" : "green", fontWeight: "700" }}>{perc}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceManage;