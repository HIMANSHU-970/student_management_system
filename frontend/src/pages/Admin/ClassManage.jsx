import React, { useState, useEffect } from "react";
import { getAllClasses, createClass, deleteClass, getAllDepartments, getAllTeachers } from "../../services/adminService";

const ClassManage = () => {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: "", departmentId: "", year: 1, section: "A", classTeacherId: "" });
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      const [cRes, dRes, tRes] = await Promise.all([getAllClasses(), getAllDepartments(), getAllTeachers()]);
      setClasses(cRes.data || []);
      setDepartments(dRes.data || []);
      setTeachers(tRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.departmentId) return alert("Name and Department required!");
    try {
      await createClass(form);
      setMsg("✅ Class created successfully!");
      setForm({ name: "", departmentId: "", year: 1, section: "A", classTeacherId: "" });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to create"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      await deleteClass(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#1e293b" }}>🏫 Class / Section Management</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>+ Create Class</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 0.7fr 0.7fr 1.3fr auto", gap: "10px" }}>
          <input placeholder="Class Name (e.g. BCA 1st Year)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: "10px" }} />
          <select value={form.departmentId} onChange={e => setForm({...form, departmentId: e.target.value})} style={{ padding: "10px" }}>
            <option value="">-- Department --</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <input type="number" placeholder="Year" value={form.year} onChange={e => setForm({...form, year: e.target.value})} style={{ padding: "10px" }} />
          <input placeholder="Section" value={form.section} onChange={e => setForm({...form, section: e.target.value})} style={{ padding: "10px" }} />
          <select value={form.classTeacherId} onChange={e => setForm({...form, classTeacherId: e.target.value})} style={{ padding: "10px" }}>
            <option value="">-- Class Teacher (optional) --</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button onClick={handleCreate} style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Add</button>
        </div>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Class Name</th>
              <th style={{ padding: "12px" }}>Department</th>
              <th style={{ padding: "12px" }}>Year</th>
              <th style={{ padding: "12px" }}>Section</th>
              <th style={{ padding: "12px" }}>Class Teacher</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 && (
              <tr><td colSpan="6" style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>No classes yet</td></tr>
            )}
            {classes.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px" }}>{c.name}</td>
                <td style={{ padding: "12px" }}>{c.department?.name}</td>
                <td style={{ padding: "12px" }}>{c.year}</td>
                <td style={{ padding: "12px" }}>{c.section}</td>
                <td style={{ padding: "12px" }}>{c.classTeacher?.name || "—"}</td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => handleDelete(c.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassManage;
