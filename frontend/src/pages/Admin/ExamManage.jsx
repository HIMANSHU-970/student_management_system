import React, { useState, useEffect } from "react";
import {
  getAllExams, createExam, deleteExam,
  getAllSubjects, getAllStudents,
  enterExamResult, publishExamResults, getExamResults
} from "../../services/adminService";

const ExamManage = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ examName: "", courseId: "", examDate: "", maxMarks: 100 });
  const [msg, setMsg] = useState("");

  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);
  const [marksInput, setMarksInput] = useState({});

  const loadData = async () => {
    try {
      const [eRes, sRes, stRes] = await Promise.all([getAllExams(), getAllSubjects(), getAllStudents()]);
      setExams(eRes.data || []);
      setSubjects(sRes.data || []);
      setStudents(stRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    const { examName, courseId, examDate } = form;
    if (!examName.trim() || !courseId || !examDate) return alert("Sab fields required!");
    try {
      await createExam(form);
      setMsg("✅ Exam created successfully!");
      setForm({ examName: "", courseId: "", examDate: "", maxMarks: 100 });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to create"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this exam?")) return;
    try {
      await deleteExam(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const openMarksPanel = async (exam) => {
    setSelectedExam(exam);
    try {
      const res = await getExamResults(exam.id);
      setResults(res.data || []);
      const map = {};
      (res.data || []).forEach(r => { map[r.studentId] = r.marksObtained; });
      setMarksInput(map);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveMark = async (studentId) => {
    const marks = marksInput[studentId];
    if (marks === undefined || marks === "") return;
    try {
      await enterExamResult({ examId: selectedExam.id, studentId, marksObtained: Number(marks) });
      setMsg("✅ Mark saved!");
      openMarksPanel(selectedExam);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save mark");
    }
  };

  const handlePublish = async () => {
    if (!window.confirm("Publish results for this exam? Students will be able to see them.")) return;
    try {
      await publishExamResults(selectedExam.id);
      setMsg("✅ Results published!");
      openMarksPanel(selectedExam);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to publish");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧪 Exam Management</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", margin: "15px 0", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>+ Create Exam</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr auto", gap: "10px" }}>
          <input placeholder="Exam Name (e.g. Mid-Term)" value={form.examName} onChange={e => setForm({...form, examName: e.target.value})} style={{ padding: "10px" }} />
          <select value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} style={{ padding: "10px" }}>
            <option value="">-- Subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.courseCode} - {s.courseName}</option>)}
          </select>
          <input type="date" value={form.examDate} onChange={e => setForm({...form, examDate: e.target.value})} style={{ padding: "10px" }} />
          <input type="number" placeholder="Max Marks" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: e.target.value})} style={{ padding: "10px" }} />
          <button onClick={handleCreate} style={{ padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Create</button>
        </div>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>All Exams</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Exam</th>
              <th style={{ padding: "12px" }}>Subject</th>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Max Marks</th>
              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.length === 0 && (
              <tr><td colSpan="5" style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>No exams yet</td></tr>
            )}
            {exams.map(ex => (
              <tr key={ex.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px" }}>{ex.examName}</td>
                <td style={{ padding: "12px" }}>{ex.course?.courseCode} - {ex.course?.courseName}</td>
                <td style={{ padding: "12px" }}>{ex.examDate}</td>
                <td style={{ padding: "12px" }}>{ex.maxMarks}</td>
                <td style={{ padding: "12px", display: "flex", gap: "8px" }}>
                  <button onClick={() => openMarksPanel(ex)} style={{ background: "#eff6ff", color: "#2563eb", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Enter Marks</button>
                  <button onClick={() => handleDelete(ex.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedExam && (
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ marginTop: 0 }}>📝 Marks for: {selectedExam.examName} ({selectedExam.course?.courseCode})</h3>
            <button onClick={handlePublish} style={{ background: "#16a34a", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>
              🚀 Publish Results
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left" }}>
                <th style={{ padding: "12px" }}>Student</th>
                <th style={{ padding: "12px" }}>Marks (/ {selectedExam.maxMarks})</th>
                <th style={{ padding: "12px" }}>Published?</th>
                <th style={{ padding: "12px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(st => {
                const existing = results.find(r => r.student?.id === st.id);
                return (
                  <tr key={st.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px" }}>{st.name}</td>
                    <td style={{ padding: "12px" }}>
                      <input
                        type="number"
                        value={marksInput[st.id] ?? ""}
                        onChange={e => setMarksInput({...marksInput, [st.id]: e.target.value})}
                        style={{ width: "80px", padding: "6px" }}
                      />
                    </td>
                    <td style={{ padding: "12px" }}>{existing?.published ? "✅ Yes" : "❌ No"}</td>
                    <td style={{ padding: "12px" }}>
                      <button onClick={() => handleSaveMark(st.id)} style={{ background: "#2563eb", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Save</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamManage;