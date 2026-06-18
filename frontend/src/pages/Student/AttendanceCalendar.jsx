import { useEffect, useState } from "react";
import axios from "axios";

function AttendanceCalendar() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    axios.get("/api/student/attendance")
      .then(res => setAttendance(res.data));
  }, []);

  return (
    <div>
      <h2>📅 Attendance Calendar</h2>

      {attendance.map((a, i) => (
        <div key={i} className="card">
          <p>📅 Date: {a.date}</p>
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AttendanceCalendar;