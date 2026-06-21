import React, { useState, useEffect, useContext } from "react";
import { getMySubjects } from "../../services/teacherService";
import { AuthContext } from "../../context/AuthContext";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await getMySubjects();
        setSubjects(res.data || []);
      } catch (err) {
        console.error("Fetch subjects error:", err);
        setError(err.response?.data?.message || "Failed to load subjects");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
        <h1>Welcome, {user?.name || "Teacher"} 👋</h1>

        <div style={{ marginTop: "20px", backgroundColor: "#f0fdf4", padding: "20px", borderRadius: "12px", border: "1px solid #bbf7d0" }}>
          <h4 style={{ color: "#166534", margin: "0 0 10px 0" }}>📚 Assigned Subjects</h4>

          {error && <p style={{ color: "#991b1b", fontWeight: "bold" }}>{error}</p>}

          {!error && subjects.length > 0 ? (
            <ul style={{ paddingLeft: "20px" }}>
              {subjects.map((s) => (
                <li key={s.id} style={{ color: "#15803d", fontWeight: "600", fontSize: "1.1rem" }}>
                  {s.courseCode} - {s.courseName}
                </li>
              ))}
            </ul>
          ) : (
            !error && <p style={{ color: "#991b1b", fontWeight: "bold" }}>No subjects assigned yet. Contact Admin.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;