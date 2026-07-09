import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await studentService.getAttendanceOverview();
        setRecords(data || []);
      } catch (err) {
        console.error("Fetch attendance error:", err);
        setError(err.response?.data?.message || "Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTotalPercentage = () => {
    const totalAttended = records.reduce((sum, r) => sum + (r.present || 0), 0);
    const totalClasses = records.reduce((sum, r) => sum + (r.total || 0), 0);
    return totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: "800", margin: 0 }}>📊 Structural Log Compliance</h1>
        <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Verified attendance logs across current curriculum branches.</p>
      </div>

      {error && <p style={{ color: "#991b1b", fontWeight: "bold" }}>{error}</p>}

      <div style={{ backgroundColor: "#1e293b", padding: "24px", borderRadius: "16px", color: "white", marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700", letterSpacing: "1px" }}>TOTAL ACADEMIC COMPLIANCE</span>
          <div style={{ fontSize: "3.5rem", fontWeight: "900", color: "#3b82f6", marginTop: "5px" }}>{calculateTotalPercentage()}%</div>
        </div>
      </div>

      {!error && records.length === 0 && (
        <p style={{ color: "#64748b" }}>Aapko abhi koi subject assign nahi hua hai. Admin se contact karein.</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "25px" }}>
        {records.map(r => {
          const total = r.total || 0;
          const pct = total > 0 ? Math.round((r.present / total) * 100) : 0;
          return (
            <div key={r.id} style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#2563eb", fontWeight: "700" }}>{r.course?.courseCode}</span>
              <h4 style={{ margin: "4px 0 15px 0", fontSize: "1rem", color: "#0f172a", textAlign: "center" }}>{r.course?.courseName}</h4>

              <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: `conic-gradient(#2563eb ${pct}%, #f1f5f9 ${pct}% 100%)`, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
                <div style={{ width: "80px", height: "80px", backgroundColor: "white", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "800", color: "#0f172a" }}>
                  {pct}%
                </div>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>Lectures: {r.present} / {total}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;