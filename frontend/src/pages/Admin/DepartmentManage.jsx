import React, { useState, useEffect } from "react";
import { getAllDepartments, createDepartment, deleteDepartment } from "../../services/adminService";

const DepartmentManage = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      const res = await getAllDepartments();
      setDepartments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.code.trim()) return alert("Name and code required!");
    try {
      await createDepartment(form);
      setMsg("✅ Department created successfully!");
      setForm({ name: "", code: "" });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to create"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await deleteDepartment(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#1e293b" }}>🏢 Department Management</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>+ Add Department</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px" }}>
          <input placeholder="Department Name (e.g. Computer Science)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: "10px" }} />
          <input placeholder="Code (e.g. CS)" value={form.code} onChange={e => setForm({...form, code: e.target.value})} style={{ padding: "10px" }} />
          <button onClick={handleCreate} style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Add</button>
        </div>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Code</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 && (
              <tr><td colSpan="3" style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>No departments yet</td></tr>
            )}
            {departments.map(d => (
              <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px" }}>{d.name}</td>
                <td style={{ padding: "12px" }}>{d.code}</td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => handleDelete(d.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentManage;