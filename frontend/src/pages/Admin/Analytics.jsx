import { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [attendance, setAttendance] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/analytics/attendance`, { withCredentials: true })
      .then(res => setAttendance(res.data));

    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/analytics/courses`, { withCredentials: true })
      .then(res => setCourses(res.data));

    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/analytics/users`, { withCredentials: true })
      .then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>📊 Analytics Dashboard</h2>

      {/* ATTENDANCE */}
      <div className="card">
        <h3>📊 Attendance Stats</h3>
        {attendance.map((a, i) => (
          <p key={i}>
            Course {a.course_id}: {Math.round(a.percentage)}%
          </p>
        ))}
      </div>

      {/* COURSES */}
      <div className="card">
        <h3>📚 Course Popularity</h3>
        {courses.map((c, i) => (
          <p key={i}>
            {c.name}: {c.students} students
          </p>
        ))}
      </div>

      {/* USERS */}
      <div className="card">
        <h3>👥 User Distribution</h3>
        {users.map((u, i) => (
          <p key={i}>
            {u.role}: {u.count}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Analytics;