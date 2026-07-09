import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";

const StudentTimeTable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const data = await studentService.getTimetable();
        setTimetable(data || []);
      } catch (err) {
        console.error("Fetch timetable error:", err);
        setError(err.response?.data?.message || "Failed to load timetable");
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", background: "#f8fafc", minHeight: "100vh" }}>
      <h2>🕒 Class Schedule</h2>

      {error && <p style={{ color: "#991b1b", fontWeight: "bold" }}>{error}</p>}

      {!error && timetable.length === 0 ? (
        <p>Aapke enrolled subjects ka schedule abhi admin ne nahi banaya.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", background: "white" }}>
          <thead>
            <tr style={{ background: "#0f172a", color: "white" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Day</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Time</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Subject</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((s) => (
              <tr key={s.id} style={{ textAlign: "center" }}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.day}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.time}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.course?.courseCode} - {s.course?.courseName}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.teacher?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentTimeTable;