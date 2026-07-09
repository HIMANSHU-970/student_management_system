import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../styles/StudentResults.css"; // CSS Import

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, profData] = await Promise.all([
          studentService.getResults(),
          studentService.getProfile()
        ]);
        setResults(resData || []);
        setProfile(profData || {});
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const calculateCGPA = () => {
    if (results.length === 0) return 0;
    const totalPoints = results.reduce((acc, r) => acc + (r.marksObtained / r.exam.maxMarks) * 10, 0);
    return (totalPoints / results.length / 2).toFixed(2);
  };

  const getGrade = (pct) => {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B+";
    if (pct >= 60) return "B";
    if (pct >= 40) return "C";
    return "F";
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("CAMPUS QUANTUM - OFFICIAL TRANSCRIPT", 105, 15, { align: "center" });

    // Profile Info
    doc.setDrawColor(0);
    doc.rect(14, 25, 182, 30);
    doc.setFontSize(10);
    doc.text(`Name: ${profile.name}`, 20, 32);
    doc.text(`Email: ${profile.email}`, 20, 38);
    doc.text(`Branch: ${profile.branch}`, 20, 44);
    doc.text(`URN: ${profile.urn}`, 120, 32);
    doc.text(`Semester: ${profile.semester}`, 120, 38);
    doc.text(`CGPA: ${calculateCGPA()}`, 120, 44);

    autoTable(doc, {
      startY: 65,
      head: [['Exam', 'Subject', 'Marks', 'Grade']],
      body: results.map(r => [r.exam.examName, r.exam.course.courseCode, `${r.marksObtained}/${r.exam.maxMarks}`, getGrade((r.marksObtained/r.exam.maxMarks)*100)]),
    });
    doc.save("Official_Transcript.pdf");
  };

  if (loading) return <div className="loading">Loading Records...</div>;

  return (
    <div className="results-container">
      <div className="profile-header">
        <div className="profile-info">
          <h2>👤 {profile.name}</h2>
          <p>{profile.branch} | URN: {profile.urn}</p>
        </div>
        <button onClick={downloadPDF} className="download-btn">⬇ Download Transcript</button>
      </div>

      <div className="cgpa-card">
        <p>Cumulative CGPA</p>
        <h1>{calculateCGPA()}</h1>
      </div>

      <table className="results-table">
        <thead>
          <tr>
            <th>Exam</th><th>Subject</th><th>Marks</th><th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.exam.examName}</td><td>{r.exam.course.courseCode}</td>
              <td>{r.marksObtained} / {r.exam.maxMarks}</td>
              <td className="grade-badge">{getGrade((r.marksObtained/r.exam.maxMarks)*100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default StudentResults;