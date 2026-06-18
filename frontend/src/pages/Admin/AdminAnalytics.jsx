import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const AdminAnalytics = () => {
  // Mock Data: ग्राफ्स को रियल-टाइम फील देने के लिए
  const feeCollectionData = [
    { month: "Jan", Collected: 4000, Pending: 2400 },
    { month: "Feb", Collected: 5500, Pending: 1398 },
    { month: "Mar", Collected: 9800, Pending: 2000 },
    { month: "Apr", Collected: 12000, Pending: 2780 },
    { month: "May", Collected: 11000, Pending: 1890 },
    { month: "Jun", Collected: 15000, Pending: 2390 },
  ];

  const departmentData = [
    { name: "Computer Science", value: 400 },
    { name: "Information Tech", value: 300 },
    { name: "Electronics", value: 200 },
    { name: "Mechanical", value: 100 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div style={{ marginLeft: "280px", padding: "40px", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ fontSize: "1.8rem", color: "#0f172a", marginBottom: "5px" }}>📊 Campus Live Analytics Hub</h2>
      <p style={{ color: "#64748b", marginBottom: "30px" }}>संस्थान की वित्तीय और शैक्षणिक प्रगति की वास्तविक समय में निगरानी करें</p>

      {/* ⚡ Top Stats Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div style={cardStyle("#3b82f6")}>
          <h3>👥 Total Students</h3>
          <p>1,240</p>
          <small>+12% Active this semester</small>
        </div>
        <div style={cardStyle("#10b981")}>
          <h3>👨‍🏫 Total Faculty</h3>
          <p>84</p>
          <small>98% Attendance today</small>
        </div>
        <div style={cardStyle("#f59e0b")}>
          <h3>💰 Total Revenue</h3>
          <p>$54,200</p>
          <small>85% Fees Collected</small>
        </div>
        <div style={cardStyle("#ef4444")}>
          <h3>🛑 Defaulters Alert</h3>
          <p>42</p>
          <small>Pending fine notices</small>
        </div>
      </div>

      {/* ⚡ Advanced Graphs Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        {/* Graph 1: Monthly Fee Collection Status */}
        <div style={graphContainerStyle}>
          <h4 style={{ marginBottom: "20px", color: "#1e293b" }}>📈 Monthly Revenue & Fee Status (USD)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeCollectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 2: Department Distribution (Pie Chart) */}
        <div style={graphContainerStyle}>
          <h4 style={{ marginBottom: "20px", color: "#1e293b" }}>🧩 Department-wise Student Strength</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

// CSS Styles
const cardStyle = (color) => ({
  backgroundColor: "white", padding: "20px", borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)", borderTop: `5px solid ${color}`
});
const graphContainerStyle = {
  backgroundColor: "white", padding: "24px", borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
};

export default AdminAnalytics;