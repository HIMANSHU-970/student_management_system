import React, { useState, useEffect } from "react";
import { getAllSubjects, createSubject, getAllDepartments } from "../../services/adminService";

const SubjectManage = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newSub, setNewSub] = useState({ courseCode: "", courseName: "", department: "", credits: 3 });
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      const [cRes, dRes] = await Promise.all([getAllSubjects(), getAllDepartments()]);
      setCourses(cRes.data || []);
      setDepartments(dRes.data || []);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSub.courseCode.trim() || !newSub.courseName.trim() || !newSub.department) {
      return alert("Sab fields required!");
    }

    try {
      await createSubject(newSub);
      setMsg("✅ Subject created successfully!");
      setNewSub({ courseCode: "", courseName: "", department: "", credits: 3 });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to create"));
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>📚 Subject Core Schema Manager</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px", marginTop: "20px" }}>

        <form onSubmit={handleAdd} style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ marginTop: 0 }}>Create New Module</h4>
          <input type="text" placeholder="Subject Code (e.g. CS-301)" value={newSub.courseCode} onChange={e=>setNewSub({...newSub, courseCode:e.target.value})} style={inpStyle} required />
          <input type="text" placeholder="Subject Name" value={newSub.courseName} onChange={e=>setNewSub({...newSub, courseName:e.target.value})} style={inpStyle} required />
          <select value={newSub.department} onChange={e=>setNewSub({...newSub, department:e.target.value})} style={inpStyle} required>
            <option value="">-- Select Department --</option>
            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          <input type="number" placeholder="Credits" value={newSub.credits} onChange={e=>setNewSub({...newSub, credits: parseInt(e.target.value)})} style={inpStyle} required />
          <button type="submit" style={btnStyle}>Commit Subject</button>
        </form>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ marginTop: 0 }}>Active Course Schema</h4>
          {courses.length === 0 && <p style={{ color: "#94a3b8" }}>No subjects created yet.</p>}
          {courses.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <div><b>{c.courseCode}</b> - {c.courseName} ({c.department}, {c.credits} credits)</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const inpStyle = { width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", boxSizing: "border-box" };
const btnStyle = { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "10px", border: "none", borderRadius: "6px", fontWeight: "700" };

export default SubjectManage;