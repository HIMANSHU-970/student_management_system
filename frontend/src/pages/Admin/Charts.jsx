import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Charts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/analytics/attendance")
      .then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2>📊 Attendance Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="course_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentage" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;