import { useState } from "react";
import axios from "axios";

function AttendanceManager() {
  const [data, setData] = useState({
    student_id: "",
    course_id: "",
    status: "present",
  });

  const submit = async () => {
    await axios.post(
      "http://localhost:5002/api/teacher/attendance",
      data,
      { withCredentials: true }
    );

    alert("Attendance Marked");
  };

  return (
    <div>
      <h2>📊 Mark Attendance</h2>

      <input
        placeholder="Student ID"
        onChange={(e) => setData({ ...data, student_id: e.target.value })}
      />

      <input
        placeholder="Course ID"
        onChange={(e) => setData({ ...data, course_id: e.target.value })}
      />

      <select
        onChange={(e) => setData({ ...data, status: e.target.value })}
      >
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default AttendanceManager;