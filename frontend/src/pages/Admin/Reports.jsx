import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/api/admin/stats`,
          { withCredentials: true }
        );

        setStats(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>📊 System Reports</h2>

      <div className="card">
        <h3>👥 Total Users</h3>
        <p>{stats.users}</p>
      </div>

      <div className="card">
        <h3>📚 Total Courses</h3>
        <p>{stats.courses}</p>
      </div>
    </div>
  );
}

export default Reports;