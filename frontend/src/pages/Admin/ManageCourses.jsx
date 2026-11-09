import { useEffect, useState } from "react";
import axios from "axios";

function ManageCourses() {
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/admin/courses`,
        { withCredentials: true }
      );

      setCourses(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const addCourse = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/admin/course`,
        form,
        { withCredentials: true }
      );

      alert("Course Added");

      fetchCourses();
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <h2>📚 Manage Courses</h2>

      {/* FORM */}
      <div className="card">
        <input
          placeholder="Course Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button onClick={addCourse}>
          ➕ Add Course
        </button>
      </div>

      {/* LIST */}
      <h3>All Courses</h3>

      {courses.map((c) => (
        <div key={c.id} className="card">
          <h4>{c.name}</h4>
          <p>{c.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ManageCourses;