import React, { useState, useEffect } from "react";
import { getMySubjects } from "../../services/teacherService";
import { uploadMaterial, getMyMaterials, deleteMaterial } from "../../services/teacherService";

const StudyMaterials = () => {
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ title: "", type: "notes", courseId: "" });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [sRes, mRes] = await Promise.all([getMySubjects(), getMyMaterials()]);
      setSubjects(sRes.data || []);
      setMaterials(mRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async () => {
    if (!form.title.trim() || !form.courseId || !file) {
      return alert("Title, Subject, and File required!");
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("type", form.type);
    formData.append("courseId", form.courseId);
    formData.append("file", file);

    try {
      await uploadMaterial(formData);
      setMsg("✅ Material uploaded successfully!");
      setForm({ title: "", type: "notes", courseId: "" });
      setFile(null);
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Upload failed"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this material?")) return;
    try {
      await deleteMaterial(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📖 Study Materials</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>+ Upload Material</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.5fr 1.5fr auto", gap: "10px" }}>
          <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ padding: "10px" }} />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ padding: "10px" }}>
            <option value="notes">Notes</option>
            <option value="pdf">PDF</option>
            <option value="ppt">PPT</option>
            <option value="video">Video</option>
            <option value="other">Other</option>
          </select>
          <select value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} style={{ padding: "10px" }}>
            <option value="">-- Subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.courseCode} - {s.courseName}</option>)}
          </select>
          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ padding: "8px" }} />
          <button onClick={handleUpload} style={{ padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Upload</button>
        </div>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ marginTop: 0 }}>My Uploaded Materials</h3>
        {materials.length === 0 && <p style={{ color: "#94a3b8" }}>No materials uploaded yet.</p>}
        {materials.map(m => (
          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <b>{m.title}</b> ({m.type}) — {m.course?.courseCode}
              <a href={`http://localhost:5002${m.fileUrl}`} target="_blank" rel="noreferrer" style={{ marginLeft: "10px", color: "#2563eb" }}>View</a>
            </div>
            <button onClick={() => handleDelete(m.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterials;