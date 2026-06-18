import React, { useState } from "react";

const SubjectManage = () => {
  const [courses, setCourses] = useState(() => JSON.parse(localStorage.getItem("global_courses")) || []);
  const [newSub, setNewSub] = useState({ code: "", name: "", totalClasses: 30 });

  const handleAdd = (e) => {
    e.preventDefault();
    const updated = [...courses, { id: Date.now(), ...newSub, attended: 0 }];
    setCourses(updated);
    localStorage.setItem("global_courses", JSON.stringify(updated));
    setNewSub({ code: "", name: "", totalClasses: 30 });
  };

  const handlePurge = (id) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    localStorage.setItem("global_courses", JSON.stringify(updated));
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>📚 Subject Core Schema Manager</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px", marginTop: "20px" }}>
        
        <form onSubmit={handleAdd} style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h4>Create New Module</h4>
          <input type="text" placeholder="Subject Code" value={newSub.code} onChange={e=>setNewSub({...newSub, code:e.target.value})} style={inpStyle} required />
          <input type="text" placeholder="Subject Name" value={newSub.name} onChange={e=>setNewSub({...newSub, name:e.target.value})} style={inpStyle} required />
          <input type="number" placeholder="Total Classes" value={newSub.totalClasses} onChange={e=>setNewSub({...newSub, totalClasses: parseInt(e.target.value)})} style={inpStyle} required />
          <button type="submit" style={btnStyle}>Commit Subject</button>
        </form>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h4>Active Course Schema</h4>
          {courses.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <div><b>{c.code}</b> - {c.name} ({c.totalClasses} Classes)</div>
              <button onClick={() => handlePurge(c.id)} style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const inpStyle = { width: "100%", padding: "10px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" };
const btnStyle = { width: "100%", backgroundColor: "#2563eb", color: "white", padding: "10px", border: "none", borderRadius: "6px", fontWeight: "700" };

export default SubjectManage;