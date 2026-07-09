import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await studentService.getExams();
        setExams(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧪 Upcoming Exams</h2>
      {exams.length === 0 && <p style={{ color: "#94a3b8" }}>Koi exam schedule nahi hai abhi.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "15px" }}>
        {exams.map(ex => (
          <div key={ex.id} style={{ background: "white", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: 0, color: "#0f172a" }}>{ex.examName}</h4>
            <p style={{ margin: "6px 0 0 0", color: "#64748b", fontSize: "0.9rem" }}>{ex.course?.courseCode} - {ex.course?.courseName}</p>
            <p style={{ margin: "4px 0 0 0", color: "#2563eb", fontWeight: "600" }}>📅 {ex.examDate} | Max Marks: {ex.maxMarks}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentExams;