import React, { useState } from "react";

const ManageStudents = () => {
  const [students, setStudents] = useState([
    { id: "STU101", name: "Himanshu Kumar", email: "himanshu@example.com", department: "Computer Science", semester: "4th" },
    { id: "STU102", name: "Amit Sharma", email: "amit@example.com", department: "Web Engineering", semester: "2nd" },
    { id: "STU103", name: "Priya Singh", email: "priya@example.com", department: "Information Tech", semester: "6th" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // add or edit
  const [form, setForm] = useState({ id: "", name: "", email: "", department: "", semester: "" });

  const handleOpenAdd = () => {
    setForm({ id: "STU" + Math.floor(100 + Math.random() * 900), name: "", email: "", department: "", semester: "1st" });
    setModalType("add");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setForm(student);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("क्या आप वाकई इस छात्र का डेटा हटाना चाहते हैं?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalType === "add") {
      setStudents([...students, form]);
    } else {
      setStudents(students.map(s => s.id === form.id ? form : s));
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: "800", margin: 0 }}>🧑‍🎓 Student Control Hub</h1>
          <p style={{ color: "#64748b", marginTop: "5px", margin: 0 }}>Manage configurations, admission registries, and system records.</p>
        </div>
        <button onClick={handleOpenAdd} style={{
          backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px 24px",
          borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)"
        }}>
          ➕ Add New Student
        </button>
      </div>

      {/* GRID DATA TABLE */}
      <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Student Name</th>
              <th style={thStyle}>Email Address</th>
              <th style={thStyle}>Department</th>
              <th style={thStyle}>Semester</th>
              <th style={thStyle}>Control Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={tdStyle}><span style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "0.85rem" }}>{student.id}</span></td>
                <td style={{ ...tdStyle, fontWeight: "700", color: "#1e293b" }}>{student.name}</td>
                <td style={tdStyle}>{student.email}</td>
                <td style={tdStyle}>{student.department}</td>
                <td style={tdStyle}>{student.semester}</td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => handleOpenEdit(student)} style={{ backgroundColor: "#f59e0b", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(student.id)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DYNAMIC FORM MODAL (ADD / EDIT) */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "1.35rem", fontWeight: "800" }}>
              {modalType === "add" ? "🚀 Register New Student" : "✏️ Adjust Student Profile"}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={labelStyle}>Department</label>
                <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})} style={inputStyle} required />
              </div>
              <div style={{ marginBottom: "25px" }}>
                <label style={labelStyle}>Semester</label>
                <select value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} style={inputStyle}>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                  <option value="4th">4th Semester</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={cancelBtnStyle}>Dismiss</button>
                <button type="submit" style={saveBtnStyle}>Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = { padding: "18px 20px", color: "#475569", fontWeight: "700", fontSize: "0.9rem" };
const tdStyle = { padding: "16px 20px", color: "#64748b", fontSize: "0.95rem" };
const labelStyle = { display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#475569", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box" };
const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15,23,42,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalBoxStyle = { backgroundColor: "white", padding: "32px", borderRadius: "16px", width: "420px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)" };
const cancelBtnStyle = { backgroundColor: "#f1f5f9", color: "#475569", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" };
const saveBtnStyle = { backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" };

export default ManageStudents;