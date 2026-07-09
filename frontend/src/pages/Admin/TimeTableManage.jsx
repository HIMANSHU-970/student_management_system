import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getAllTimetable, createTimetableSlot, deleteTimetableSlot, getAllSubjects, getAllTeachers } from "../../services/adminService";
import { getMyTimetable } from "../../services/teacherService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimeTableManage = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [slots, setSlots] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ day: "Monday", time: "", courseId: "", teacherId: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      if (isAdmin) {
        const [tRes, sRes, teRes] = await Promise.all([getAllTimetable(), getAllSubjects(), getAllTeachers()]);
        setSlots(tRes.data || []);
        setSubjects(sRes.data || []);
        setTeachers(teRes.data || []);
      } else {
        const res = await getMyTimetable();
        setSlots(res.data || []);
      }
    } catch (err) {
      console.error("Load timetable error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async () => {
    const { day, time, courseId, teacherId } = form;
    if (!day || !time.trim() || !courseId || !teacherId) return alert("Sab fields required!");

    try {
      await createTimetableSlot(form);
      setMsg("✅ Slot added successfully!");
      setForm({ day: "Monday", time: "", courseId: "", teacherId: "" });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to add"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    try {
      await deleteTimetableSlot(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 {isAdmin ? "Advanced TimeTable Architect" : "My Class Schedule"}</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      {isAdmin && (
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "20px", marginBottom: "25px" }}>
          <h3 style={{ marginTop: 0 }}>+ Add New Slot</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr 1.3fr auto", gap: "10px" }}>
            <select value={form.day} onChange={e => setForm({...form, day: e.target.value})} style={{ padding: "10px" }}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input placeholder="Time (e.g. 10:00-11:00 AM)" value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={{ padding: "10px" }} />
            <select value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} style={{ padding: "10px" }}>
              <option value="">-- Subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.courseCode} - {s.courseName}</option>)}
            </select>
            <select value={form.teacherId} onChange={e => setForm({...form, teacherId: e.target.value})} style={{ padding: "10px" }}>
              <option value="">-- Teacher --</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={handleAdd} style={{ padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Add Slot</button>
          </div>
        </div>
      )}

      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse", background: "white" }}>
        <thead>
          <tr style={{ background: "#0f172a", color: "white" }}>
            <th style={{ padding: "12px" }}>Day</th>
            <th style={{ padding: "12px" }}>Time</th>
            <th style={{ padding: "12px" }}>Subject</th>
            <th style={{ padding: "12px" }}>Teacher</th>
            {isAdmin && <th style={{ padding: "12px" }}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {slots.length === 0 && (
            <tr><td colSpan={isAdmin ? 5 : 4} style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>No slots yet</td></tr>
          )}
          {slots.map(s => (
            <tr key={s.id} style={{ borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
              <td style={{ padding: "12px" }}>{s.day}</td>
              <td style={{ padding: "12px" }}>{s.time}</td>
              <td style={{ padding: "12px" }}>{s.course?.courseCode} - {s.course?.courseName}</td>
              <td style={{ padding: "12px" }}>{s.teacher?.name}</td>
              {isAdmin && (
                <td style={{ padding: "12px" }}>
                  <button onClick={() => handleDelete(s.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableManage;