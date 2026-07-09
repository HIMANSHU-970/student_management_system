import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await studentService.getNotices();
        setNotices(data || []);
      } catch (err) {
        console.error("Fetch notices error:", err);
        setError(err.response?.data?.message || "Failed to load notices");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#0f172a", marginBottom: "20px" }}>📢 College Notices</h2>

      {error && <p style={{ color: "#991b1b", fontWeight: "bold" }}>{error}</p>}

      {!error && notices.length === 0 && (
        <p style={{ color: "#64748b" }}>Koi notice nahi hai abhi.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {notices.map(n => (
          <div key={n.id} style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>{n.title}</h4>
            <p style={{ color: "#475569", margin: "0 0 8px 0" }}>{n.content}</p>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notices;