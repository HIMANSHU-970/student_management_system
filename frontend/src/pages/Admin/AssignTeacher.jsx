import React, { useState, useEffect } from "react";
import { signupUser } from "../../services/authService";
import {
  getAllTeachers,
  getAllSubjects,
  createSubject,
  assignSubjectToTeacher,
  removeSubjectFromTeacher,
  getAllAssignments
} from "../../services/adminService";

const AssignTeacher = () => {
  const [teacherForm, setTeacherForm] = useState({ name: "", email: "", password: "", employeeId: "", department: "" });
  const [subjectForm, setSubjectForm] = useState({ courseCode: "", courseName: "", department: "", credits: 3 });
  const [assignForm, setAssignForm] = useState({ teacherId: "", courseId: "" });

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const styles = {
    input: { padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "100%", boxSizing: "border-box" },
    btn: { marginTop: "15px", padding: "10px 20px", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
    card: { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "30px" }
  };

  const loadData = async () => {
    try {
      const [tRes, sRes, aRes] = await Promise.all([
        getAllTeachers(),
        getAllSubjects(),
        getAllAssignments()
      ]);
      setTeachers(tRes.data);
      setSubjects(sRes.data);
      setAssignments(aRes.data);
    } catch (err) {
      console.error("Load error:", err);
      setMsg("Failed to load data. Check console/backend.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---- 1. CREATE TEACHER ----
  const handleCreateTeacher = async () => {
    const { name, email, password, employeeId, department } = teacherForm;
    if (!name || !email || !password) return alert("Name, Email, Password required!");

    setLoading(true);
    setMsg("");
    try {
      await signupUser({
        name,
        email: email.toLowerCase().trim(),
        password,
        role: "teacher",
        employeeId: employeeId || undefined,
        department: department || "General"
      });
      setMsg("✅ Teacher created successfully!");
      setTeacherForm({ name: "", email: "", password: "", employeeId: "", department: "" });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to create teacher"));
    } finally {
      setLoading(false);
    }
  };

  // ---- 2. CREATE SUBJECT ----
  const handleCreateSubject = async () => {
    const { courseCode, courseName, department, credits } = subjectForm;
    if (!courseCode || !courseName || !department) return alert("Course Code, Name, Department required!");

    setLoading(true);
    setMsg("");
    try {
      await createSubject({ courseCode, courseName, department, credits });
      setMsg("✅ Subject created successfully!");
      setSubjectForm({ courseCode: "", courseName: "", department: "", credits: 3 });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to create subject"));
    } finally {
      setLoading(false);
    }
  };

  // ---- 3. ASSIGN SUBJECT TO TEACHER ----
  const handleAssign = async () => {
    const { teacherId, courseId } = assignForm;
    if (!teacherId || !courseId) return alert("Select both Teacher and Subject!");

    setLoading(true);
    setMsg("");
    try {
      await assignSubjectToTeacher({ teacherId, courseId });
      setMsg("✅ Subject assigned to teacher successfully!");
      setAssignForm({ teacherId: "", courseId: "" });
      loadData();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to assign subject"));
    } finally {
      setLoading(false);
    }
  };

  // ---- 4. REMOVE ASSIGNMENT ----
  const handleRemove = async (id) => {
    if (!window.confirm("Remove this subject assignment?")) return;
    try {
      await removeSubjectFromTeacher(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove");
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Assign & Register Teacher</h2>

      {msg && (
        <div style={{ padding: "10px 16px", borderRadius: "8px", marginBottom: "20px", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>
          {msg}
        </div>
      )}

      {/* 1. CREATE TEACHER */}
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>👨‍🏫 Register New Teacher</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <input placeholder="Full Name" value={teacherForm.name} onChange={e => setTeacherForm({...teacherForm, name: e.target.value})} style={styles.input} />
          <input placeholder="Email" value={teacherForm.email} onChange={e => setTeacherForm({...teacherForm, email: e.target.value})} style={styles.input} />
          <input placeholder="Password" type="password" value={teacherForm.password} onChange={e => setTeacherForm({...teacherForm, password: e.target.value})} style={styles.input} />
          <input placeholder="Employee ID (optional)" value={teacherForm.employeeId} onChange={e => setTeacherForm({...teacherForm, employeeId: e.target.value})} style={styles.input} />
          <input placeholder="Department" value={teacherForm.department} onChange={e => setTeacherForm({...teacherForm, department: e.target.value})} style={styles.input} />
        </div>
        <button onClick={handleCreateTeacher} disabled={loading} style={{...styles.btn, background: "#2563eb"}}>
          {loading ? "Saving..." : "Register Teacher"}
        </button>
      </div>

      {/* 2. CREATE SUBJECT */}
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>📚 Create New Subject</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px" }}>
          <input placeholder="Course Code (e.g. CS-301)" value={subjectForm.courseCode} onChange={e => setSubjectForm({...subjectForm, courseCode: e.target.value})} style={styles.input} />
          <input placeholder="Course Name" value={subjectForm.courseName} onChange={e => setSubjectForm({...subjectForm, courseName: e.target.value})} style={styles.input} />
          <input placeholder="Department" value={subjectForm.department} onChange={e => setSubjectForm({...subjectForm, department: e.target.value})} style={styles.input} />
          <input placeholder="Credits" type="number" value={subjectForm.credits} onChange={e => setSubjectForm({...subjectForm, credits: e.target.value})} style={styles.input} />
        </div>
        <button onClick={handleCreateSubject} disabled={loading} style={{...styles.btn, background: "#16a34a"}}>
          {loading ? "Saving..." : "Create Subject"}
        </button>
      </div>

      {/* 3. ASSIGN SUBJECT TO TEACHER */}
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>🔗 Assign Subject to Teacher</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <select value={assignForm.teacherId} onChange={e => setAssignForm({...assignForm, teacherId: e.target.value})} style={styles.input}>
            <option value="">-- Select Teacher --</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
            ))}
          </select>
          <select value={assignForm.courseId} onChange={e => setAssignForm({...assignForm, courseId: e.target.value})} style={styles.input}>
            <option value="">-- Select Subject --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.courseCode} - {s.courseName}</option>
            ))}
          </select>
        </div>
        <button onClick={handleAssign} disabled={loading} style={{...styles.btn, background: "#f59e0b"}}>
          {loading ? "Assigning..." : "Assign Subject"}
        </button>
      </div>

      {/* 4. CURRENT ASSIGNMENTS TABLE */}
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>📋 Current Teacher-Subject Assignments</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f1f5f9" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Teacher</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Subject</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 && (
              <tr><td colSpan="4" style={{ padding: "16px", textAlign: "center", color: "#94a3b8" }}>No assignments yet</td></tr>
            )}
            {assignments.map(a => (
              <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px", color: "#2563eb", fontWeight: "600" }}>{a.teacher?.name}</td>
                <td style={{ padding: "12px" }}>{a.teacher?.email}</td>
                <td style={{ padding: "12px" }}>{a.course?.courseCode} - {a.course?.courseName}</td>
                <td style={{ padding: "12px" }}>
                  <button onClick={() => handleRemove(a.id)} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignTeacher;