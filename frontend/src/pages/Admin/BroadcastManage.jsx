import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { createNotice, getAllNotices, deleteNotice } from "../../services/adminService";
import { getTeacherNotices } from "../../services/teacherService";

const BroadcastManage = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", targetRole: "all" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadNotices = async () => {
    try {
      const res = isAdmin ? await getAllNotices() : await getTeacherNotices();
      setNotices(res.data || []);
    } catch (err) {
      console.error("Load notices error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const handlePublish = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      return alert("Title and content required!");
    }
    try {
      await createNotice(form);
      setMsg("✅ Notice published successfully!");
      setForm({ title: "", content: "", targetRole: "all" });
      loadNotices();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to publish"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await deleteNotice(id);
      loadNotices();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const targetLabel = (role) => {
    if (role === "all") return "📢 Everyone";
    if (role === "student") return "🎓 Students Only";
    if (role === "teacher") return "👨‍🏫 Teachers Only";
    return role;
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>
        {isAdmin ? "📢 Central Broadcasts" : "📢 Notice Board"}
      </h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", marginBottom: "20px", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      {/* CREATE NOTICE - sirf admin */}
      {isAdmin && (
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
          <h3 style={{ marginTop: 0 }}>✏️ Create New Notice</h3>
          <input
            placeholder="Notice Title"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            style={{ width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }}
          />
          <textarea
            placeholder="Notice Content"
            value={form.content}
            onChange={e => setForm({...form, content: e.target.value})}
            rows={4}
            style={{ width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #cbd5e1", borderRadius: "6px", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label style={{ fontWeight: "600", color: "#475569" }}>Send to:</label>
            <select
              value={form.targetRole}
              onChange={e => setForm({...form, targetRole: e.target.value})}
              style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            >
              <option value="all">Everyone</option>
              <option value="student">Students Only</option>
              <option value="teacher">Teachers Only</option>
            </select>
            <button
              onClick={handlePublish}
              style={{ padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}
            >
              Publish Notice
            </button>
          </div>
        </div>
      )}

      {/* NOTICES LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {notices.length === 0 && (
          <p style={{ color: "#64748b" }}>Koi notice nahi hai abhi.</p>
        )}
        {notices.map(n => (
          <div key={n.id} style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h4 style={{ margin: "0 0 6px 0", color: "#0f172a" }}>{n.title}</h4>
                <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: "600" }}>{targetLabel(n.targetRole)}</span>
              </div>
              {isAdmin && (
                <button onClick={() => handleDelete(n.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>
                  Delete
                </button>
              )}
            </div>
            <p style={{ marginTop: "10px", color: "#475569" }}>{n.content}</p>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BroadcastManage;