import React, { useState, useEffect } from "react";
import { getMyExams, enterMyExamResult } from "../../services/teacherService";
import { getStudents } from "../../services/teacherService"; // agar export nahi hai to neeche dekho

const TeacherExamManage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [marks, setMarks] = useState("");
  const [msg, setMsg] = useState("");

  const loadExams = async () => {
    try {
      const res = await getMyExams();
      setExams(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadExams(); }, []);

  const handleSave = async () => {
    if (!selectedExam || !studentId.trim() || marks === "") return alert("Sab fields required!");
    try {
      await enterMyExamResult({ examId: selectedExam.id, studentId: studentId.trim(), marksObtained: Number(marks) });
      setMsg("✅ Mark saved successfully!");
      setStudentId(""); setMarks("");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to save"));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧪 My Exams</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>Select Exam</h3>
        <select value={selectedExam?.id || ""} onChange={e => setSelectedExam(exams.find(ex => ex.id === e.target.value))} style={{ padding: "10px", width: "100%" }}>
          <option value="">-- Select Exam --</option>
          {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.examName} ({ex.course?.courseCode}) - {ex.examDate}</option>)}
        </select>
      </div>

      {selectedExam && (
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ marginTop: 0 }}>Enter Marks for: {selectedExam.examName} (Max: {selectedExam.maxMarks})</h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>Note: Student ID (UUID) chahiye — Admin Registry/Attendance page se copy kar sakte ho.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr auto", gap: "10px" }}>
            <input placeholder="Student ID (UUID)" value={studentId} onChange={e => setStudentId(e.target.value)} style={{ padding: "10px" }} />
            <input type="number" placeholder="Marks" value={marks} onChange={e => setMarks(e.target.value)} style={{ padding: "10px" }} />
            <button onClick={handleSave} style={{ padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExamManage;