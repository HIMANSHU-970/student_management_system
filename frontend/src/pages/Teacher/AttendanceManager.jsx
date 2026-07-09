import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllAttendanceRecords,
  getAllStudents,
  getAllSubjects,
  enrollStudentInCourse
} from "../../services/adminService";
import { getMyCourseAttendance } from "../../services/teacherService";

const AttendanceManager = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [enrollForm, setEnrollForm] = useState({ studentId: "", courseId: "", total: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      if (isAdmin) {
        const [rRes, sRes, subRes] = await Promise.all([
          getAllAttendanceRecords(),
          getAllStudents(),
          getAllSubjects()
        ]);
        setRecords(rRes.data || []);
        setStudents(sRes.data || []);
        setSubjects(subRes.data || []);
      } else {
        const rRes = await getMyCourseAttendance();
        setRecords(rRes.data || []);
      }
    } catch (err) {
      console.error("Load error:", err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async () => {
    const { studentId, courseId, total } = enrollForm;
    if (!studentId || !courseId) return alert("Select student and subject!");

    try {
      await enrollStudentInCourse({ studentId, courseId, total: Number(total) || 0 });
      setMsg("✅ Student enrolled successfully!");
      setEnrollForm({ studentId: "", courseId: "", total: 0 });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to enroll"));
    }
  };

  // 🆕 Group records by student, calculate overall attendance %
  const groupByStudent = () => {
    const map = {};
    records.forEach((r) => {
      const sid = r.student?.id;
      if (!sid) return;
      if (!map[sid]) {
        map[sid] = {
          student: r.student,
          department: r.student?.StudentProfile?.department || "—",
          subjects: [],
          totalPresent: 0,
          totalClasses: 0
        };
      }
      map[sid].subjects.push(r);
      map[sid].totalPresent += r.present || 0;
      map[sid].totalClasses += r.total || 0;
    });
    return Object.values(map);
  };

  const grouped = groupByStudent();

  const pctColor = (pct) => {
    if (pct >= 75) return "#16a34a";
    if (pct >= 50) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;

  return (
    <div style={{ padding: "40px", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "1.85rem", color: "#0f172a", fontWeight: "800", margin: 0 }}>
          {isAdmin ? "🏢 Admin Registry" : "👨‍🏫 My Assigned Classes"}
        </h2>
        <p style={{ color: "#64748b", margin: "6px 0 0 0" }}>
          {isAdmin ? "Overall attendance overview across all enrolled students." : "Attendance for students in your assigned subjects."}
        </p>
      </div>

      {msg && (
        <div style={{ padding: "12px 18px", borderRadius: "10px", marginBottom: "20px", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      {/* ENROLL STUDENT - sirf admin */}
      {isAdmin && (
        <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: "28px" }}>
          <h3 style={{ marginTop: 0, color: "#1e293b" }}>🔗 Enroll Student in Subject</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px" }}>
            <select value={enrollForm.studentId} onChange={e => setEnrollForm({...enrollForm, studentId: e.target.value})} style={selectStyle}>
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
            </select>
            <select value={enrollForm.courseId} onChange={e => setEnrollForm({...enrollForm, courseId: e.target.value})} style={selectStyle}>
              <option value="">-- Select Subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.courseCode} - {s.courseName}</option>)}
            </select>
            <input type="number" placeholder="Total Classes" value={enrollForm.total} onChange={e => setEnrollForm({...enrollForm, total: e.target.value})} style={selectStyle} />
            <button onClick={handleEnroll} style={primaryBtn}>Enroll</button>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {error && <p style={{ color: "#991b1b", fontWeight: "bold", padding: "20px" }}>{error}</p>}

        {!error && grouped.length === 0 && (
          <p style={{ color: "#64748b", padding: "20px" }}>
            {isAdmin ? "Koi student kisi subject mein enroll nahi hai abhi. Upar form se enroll karein." : "Aapko koi subject assign nahi hai, ya kisi student ne abhi enroll nahi kiya."}
          </p>
        )}

        {grouped.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                <th style={thStyle}>Student Name</th>
                <th style={thStyle}>{isAdmin ? "Department" : "Subjects"}</th>
                <th style={thStyle}>Overall Attendance</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((g) => {
                const overallPct = g.totalClasses > 0 ? ((g.totalPresent / g.totalClasses) * 100).toFixed(1) : 0;
                const color = pctColor(overallPct);
                return (
                  <tr key={g.student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#2563eb", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.9rem" }}>
                          {g.student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", color: "#0f172a" }}>{g.student.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{g.student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {isAdmin ? (
                        <span style={{ background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700" }}>
                          {g.department}
                        </span>
                      ) : (
                        <span style={{ color: "#475569", fontSize: "0.85rem" }}>{g.subjects.length} subject(s)</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "100px", height: "8px", borderRadius: "4px", background: "#e2e8f0", overflow: "hidden" }}>
                          <div style={{ width: `${overallPct}%`, height: "100%", background: color }} />
                        </div>
                        <span style={{ fontWeight: "800", color }}>{overallPct}%</span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>({g.totalPresent}/{g.totalClasses})</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <button
                        onClick={() => navigate(`/${isAdmin ? "admin" : "teacher"}/attendance/${g.student.id}`)}
                        style={manageBtn}
                      >
                        ✏️ Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle = { padding: "16px", textAlign: "left", color: "#cbd5e1", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "700" };
const tdStyle = { padding: "16px" };
const selectStyle = { padding: "11px", borderRadius: "8px", border: "1px solid #cbd5e1" };
const primaryBtn = { padding: "11px 22px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" };
const manageBtn = { padding: "8px 18px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" };

export default AttendanceManager;