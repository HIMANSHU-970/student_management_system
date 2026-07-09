import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { AuthContext } from "../../context/AuthContext";
import { getStudentAttendanceOverview, updateAttendanceOverride } from "../../services/adminService";
import { getStudentAttendanceForMyCourses, updateMyCourseAttendance } from "../../services/teacherService";

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const loadData = async () => {
    try {
      const res = isAdmin
        ? await getStudentAttendanceOverview(studentId)
        : await getStudentAttendanceForMyCourses(studentId);
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error("Load attendance error:", err);
      setError(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  const handleAttendanceChange = (id, newValue) => {
    setAttendanceData(prev =>
      prev.map(item => item.id === id ? { ...item, present: Number(newValue) } : item)
    );
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        attendanceData.map(item =>
          isAdmin
            ? updateAttendanceOverride(item.id, { present: item.present, total: item.total })
            : updateMyCourseAttendance(item.id, { present: item.present, total: item.total })
        )
      );
      alert("Record Saved Successfully!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save changes");
    }
  };

  // PDF Export Logic
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Attendance Report: ${studentId}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    const tableData = attendanceData.map(item => [
      item.course?.courseCode,
      item.course?.courseName,
      `${item.present}/${item.total}`,
      item.total > 0 ? `${((item.present / item.total) * 100).toFixed(1)}%` : "0%"
    ]);

    doc.autoTable({
      head: [['Code', 'Module', 'Attendance', 'Percentage']],
      body: tableData,
      startY: 35,
    });

    doc.save(`Attendance_${studentId}.pdf`);
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;

  return (
    <div style={{ padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={() => navigate(-1)} style={{ padding: "8px 16px", cursor: "pointer", borderRadius: "6px", border: "1px solid #cbd5e1" }}>⬅ Back</button>
        <button onClick={exportPDF} style={{ backgroundColor: "#10b981", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600" }}>📥 Download PDF Report</button>
      </div>

      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px", color: "#0f172a" }}>Attendance: {studentId}</h2>

        {error && <p style={{ color: "#991b1b", fontWeight: "bold" }}>{error}</p>}

        {!error && attendanceData.length === 0 && (
          <p style={{ color: "#64748b" }}>Ye student kisi subject mein enroll nahi hai (ya aapko assign nahi hai).</p>
        )}

        {attendanceData.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Module</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px" }}>{item.course?.courseName} ({item.course?.courseCode})</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <input
                      type="number" value={item.present}
                      onChange={(e) => handleAttendanceChange(item.id, e.target.value)}
                      style={{ width: "60px", padding: "5px", textAlign: "center", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                    /> / {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {attendanceData.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button onClick={handleSave} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
              Save All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;