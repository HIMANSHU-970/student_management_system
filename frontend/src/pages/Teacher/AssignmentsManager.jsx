import { useEffect, useState } from "react";
import axios from "axios";

function AssignmentsManager() {
  const [assignments, setAssignments] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    course_id: "",
  });

  // 📥 FETCH ASSIGNMENTS
  useEffect(() => {
    axios
      .get("http://localhost:5002/api/teacher/assignments", {
        withCredentials: true,
      })
      .then((res) => setAssignments(res.data));
  }, []);

  // ➕ CREATE ASSIGNMENT
  const createAssignment = async () => {
    await axios.post(
      "http://localhost:5002/api/teacher/assignment",
      form,
      { withCredentials: true }
    );

    alert("Assignment Created");

    window.location.reload();
  };

  return (
    <div>
      <h2>📝 Assignments Manager</h2>

      {/* FORM */}
      <div className="card">
        <input
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Course ID"
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}
        />

        <button onClick={createAssignment}>
          ➕ Create Assignment
        </button>
      </div>

      {/* LIST */}
      <h3>📋 All Assignments</h3>

      {assignments.length === 0 ? (
        <p>No assignments found</p>
      ) : (
        assignments.map((a) => (
          <div key={a.id} className="card">
            <h4>{a.title}</h4>
            <p>{a.description}</p>
            <small>Course ID: {a.course_id}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default AssignmentsManager;