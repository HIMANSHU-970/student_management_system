import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const courses = JSON.parse(localStorage.getItem("global_courses")) || [];
  const invoices = JSON.parse(localStorage.getItem("global_invoices")) || [];
  const broadcasts = JSON.parse(localStorage.getItem("global_broadcasts")) || [];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ fontSize: "2.2rem", color: "#0f172a", fontWeight: "900", margin: 0 }}>🛡️ Central Command Overview</h1>
        <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Enterprise management node live overview parameters.</p>
      </div>

      {/* QUICK STATUS METRICS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px", marginBottom: "40px" }}>
        <div style={statCardStyle("#2563eb")}>
          <h3>{courses.length}</h3>
          <p>Total Active Subjects</p>
        </div>
        <div style={statCardStyle("#10b981")}>
          <h3>{invoices.filter(i => i.status === "Paid").length} / {invoices.length}</h3>
          <p>Invoices Settled</p>
        </div>
        <div style={statCardStyle("#0284c7")}>
          <h3>{broadcasts.length}</h3>
          <p>Active Announcements</p>
        </div>
      </div>

      {/* RAPID CONTROLS MAP ROUTING HUB */}
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#0f172a" }}>⚡ Quick Control Anchors</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Link to="/admin/subjects" style={anchorStyle}>📚 Manage Structural Subjects & Roster</Link>
          <Link to="/admin/attendance" style={anchorStyle}>📊 Override Student Attendance Records</Link>
          <Link to="/admin/fees" style={anchorStyle}>💳 Audit Fee Accounts & Modify Invoices</Link>
          <Link to="/admin/broadcasts" style={anchorStyle}>📢 Dispatch Global Notice Signals</Link>
        </div>
      </div>
    </div>
  );
};

const statCardStyle = (bgColor) => ({
  backgroundColor: bgColor, color: "white", padding: "24px", borderRadius: "14px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
});
const anchorStyle = {
  textDecoration: "none", color: "#1e293b", padding: "20px", backgroundColor: "#f8fafc",
  borderRadius: "10px", border: "1px solid #e2e8f0", fontWeight: "700", display: "block",
  transition: "all 0.2s"
};

export default AdminDashboard;