import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";

const StudentCourses = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const data = await studentService.getMaterials();
        setMaterials(data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load materials");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  if (loading) return <div>Loading...</div>;

  const typeIcon = (type) => {
    if (type === "pdf") return "📄";
    if (type === "ppt") return "📊";
    if (type === "video") return "🎥";
    if (type === "notes") return "📝";
    return "📁";
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#0f172a", fontWeight: "800" }}>📖 Study Materials</h2>

      {error && <p style={{ color: "#991b1b", fontWeight: "bold" }}>{error}</p>}

      {!error && materials.length === 0 && (
        <p style={{ color: "#94a3b8" }}>Koi study material upload nahi hua abhi.</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
        {materials.map(m => (
          <div key={m.id} style={{ background: "white", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "1.6rem" }}>{typeIcon(m.type)}</div>
            <h4 style={{ margin: "8px 0 4px 0", color: "#0f172a" }}>{m.title}</h4>
            <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", color: "#64748b" }}>{m.course?.courseCode} - {m.course?.courseName}</p>
            <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5002"}${m.fileUrl}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: "600", fontSize: "0.85rem" }}>
              Download / View →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;