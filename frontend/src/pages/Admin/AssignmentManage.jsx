import React, { useState, useEffect } from "react";

const AssignmentManage = () => {
  const [assignments, setAssignments] = useState(() => JSON.parse(localStorage.getItem("assignments")) || []);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAssignment = {
        id: editId || Date.now(),
        title: title || file.name,
        fileName: file.name,
        fileData: event.target.result
      };

      if (editId) {
        setAssignments(assignments.map(a => a.id === editId ? newAssignment : a));
        setEditId(null);
      } else {
        setAssignments([...assignments, newAssignment]);
      }
      setTitle("");
      alert("Assignment Saved Successfully!");
    };
    reader.readAsDataURL(file);
  };

  const deleteAssignment = (id) => {
    if(window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter(a => a.id !== id));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📂 Assignment Upload Hub</h2>
      
      <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Assignment Title" style={{ padding: "8px", width: "250px", marginRight: "10px" }} />
        <input type="file" onChange={handleUpload} />
        <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{editId ? "Select new file to update" : "Select file to upload"}</p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>Title</th>
            <th style={{ padding: "10px" }}>File Name</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px" }}>{a.title}</td>
              <td style={{ padding: "10px" }}>{a.fileName}</td>
              <td style={{ padding: "10px" }}>
                <button onClick={() => { setEditId(a.id); setTitle(a.title); }}>Edit</button>
                <button onClick={() => deleteAssignment(a.id)} style={{ margin: "0 10px", color: "red" }}>Delete</button>
                <button onClick={() => window.open(a.fileData, "_blank")}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AssignmentManage;